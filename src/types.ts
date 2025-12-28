export type JobStatus = 'Applied' | 'Follow Up' | 'Interview' | 'Rejected' | 'Offer';

export interface InterviewRound {
    id: string;
    date: string; // ISO date string
    notes: string;
    questions: string[]; // List of questions asked
}

export interface Job {
    id: string;
    company: string;
    role: string;
    location?: string; // e.g., "Remote", "NY"
    salary?: string; // e.g., "$120k"
    status: JobStatus;
    appliedDate: string; // ISO date string
    jobUrl?: string;
    description?: string;

    // Specific tracking
    interviews: InterviewRound[];
    rejectionReason?: string;
    learnings?: string; // What I learned from this process

    createdAt: string;
    updatedAt: string;
}

export type ContactStatus = 'To Contact' | 'Contacted' | 'Replied' | 'Ghosted' | 'Connected';

export interface Contact {
    id: string;
    name: string;
    role: string;
    company: string;
    email?: string;
    linkedin?: string;
    status: ContactStatus;
    notes?: string;
    lastContactDate?: string;

    createdAt: string;
    updatedAt: string;
}

export interface Template {
    id: string;
    title: string;
    content: string;
    type?: 'Cover Letter' | 'Email' | 'Message' | 'Other';
    updatedAt: string;
}

export interface SocialLink {
    id: string;
    platform: string;
    url: string;
}
