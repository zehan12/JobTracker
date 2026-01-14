import * as cheerio from "cheerio";
import { url } from "inspector";
import { NextResponse } from "next/server";

// Helper to parse Naukri URLs specifically
function parseNaukriUrl(urlStr: string) {
  try {
    const u = new URL(urlStr);
    if (!u.hostname.includes("naukri.com")) return null;

    const path = u.pathname;
    // Expected format: /job-listings-<slug>-<experience>-<id>
    // Example: /job-listings-react-js-developer-connexion-group-bengaluru-4-to-5-years-080126020213

    // Remove known prefix
    let slug = path.replace(/^\/job-listings-/, "").replace(/^\//, "");

    // Extract ID (last digits)
    const idMatch = slug.match(/-(\d+)$/);
    if (idMatch) {
      slug = slug.substring(0, slug.length - idMatch[0].length);
    }

    // Extract pattern like "4-to-5-years" or "0-to-1-years"
    // It's usually at the end of the slug
    let experience = "";
    const expMatch =
      slug.match(/-(\d+-to-\d+-years)$/) || slug.match(/-(\d+-years)$/);
    if (expMatch) {
      experience = expMatch[1].replace(/-/g, " "); // "4 to 5 years"
      slug = slug.substring(0, slug.length - expMatch[0].length);
    }

    // Remaining slug is "role-company-location" (usually)
    // Try to extract location from end if it matches known cities
    // List of common Indian IT hubs + others
    const commonLocations = [
      "bengaluru",
      "bangalore",
      "pune",
      "hyderabad",
      "chennai",
      "mumbai",
      "gurugram",
      "gurgaon",
      "noida",
      "delhi",
      "kolkata",
      "ahmedabad",
      "indore",
      "chandigarh",
      "jaipur",
      "kochi",
      "trivandrum",
      "bhubaneswar",
      "mysore",
    ];

    let location = "";
    const parts = slug.split("-");

    // Check identifying suffix for location
    const possibleLoc = parts[parts.length - 1];
    if (
      commonLocations.some((loc) => possibleLoc?.toLowerCase().includes(loc))
    ) {
      location = possibleLoc.charAt(0).toUpperCase() + possibleLoc.slice(1);
      parts.pop(); // Remove location from parts
    } else if (parts.length >= 2) {
      // Check provided example where location might be hyphenated?
      // e.g. "new-delhi". For now, singular city check is okay.
    }

    // The remaining parts contain Role + Company.
    // Heuristic: Iterate backwards. If we hit a common "Role Keyword", we assume everything before it (inclusive) is Role, and everything after is Company.

    const roleKeywords = [
      "developer",
      "engineer",
      "manager",
      "lead",
      "architect",
      "consultant",
      "analyst",
      "designer",
      "specialist",
      "admin",
      "administrator",
      "executive",
      "tester",
      "technician",
      "officer",
      "intern",
      "assistant",
      "scientist",
      "rep",
      "representative",
      "director",
      "head",
      "vp",
      "president",
      "chief",
      "recruiter",
      "hr",
      "coordinator",
      "dev",
      "frontend",
      "backend",
      "fullstack",
    ];

    let splitIndex = parts.length; // Default: All role, no company

    // Iterate form end to start
    for (let i = parts.length - 1; i >= 0; i--) {
      // Check if parts[i] contains any keyword
      const word = parts[i].toLowerCase();
      // plural check: "developers"
      if (roleKeywords.some((kw) => word === kw || word === `${kw}s`)) {
        splitIndex = i + 1; // Split AFTER this word.
        break;
      }
    }

    const roleParts = parts.slice(0, splitIndex);
    const companyParts = parts.slice(splitIndex);

    // Capitalize Helper
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    const role = roleParts.map(capitalize).join(" ");
    const company = companyParts.map(capitalize).join(" ");

    return {
      company,
      role: role || company, // Fallback if split went weird
      location,
      experience,
      platform: "Naukri",
      logoUrl: "https://img.naukri.com/logo_images/groups/v2/0/4/aaa.gif", // Generic Naukri or leave for favicon
    };
  } catch (e) {
    return null;
  }
}

export async function POST(req: Request) {
  let url = "";
  try {
    const body = await req.json();
    url = body.url;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Pre-calculate Naukri fallback
    const naukriData = parseNaukriUrl(url);

    const response = await fetch(url, {
      headers: {
        // Mimic a browser to avoid some basic bot detection
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Helper to get meta content
    const getMeta = (name: string) =>
      $(`meta[property="${name}"]`).attr("content") ||
      $(`meta[name="${name}"]`).attr("content") ||
      null;

    const title = getMeta("og:title") || $("title").text() || "";
    const siteName = getMeta("og:site_name") || "";
    const metaDescription =
      getMeta("og:description") ||
      $('meta[name="description"]').attr("content") ||
      "";
    let image = getMeta("og:image");

    // Initialize vars with meta values
    let company = siteName;
    let role = title;
    let description = metaDescription;
    let location = "";
    let salary = "";
    let experience = "";
    let jobType = "";

    // If Naukri, use parsed data as base if meta is generic or empty
    if (naukriData) {
      if (!company || company === "Naukri.com") company = naukriData.company; // likely empty, but better than "Naukri.com"
      // If parsed role is cleaner than "Job Title - Company - Location" often found in <title>
      // Actually <title> is usually "Role - Company - Location - Exp".
      // Logic: prefer scraped JSON-LD > parsed URL > meta tags
      if (naukriData.location) location = naukriData.location;
      if (naukriData.experience) experience = naukriData.experience;
    }

    // Try to parse JSON-LD for rich availability (JobPosting)
    try {
      const jsonLdScripts = $('script[type="application/ld+json"]');
      jsonLdScripts.each((_, element) => {
        const content = $(element).html();
        if (content) {
          const json = JSON.parse(content);
          // Handle both single object and graph arrays
          const entities = Array.isArray(json)
            ? json
            : json["@graph"] || [json];

          const jobPosting = entities.find(
            (e: any) => e["@type"] === "JobPosting",
          );

          if (jobPosting) {
            if (jobPosting.hiringOrganization?.name)
              company = jobPosting.hiringOrganization.name;
            if (jobPosting.title) role = jobPosting.title;
            if (jobPosting.description) {
              description = jobPosting.description.replace(/<[^>]*>?/gm, "");
              description = description
                .replace(/&nbsp;/g, " ")
                .replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">");
            }

            if (jobPosting.jobLocation) {
              if (jobPosting.jobLocation.address) {
                const addr = jobPosting.jobLocation.address;
                const parts = [addr.addressLocality, addr.addressRegion].filter(
                  Boolean,
                );
                if (parts.length > 0) location = parts.join(", ");
              }
            }

            if (jobPosting.baseSalary) {
              const sal = jobPosting.baseSalary;
              if (typeof sal === "object") {
                const min = sal.value?.minValue;
                const max = sal.value?.maxValue;
                const val = sal.value?.value;
                const unit =
                  sal.value?.unitText === "YEAR"
                    ? "/yr"
                    : sal.value?.unitText
                      ? ` / ${sal.value.unitText}`
                      : "";
                const currency = sal.currency || "$";

                if (min && max)
                  salary = `${currency}${min} - ${currency}${max}${unit}`;
                else if (val) salary = `${currency}${val}${unit}`;
              }
            }

            if (jobPosting.employmentType) {
              const type = Array.isArray(jobPosting.employmentType)
                ? jobPosting.employmentType.join(", ")
                : jobPosting.employmentType;
              // Clean up "FULL_TIME" -> "Full Time"
              const cleanType = (type || "")
                .replace(/_/g, " ")
                .toLowerCase()
                .replace(/\b\w/g, (c: string) => c.toUpperCase());
              jobType = jobType ? `${jobType} | ${cleanType}` : cleanType;
            }

            if (jobPosting.experienceRequirements) {
              if (typeof jobPosting.experienceRequirements === "string") {
                experience = jobPosting.experienceRequirements;
              } else if (jobPosting.experienceRequirements?.name) {
                experience = jobPosting.experienceRequirements.name;
              }
            }
          }
        }
      });
    } catch (e) {
      console.error("JSON-LD parse error", e);
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

      if (lowerDesc.includes("remote") || lowerTitle.includes("remote"))
        types.push("Remote");
      if (lowerDesc.includes("hybrid") || lowerTitle.includes("hybrid"))
        types.push("Hybrid");
      if (
        lowerDesc.includes("full-time") ||
        lowerTitle.includes("full-time") ||
        lowerDesc.includes("full time")
      )
        types.push("Full-time");
      if (lowerDesc.includes("contract") || lowerTitle.includes("contract"))
        types.push("Contract");

      jobType = [...new Set(types)].join(" | ");
    }

    if (!experience) {
      const lowerTitle = title.toLowerCase();
      if (lowerTitle.includes("senior") || lowerTitle.includes("sr."))
        experience = "Senior";
      else if (lowerTitle.includes("lead")) experience = "Lead";
      else if (lowerTitle.includes("principal")) experience = "Principal";
      else if (lowerTitle.includes("junior") || lowerTitle.includes("jr."))
        experience = "Junior";
      else if (lowerTitle.includes("intern")) experience = "Intern";

      if (!experience) {
        const yearsMatch = description.match(/(\d+)\+?\s*years?/i);
        if (yearsMatch) experience = `${yearsMatch[0]} experience`;
      }
    }

    // Helper to check if URL is valid image
    const isValidUrl = (s: string) => {
      try {
        return new URL(s).protocol.startsWith("http");
      } catch {
        return false;
      }
    };

    // Fallback for logo: favicon
    if (!image || !isValidUrl(image)) {
      const favicon =
        $('link[rel="icon"]').attr("href") ||
        $('link[rel="shortcut icon"]').attr("href");
      if (favicon) {
        // Handle relative favicon URLs
        if (favicon.startsWith("http")) {
          image = favicon;
        } else if (favicon.startsWith("//")) {
          image = `https:${favicon}`;
        } else {
          const u = new URL(url);
          image = `${u.protocol}//${u.host}${favicon.startsWith("/") ? "" : "/"}${favicon}`;
        }
      }
    }

    // If still no image, standard Google Favicon fallback
    if (!image) {
      image = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=128`;
    }

    // Final cleanup with Naukri overrides if scraped data is missing
    if (naukriData) {
      if (role === "" || role === title) {
        // title often has junk
        // If scraped Title is extremely long (like full page title), prefer parsed short role
        // e.g. "React Js Developer Jobs in Bengaluru - Connexion Group..."
        if (role.toLowerCase().includes("jobs") || role.length > 50) {
          role = naukriData.role;
          // Try to fish company out of title if we can
          // "Role - Company - Loc"
          // But naukriData.role is just "React Js Developer Connexion Group" (combined)
          // If we use that, it's okay.
        }
      }
      if (!experience) experience = naukriData.experience;
      if (!location) location = naukriData.location;
      if (!company && naukriData.company) company = naukriData.company;
      // If platform wasn't already detected (it will be by hostname logic below), set it
    }

    // ... existing platform/hostname logic ...
    // Re-implementing return to include logic

    const u = new URL(url);
    const hostname = u.hostname.replace("www.", "");

    // Simple Platform/Company guess
    let platform = "";
    if (hostname.includes("linkedin")) platform = "LinkedIn";
    else if (hostname.includes("indeed")) platform = "Indeed";
    else if (hostname.includes("wellfound")) platform = "Wellfound";
    else if (hostname.includes("ycombinator")) platform = "Y Combinator";
    else if (hostname.includes("naukri")) platform = "Naukri";
    else platform = hostname.split(".")[0];

    platform = platform.charAt(0).toUpperCase() + platform.slice(1);

    return NextResponse.json({
      company: company.trim(),
      role: role.trim(),
      platform: platform,
      description: description.trim(),
      location: location.trim(),
      salary: salary.trim(),
      experience: experience.trim(),
      jobType: jobType.trim(),
      logoUrl: image,
      isScraped: true,
    });
  } catch (error) {
    console.error("Scraping error:", error);
    // Fallback: Try to derive basic info from URL even if scrape fails
    try {
      const u = new URL(url);
      const hostname = u.hostname.replace("www.", "");

      // Simple Platform/Company guess
      let platform = "";
      if (hostname.includes("linkedin")) platform = "LinkedIn";
      else if (hostname.includes("indeed")) platform = "Indeed";
      else if (hostname.includes("wellfound")) platform = "Wellfound";
      else if (hostname.includes("ycombinator")) platform = "Y Combinator";
      else if (hostname.includes("naukri")) platform = "Naukri";
      else platform = hostname.split(".")[0];

      platform = platform.charAt(0).toUpperCase() + platform.slice(1);

      // Check for Naukri parser data
      let fallbackData: any = {};
      if (platform === "Naukri") {
        const nd = parseNaukriUrl(url);
        if (nd) fallbackData = nd;
      }

      return NextResponse.json({
        company: fallbackData.company || "",
        role: fallbackData.role || "",
        platform: platform,
        description: "",
        location: fallbackData.location || "",
        salary: "",
        experience: fallbackData.experience || "",
        logoUrl: `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`,
        isScraped: false, // Partial
      });
    } catch (e) {
      return NextResponse.json(
        { error: "Failed to scrape URL" },
        { status: 500 },
      );
    }
  }
}
