import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Job, JobStatus } from "@/types";

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, status: JobStatus) => void;
}

const statusDotColors: Record<JobStatus, string> = {
  Applied: "bg-blue-500",
  "Follow Up": "bg-yellow-500",
  Interview: "bg-purple-500",
  Rejected: "bg-red-500",
  Offer: "bg-green-500",
};

export function JobCard({ job, onEdit, onDelete }: JobCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: job.id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0 : 1, // Hide original when dragging (overlay will show)
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <JobCardContent job={job} onEdit={onEdit} />
    </div>
  );
}

export function JobCardContent({
  job,
  onEdit,
}: {
  job: Job;
  onEdit: (job: Job) => void;
}) {
  const formattedDate = new Date(job.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <Card
      onClick={() => onEdit(job)}
      className="group relative bg-card border border-border hover:border-foreground shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer rounded-lg active:scale-[0.98] p-0 gap-0"
    >
      <CardContent className="p-4 space-y-2">
        <div className="flex gap-2.5">
          {job.logoUrl ? (
            <div className="w-8 h-8 rounded-md overflow-hidden shrink-0 border border-border bg-background">
              <img
                src={job.logoUrl}
                alt={`${job.company} logo`}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center shrink-0 text-muted-foreground font-bold text-xs">
              {job.company.charAt(0)}
            </div>
          )}

          <div className="space-y-0.5 min-w-0 flex-1">
            <h3 className="font-semibold text-foreground text-xs leading-tight truncate pr-2">
              {job.role}
            </h3>
            <p className="text-muted-foreground text-[10px] truncate">{job.company}</p>
          </div>

          {job.status === "Interview" && (
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-1" />
          )}
          <span className="text-[9px] text-muted-foreground">{formattedDate}</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {job.jobType && (
            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground">
              {job.jobType.split("|")[0].trim()}
            </span>
          )}
          {job.experience && (
            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground">
              {job.experience}
            </span>
          )}
          {job.location && (
            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground">
              {job.location}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 mt-0.5 border-t border-border">
          <div className="flex gap-1.5">
            {job.interviews?.length > 0 && (
              <Badge
                variant="secondary"
                className="text-[9px] px-1 h-auto py-0 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-none"
              >
                {job.interviews.length} Rounds
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
