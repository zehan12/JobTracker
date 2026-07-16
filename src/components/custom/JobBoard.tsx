"use client";

import { useState } from "react";
import { useTracker } from "@/hooks/useTracker";
import type { Job, JobStatus } from "@/types";
import { JobColumn } from "./JobColumn";
import { JobModal } from "./JobModal";

const COLUMNS: { title: string; status: JobStatus }[] = [
  { title: "Applied", status: "Applied" },
  { title: "Follow Up", status: "Follow Up" },
  { title: "Interview", status: "Interview" },
  { title: "Offer", status: "Offer" },
  { title: "Rejected", status: "Rejected" },
];

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { JobCardContent } from "./JobCard";

export function JobBoard() {
  const { jobs, addJob, updateJob, deleteJob, isLoaded } = useTracker();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [initialStatus, setInitialStatus] = useState<JobStatus>("Applied");
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const job = jobs.find((j) => j.id === active.id);
    if (job) setActiveJob(job);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const jobId = active.id as string;
      const newStatus = over.id as JobStatus;

      // Only update if status is different and valid
      if (Object.values(COLUMNS).some((col) => col.status === newStatus)) {
        updateJob(jobId, { status: newStatus });
      }
    }
    setActiveJob(null);
  };

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
        platform: data.platform,
        logoUrl: data.logoUrl,
      });
    }
    setIsModalOpen(false);
  };

  if (!isLoaded)
    return <div className="p-10 text-muted-foreground">Loading your board...</div>;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
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
            onDelete={deleteJob}
          />
        )}

        <DragOverlay>
          {activeJob ? (
            <JobCardContent job={activeJob} onEdit={() => {}} />
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
