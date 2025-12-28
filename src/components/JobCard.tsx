import { Job, JobStatus } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    const formattedDate = new Date(job.createdAt).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric'
    });

    return (
        <Card
            onClick={() => onEdit(job)}
            className="group relative bg-zinc-950 border border-zinc-800 hover:border-zinc-600 transition-all duration-200 cursor-pointer shadow-none rounded-lg"
        >
            <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <h3 className="font-semibold text-zinc-100 text-sm leading-tight">{job.role}</h3>
                        <p className="text-zinc-500 text-xs">{job.company}</p>
                    </div>
                    {job.status === 'Interview' && (
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-900/50">
                    <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${statusDotColors[job.status]}`} />
                        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                            {job.status}
                        </span>
                    </div>
                    <span className="text-[10px] text-zinc-600">{formattedDate}</span>
                </div>

                {(job.interviews.length > 0 || job.learnings) && (
                    <div className="flex gap-2 pt-1">
                        {job.interviews.length > 0 && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 h-5 bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800">
                                {job.interviews.length} Rounds
                            </Badge>
                        )}
                        {job.learnings && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 h-5 bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800">
                                Learnings
                            </Badge>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
