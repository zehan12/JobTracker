import { useDroppable } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Job, JobStatus } from "@/types";
import { JobCard } from "./JobCard";
import { PlusIcon } from "@/components/ui/Icons";

interface JobColumnProps {
  title: string;
  status: JobStatus;
  jobs: Job[];
  onAdd: (status: JobStatus) => void;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

export function JobColumn({
  title,
  status,
  jobs,
  onAdd,
  onEdit,
  onDelete,
}: JobColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  const statusColorMap = {
    Applied: "bg-blue-500",
    "Follow Up": "bg-yellow-500",
    Interview: "bg-purple-500",
    Offer: "bg-green-500",
    Rejected: "bg-red-500",
  };

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col h-full min-w-[320px] w-full max-w-sm bg-secondary border border-border rounded-xl p-3 transition-colors data-[over=true]:bg-accent"
    >
      <div className="flex justify-between items-center mb-3 px-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          {title}
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-background border border-border text-muted-foreground font-medium ml-1">
            {jobs.length}
          </span>
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onAdd(status)}
          className="text-muted-foreground hover:text-foreground hover:bg-background border border-transparent hover:border-border h-8 w-8"
        >
          <PlusIcon className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 no-scrollbar">
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-24 rounded-lg opacity-0 hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              onClick={() => onAdd(status)}
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              + Add Job
            </Button>
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onEdit={onEdit}
              onDelete={onDelete}
              onMove={() => {}} // Placeholder
            />
          ))
        )}
      </div>
    </div>
  );
}
