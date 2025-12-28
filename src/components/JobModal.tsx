import { Job, JobStatus, InterviewRound } from "@/types";
import { useState, useEffect } from "react";
import { InterviewSection } from "./InterviewSection";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface JobModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Job>) => void;
    onDelete: (id: string) => void;
    initialData?: Job;
    initialStatus: JobStatus;
}

export function JobModal({ isOpen, onClose, onSubmit, onDelete, initialData, initialStatus }: JobModalProps) {
    const [formData, setFormData] = useState<Partial<Job>>({
        company: "",
        role: "",
        platform: "",
        location: "",
        salary: "",
        jobUrl: "",
        description: "",
        status: initialStatus,
        rejectionReason: "",
        learnings: "",
        interviews: [],
        logoUrl: "",
    });

    const [mode, setMode] = useState<'view' | 'edit'>(initialData ? 'view' : 'edit');

    // Reset mode when modal opens/closes or initialData changes
    useEffect(() => {
        if (isOpen) {
            setMode(initialData ? 'view' : 'edit');
            if (initialData) {
                setFormData(initialData);
            } else {
                setFormData({
                    company: "",
                    role: "",
                    platform: "",
                    location: "",
                    salary: "",
                    jobUrl: "",
                    description: "",
                    status: initialStatus,
                    rejectionReason: "",
                    learnings: "",
                    interviews: [],
                    logoUrl: "",
                });
            }
        }
    }, [isOpen, initialData, initialStatus]);

    const [isScraping, setIsScraping] = useState(false);

    const handleUrlBlur = async () => {
        if (!formData.jobUrl) return;

        // Don't scrape if we already have data to avoid overwriting user edits
        if (formData.company && formData.role) return;

        setIsScraping(true);
        try {
            const res = await fetch('/api/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: formData.jobUrl })
            });

            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({
                    ...prev,
                    company: prev.company || data.company,
                    role: prev.role || data.role,
                    platform: prev.platform || data.platform,
                    description: prev.description || data.description,
                    logoUrl: prev.logoUrl || data.logoUrl,
                    location: prev.location || data.location,
                    salary: prev.salary || data.salary,
                    experience: prev.experience || data.experience,
                    jobType: prev.jobType || data.jobType,
                }));
                toast.success("Details auto-filled from URL");
            }
        } catch (error) {
            console.error("Scraping failed", error);
        } finally {
            setIsScraping(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        toast.success("Job saved successfully");
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this application?")) {
            onDelete(initialData!.id);
            onClose();
            toast.success("Job deleted");
        }
    };

    const renderViewMode = () => (
        <div className="space-y-6">
            <div className="flex items-start gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                {formData.logoUrl ? (
                    <div className="w-20 h-20 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 overflow-hidden shrink-0">
                        <img src={formData.logoUrl} alt={`${formData.company} logo`} className="w-full h-full object-cover" />
                    </div>
                ) : (
                    <div className="w-20 h-20 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
                        <span className="text-2xl font-bold text-zinc-500 dark:text-zinc-400">{formData.company?.charAt(0) || "?"}</span>
                    </div>
                )}
                <div className="flex-1 min-w-0 pt-1">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 truncate">{formData.role}</h2>
                    <div className="flex items-center gap-2 mt-1 text-zinc-500 dark:text-zinc-400">
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">{formData.company}</span>
                        {formData.platform && (
                            <>
                                <span>•</span>
                                <span>{formData.platform}</span>
                            </>
                        )}
                    </div>
                    {formData.location && (
                        <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">{formData.location}</p>
                    )}
                </div>
                <div className="flex flex-col gap-2 items-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${formData.status === 'Offer' ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20' :
                        formData.status === 'Rejected' ? 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20' :
                            'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
                        }`}>
                        {formData.status}
                    </span>
                    {formData.jobUrl && (
                        <a
                            href={formData.jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline"
                        >
                            View Job Post ↗
                        </a>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                {formData.salary && (
                    <div>
                        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Salary</h3>
                        <p className="text-zinc-900 dark:text-zinc-200">{formData.salary}</p>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    {formData.experience && (
                        <div>
                            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Experience</h3>
                            <Badge variant="outline" className="text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
                                {formData.experience}
                            </Badge>
                        </div>
                    )}
                    {formData.jobType && (
                        <div>
                            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Job Type</h3>
                            <Badge variant="outline" className="text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
                                {formData.jobType}
                            </Badge>
                        </div>
                    )}
                </div>

                {formData.description && (
                    <div>
                        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Description / Notes</h3>
                        <div className="text-zinc-700 dark:text-zinc-300 text-sm whitespace-pre-wrap leading-relaxed bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-transparent rounded-lg p-3">
                            {formData.description}
                        </div>
                    </div>
                )}

                {formData.interviews && formData.interviews.length > 0 && (
                    <div>
                        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3">Interview Rounds</h3>
                        <div className="space-y-3">
                            {formData.interviews.map((round, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200">Round {i + 1}</p>
                                            <span className="text-xs text-zinc-500">{new Date(round.date).toLocaleDateString()}</span>
                                        </div>
                                        {round.notes && <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{round.notes}</p>}
                                        {round.questions && round.questions.length > 0 && (
                                            <div className="mt-2 space-y-1">
                                                <p className="text-xs font-medium text-zinc-500">Questions:</p>
                                                <ul className="list-disc list-inside text-xs text-zinc-600 dark:text-zinc-400">
                                                    {round.questions.map((q, idx) => (
                                                        <li key={idx}>{q}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {formData.status === 'Rejected' && formData.learnings && (
                    <div>
                        <h3 className="text-sm font-medium text-red-500 dark:text-red-400 mb-1">Learnings</h3>
                        <p className="text-zinc-700 dark:text-zinc-300 text-sm italic">{formData.learnings}</p>
                    </div>
                )}
            </div>

            <div className="flex justify-between pt-6 border-t border-zinc-200 dark:border-zinc-800 items-center">
                <Button
                    onClick={handleDelete}
                    variant="ghost"
                    className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                    Delete Application
                </Button>
                <Button
                    onClick={() => setMode('edit')}
                    className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-medium"
                >
                    Edit Application
                </Button>
            </div>
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                        {mode === 'view' ? "Application Details" : (initialData ? "Edit Application" : "New Application")}
                    </DialogTitle>
                </DialogHeader>

                {mode === 'view' ? renderViewMode() : (
                    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                        {/* Move Job URL to top for better ux flow if we want auto-fill first */}
                        <div className="space-y-2">
                            <Label htmlFor="jobUrl" className="text-zinc-500 dark:text-zinc-400">Job URL (Paste to auto-fill)</Label>
                            <div className="relative">
                                <Input
                                    id="jobUrl"
                                    className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus-visible:ring-blue-500 pr-10"
                                    value={formData.jobUrl || ""}
                                    onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                                    onBlur={handleUrlBlur}
                                    placeholder="https://..."
                                />
                                {isScraping && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Logo Section */}
                        <div className="flex items-end gap-4">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="logoUrl" className="text-zinc-500 dark:text-zinc-400">Logo URL</Label>
                                <div className="flex gap-3">
                                    <Input
                                        id="logoUrl"
                                        className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus-visible:ring-blue-500"
                                        value={formData.logoUrl || ""}
                                        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                            {formData.logoUrl && (
                                <div className="w-10 h-10 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 overflow-hidden shrink-0">
                                    <img src={formData.logoUrl} alt="Logo preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="company" className="text-zinc-500 dark:text-zinc-400">Company *</Label>
                                <Input
                                    id="company"
                                    required
                                    className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus-visible:ring-blue-500"
                                    value={formData.company || ""}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    placeholder="e.g. Google"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-zinc-500 dark:text-zinc-400">Role *</Label>
                                <Input
                                    id="role"
                                    required
                                    className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus-visible:ring-blue-500"
                                    value={formData.role || ""}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    placeholder="e.g. Frontend Engineer"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="platform" className="text-zinc-500 dark:text-zinc-400">Platform</Label>
                                <Input
                                    id="platform"
                                    className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus-visible:ring-blue-500"
                                    value={formData.platform || ""}
                                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                    placeholder="e.g. LinkedIn"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-500 dark:text-zinc-400">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(val) => setFormData({ ...formData, status: val as JobStatus })}
                                >
                                    <SelectTrigger className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                                        <SelectItem value="Applied">Applied</SelectItem>
                                        <SelectItem value="Follow Up">Follow Up</SelectItem>
                                        <SelectItem value="Interview">Interview</SelectItem>
                                        <SelectItem value="Offer">Offer</SelectItem>
                                        <SelectItem value="Rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location" className="text-zinc-500 dark:text-zinc-400">Location</Label>
                                <Input
                                    id="location"
                                    className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus-visible:ring-blue-500"
                                    value={formData.location || ""}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="e.g. Remote, SF"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="salary" className="text-zinc-500 dark:text-zinc-400">Salary</Label>
                                <Input
                                    id="salary"
                                    className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus-visible:ring-blue-500"
                                    value={formData.salary || ""}
                                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                    placeholder="e.g. $120k - $150k"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="experience" className="text-zinc-500 dark:text-zinc-400">Experience</Label>
                                <Input
                                    id="experience"
                                    className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus-visible:ring-blue-500"
                                    value={formData.experience || ""}
                                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                    placeholder="e.g. Senior, 3+ years"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="jobType" className="text-zinc-500 dark:text-zinc-400">Job Type</Label>
                                <Input
                                    id="jobType"
                                    className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus-visible:ring-blue-500"
                                    value={formData.jobType || ""}
                                    onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                                    placeholder="e.g. Remote, Full-time"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-zinc-500 dark:text-zinc-400">Description / Notes</Label>
                            <Textarea
                                id="description"
                                className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 min-h-[100px] focus-visible:ring-blue-500"
                                value={formData.description || ""}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Paste job description or add notes..."
                            />
                        </div>

                        <InterviewSection
                            interviews={formData.interviews || []}
                            onChange={(interviews) => setFormData({ ...formData, interviews })}
                        />

                        {/* Conditional Fields based on Status */}
                        {formData.status === 'Rejected' && (
                            <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                                <h3 className="text-zinc-900 dark:text-zinc-100 font-medium flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                    Rejection Details
                                </h3>
                                <div className="space-y-2">
                                    <Label htmlFor="learnings" className="text-zinc-500 dark:text-zinc-400">Learnings (What did you improve?)</Label>
                                    <Textarea
                                        id="learnings"
                                        className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 min-h-[80px] focus-visible:ring-red-500"
                                        value={formData.learnings || ""}
                                        onChange={(e) => setFormData({ ...formData, learnings: e.target.value })}
                                        placeholder="I need to practice system design more..."
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end pt-4 border-t border-zinc-200 dark:border-zinc-800 gap-3">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onClose}
                                className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-500 text-white"
                            >
                                Save Application
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog >
    );
}
