import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { url } from 'inspector';

export async function POST(req: Request) {
    let url = '';
    try {
        const body = await req.json();
        url = body.url;

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        const response = await fetch(url, {
            headers: {
                // Mimic a browser to avoid some basic bot detection
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch page: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Helper to get meta content
        const getMeta = (name: string) =>
            $(`meta[property="${name}"]`).attr('content') ||
            $(`meta[name="${name}"]`).attr('content') ||
            null;

        const title = getMeta('og:title') || $('title').text() || '';
        const siteName = getMeta('og:site_name') || '';
        const metaDescription = getMeta('og:description') || $('meta[name="description"]').attr('content') || '';
        let image = getMeta('og:image');

        // Initialize vars with meta values
        let company = siteName;
        let role = title;
        let description = metaDescription;
        let location = '';
        let salary = '';
        let experience = '';
        let jobType = '';

        // Try to parse JSON-LD for rich availability (JobPosting)
        try {
            const jsonLdScripts = $('script[type="application/ld+json"]');
            jsonLdScripts.each((_, element) => {
                const content = $(element).html();
                if (content) {
                    const json = JSON.parse(content);
                    // Handle both single object and graph arrays
                    const entities = Array.isArray(json) ? json : (json['@graph'] || [json]);

                    const jobPosting = entities.find((e: any) => e['@type'] === 'JobPosting');

                    if (jobPosting) {
                        if (jobPosting.hiringOrganization?.name) company = jobPosting.hiringOrganization.name;
                        if (jobPosting.title) role = jobPosting.title;
                        if (jobPosting.description) {
                            description = jobPosting.description.replace(/<[^>]*>?/gm, '');
                            description = description
                                .replace(/&nbsp;/g, ' ')
                                .replace(/&amp;/g, '&')
                                .replace(/&lt;/g, '<')
                                .replace(/&gt;/g, '>');
                        }

                        if (jobPosting.jobLocation) {
                            if (jobPosting.jobLocation.address) {
                                const addr = jobPosting.jobLocation.address;
                                const parts = [addr.addressLocality, addr.addressRegion].filter(Boolean);
                                if (parts.length > 0) location = parts.join(', ');
                            }
                        }

                        if (jobPosting.baseSalary) {
                            const sal = jobPosting.baseSalary;
                            if (typeof sal === 'object') {
                                const min = sal.value?.minValue;
                                const max = sal.value?.maxValue;
                                const val = sal.value?.value;
                                const unit = sal.value?.unitText === 'YEAR' ? '/yr' : (sal.value?.unitText ? ` / ${sal.value.unitText}` : '');
                                const currency = sal.currency || '$';

                                if (min && max) salary = `${currency}${min} - ${currency}${max}${unit}`;
                                else if (val) salary = `${currency}${val}${unit}`;
                            }
                        }

                        if (jobPosting.employmentType) {
                            const type = Array.isArray(jobPosting.employmentType) ? jobPosting.employmentType.join(', ') : jobPosting.employmentType;
                            // Clean up "FULL_TIME" -> "Full Time"
                            const cleanType = (type || '').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase());
                            jobType = jobType ? `${jobType} | ${cleanType}` : cleanType;
                        }

                        if (jobPosting.experienceRequirements) {
                            if (typeof jobPosting.experienceRequirements === 'string') {
                                experience = jobPosting.experienceRequirements;
                            } else if (jobPosting.experienceRequirements?.name) {
                                experience = jobPosting.experienceRequirements.name;
                            }
                        }
                    }
                }
            });
        } catch (e) {
            console.error('JSON-LD parse error', e);
        }

        // Regex Fallbacks if empty
        if (!salary) {
            const moneyRegex = /([$€£₹]\d+[kK]?)(\s*-\s*([$€£₹]\d+[kK]?))?/i;
            const match = description.match(moneyRegex);
            if (match) salary = match[0];
        }

        if (!jobType) {
            const types = [];
            const lowerDesc = description.toLowerCase();
            const lowerTitle = title.toLowerCase();

            if (lowerDesc.includes('remote') || lowerTitle.includes('remote')) types.push('Remote');
            if (lowerDesc.includes('hybrid') || lowerTitle.includes('hybrid')) types.push('Hybrid');
            if (lowerDesc.includes('full-time') || lowerTitle.includes('full-time') || lowerDesc.includes('full time')) types.push('Full-time');
            if (lowerDesc.includes('contract') || lowerTitle.includes('contract')) types.push('Contract');

            jobType = [...new Set(types)].join(' | ');
        }

        if (!experience) {
            const lowerTitle = title.toLowerCase();
            if (lowerTitle.includes('senior') || lowerTitle.includes('sr.')) experience = 'Senior';
            else if (lowerTitle.includes('lead')) experience = 'Lead';
            else if (lowerTitle.includes('principal')) experience = 'Principal';
            else if (lowerTitle.includes('junior') || lowerTitle.includes('jr.')) experience = 'Junior';
            else if (lowerTitle.includes('intern')) experience = 'Intern';

            if (!experience) {
                const yearsMatch = description.match(/(\d+)\+?\s*years?/i);
                if (yearsMatch) experience = `${yearsMatch[0]} experience`;
            }
        }

        // Helper to check if URL is valid image
        const isValidUrl = (s: string) => {
            try { return new URL(s).protocol.startsWith('http'); }
            catch { return false; }
        };

        // Fallback for logo: favicon
        if (!image || !isValidUrl(image)) {
            const favicon = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href');
            if (favicon) {
                // Handle relative favicon URLs
                if (favicon.startsWith('http')) {
                    image = favicon;
                } else if (favicon.startsWith('//')) {
                    image = `https:${favicon}`;
                } else {
                    const u = new URL(url);
                    image = `${u.protocol}//${u.host}${favicon.startsWith('/') ? '' : '/'}${favicon}`;
                }
            }
        }

        // If still no image, standard Google Favicon fallback
        if (!image) {
            image = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=128`;
        }

        // ... existing platform/hostname logic ...


        // ... existing return ...

    } catch (error) {
        console.error('Scraping error:', error);
        // Fallback: Try to derive basic info from URL even if scrape fails
        try {
            const u = new URL(url);
            const hostname = u.hostname.replace('www.', '');

            // Simple Platform/Company guess
            let platform = '';
            if (hostname.includes('linkedin')) platform = 'LinkedIn';
            else if (hostname.includes('indeed')) platform = 'Indeed';
            else if (hostname.includes('wellfound')) platform = 'Wellfound';
            else if (hostname.includes('ycombinator')) platform = 'Y Combinator';
            else platform = hostname.split('.')[0];

            platform = platform.charAt(0).toUpperCase() + platform.slice(1);

            return NextResponse.json({
                company: '',
                role: '',
                platform: platform,
                description: '',
                location: '',
                salary: '',
                logoUrl: `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`,
                isScraped: false // Partial
            });

        } catch (e) {
            return NextResponse.json({ error: 'Failed to scrape URL' }, { status: 500 });
        }
    }
}
