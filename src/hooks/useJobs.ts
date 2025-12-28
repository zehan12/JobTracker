"use client";

import { useState, useEffect } from "react";
import { Job, JobStatus, InterviewRound } from "../types";

const STORAGE_KEY = "job-application-tracker-v1";

export function useJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setJobs(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse jobs from local storage", e);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
        }
    }, [jobs, isLoaded]);

    const addJob = (job: Omit<Job, "id" | "createdAt" | "updatedAt" | "interviews">) => {
        const newJob: Job = {
            ...job,
            id: crypto.randomUUID(),
            interviews: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setJobs((prev) => [newJob, ...prev]);
    };

    const updateJob = (id: string, updates: Partial<Job>) => {
        setJobs((prev) =>
            prev.map((job) =>
                job.id === id ? { ...job, ...updates, updatedAt: new Date().toISOString() } : job
            )
        );
    };

    const deleteJob = (id: string) => {
        setJobs((prev) => prev.filter((job) => job.id !== id));
    };

    const moveJobStatus = (id: string, status: JobStatus) => {
        updateJob(id, { status });
    };

    const addInterview = (jobId: string, interview: Omit<InterviewRound, "id">) => {
        setJobs((prev) =>
            prev.map((job) => {
                if (job.id !== jobId) return job;
                return {
                    ...job,
                    interviews: [
                        ...job.interviews,
                        { ...interview, id: crypto.randomUUID() },
                    ],
                    updatedAt: new Date().toISOString(),
                };
            })
        );
    };

    return {
        jobs,
        isLoaded,
        addJob,
        updateJob,
        deleteJob,
        moveJobStatus,
        addInterview,
    };
}
