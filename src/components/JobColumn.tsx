import { Job, JobStatus } from "@/types";
import { JobCard } from "./JobCard";
import { PlusIcon } from "./ui/Icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface JobColumnProps {
    title: string;
    status: JobStatus;
    jobs: Job[];
    onAdd: (status: JobStatus) => void;
    onEdit: (job: Job) => void;
    onDelete: (id: string) => void;
}

export function JobColumn({ title, status, jobs, onAdd, onEdit, onDelete }: JobColumnProps) {
    const statusColorMap = {
        Applied: 'bg-blue-500',
        'Follow Up': 'bg-yellow-500',
        Interview: 'bg-purple-500',
        Offer: 'bg-green-500',
        Rejected: 'bg-red-500',
    };

    return (
        <div className="flex flex-col h-full min-w-[320px] w-full max-w-sm bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4 px-1">
                <h2 className="text-zinc-100 font-semibold flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${statusColorMap[status]}`}></span>
                    {title}
                    <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 hover:bg-zinc-800 ml-1">
                        {jobs.length}
                    </Badge>
                </h2>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onAdd(status)}
                    className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 h-8 w-8"
                >
                    <PlusIcon className="w-5 h-5" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 no-scrollbar">
                {jobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-zinc-800/50 rounded-xl">
                        <p className="text-zinc-600 text-sm mb-2">No jobs yet</p>
                        <Button
                            variant="link"
                            onClick={() => onAdd(status)}
                            className="text-blue-500 h-auto p-0 text-sm"
                        >
                            Add one
                        </Button>
                    </div>
                ) : (
                    jobs.map((job) => (
                        <JobCard
                            key={job.id}
                            job={job}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onMove={() => { }} // Placeholder
                        />
                    ))
                )}
            </div>
        </div>
    );
}
