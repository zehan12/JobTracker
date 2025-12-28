"use client";

import { useTracker } from "@/hooks/useTracker";
import { JobColumn } from "./JobColumn";
import { JobStatus, Job } from "@/types";
import { useState } from "react";
import { JobModal } from "./JobModal";

const COLUMNS: { title: string; status: JobStatus }[] = [
    { title: "Applied", status: "Applied" },
    { title: "Follow Up", status: "Follow Up" },
    { title: "Interview", status: "Interview" },
    { title: "Offer", status: "Offer" },
    { title: "Rejected", status: "Rejected" },
];

export function JobBoard() {
    const { jobs, addJob, updateJob, deleteJob, isLoaded } = useTracker();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const [initialStatus, setInitialStatus] = useState<JobStatus>("Applied");

    const handleAddClick = (status: JobStatus) => {
        setInitialStatus(status);
        setEditingJob(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (job: Job) => {
        setEditingJob(job);
        setIsModalOpen(true);
    };

    const handleModalSubmit = (data: Partial<Job>) => {
        if (editingJob) {
            updateJob(editingJob.id, data);
        } else {
            addJob({
                company: data.company!,
                role: data.role!,
                status: data.status || initialStatus,
                location: data.location,
                salary: data.salary,
                jobUrl: data.jobUrl,
                description: data.description,
                appliedDate: new Date().toISOString(),
                rejectionReason: data.rejectionReason,
                learnings: data.learnings,
            });
        }
        setIsModalOpen(false);
    };

    if (!isLoaded) return <div className="p-10 text-zinc-400">Loading your board...</div>;

    return (
        <div className="flex h-[calc(100vh-120px)] overflow-x-auto gap-6 pb-4 px-2 no-scrollbar">
            {COLUMNS.map((col) => (
                <JobColumn
                    key={col.status}
                    title={col.title}
                    status={col.status}
                    jobs={jobs.filter((j) => j.status === col.status)}
                    onAdd={handleAddClick}
                    onEdit={handleEditClick}
                    onDelete={deleteJob}
                />
            ))}

            {isModalOpen && (
                <JobModal
                    isOpen={isModalOpen}
                    initialData={editingJob || undefined}
                    initialStatus={initialStatus}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleModalSubmit}
                />
            )}
        </div>
    );
}
