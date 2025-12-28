import { Job, JobStatus, InterviewRound } from "@/types";
import { useState, useEffect } from "react";
import { InterviewSection } from "./InterviewSection";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface JobModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Job>) => void;
    initialData?: Job;
    initialStatus: JobStatus;
}

export function JobModal({ isOpen, onClose, onSubmit, initialData, initialStatus }: JobModalProps) {
    const [formData, setFormData] = useState<Partial<Job>>({
        company: "",
        role: "",
        location: "",
        salary: "",
        jobUrl: "",
        description: "",
        status: initialStatus,
        rejectionReason: "",
        learnings: "",
        interviews: [],
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData(prev => ({ ...prev, status: initialStatus }));
        }
    }, [initialData, initialStatus]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        toast.success("Job saved successfully");
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-900 border-zinc-800 text-zinc-100">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        {initialData ? "Edit Application" : "New Application"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="company" className="text-zinc-400">Company *</Label>
                            <Input
                                id="company"
                                required
                                className="bg-zinc-800 border-zinc-700 text-zinc-100 focus-visible:ring-blue-500"
                                value={formData.company || ""}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                placeholder="e.g. Google"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role" className="text-zinc-400">Role *</Label>
                            <Input
                                id="role"
                                required
                                className="bg-zinc-800 border-zinc-700 text-zinc-100 focus-visible:ring-blue-500"
                                value={formData.role || ""}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                placeholder="e.g. Frontend Engineer"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-zinc-400">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(val) => setFormData({ ...formData, status: val as JobStatus })}
                            >
                                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                    <SelectItem value="Applied">Applied</SelectItem>
                                    <SelectItem value="Follow Up">Follow Up</SelectItem>
                                    <SelectItem value="Interview">Interview</SelectItem>
                                    <SelectItem value="Offer">Offer</SelectItem>
                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location" className="text-zinc-400">Location</Label>
                            <Input
                                id="location"
                                className="bg-zinc-800 border-zinc-700 text-zinc-100 focus-visible:ring-blue-500"
                                value={formData.location || ""}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="e.g. Remote, SF"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="salary" className="text-zinc-400">Salary</Label>
                            <Input
                                id="salary"
                                className="bg-zinc-800 border-zinc-700 text-zinc-100 focus-visible:ring-blue-500"
                                value={formData.salary || ""}
                                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                placeholder="e.g. $120k - $150k"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="jobUrl" className="text-zinc-400">Job URL</Label>
                            <Input
                                id="jobUrl"
                                className="bg-zinc-800 border-zinc-700 text-zinc-100 focus-visible:ring-blue-500"
                                value={formData.jobUrl || ""}
                                onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-zinc-400">Description / Notes</Label>
                        <Textarea
                            id="description"
                            className="bg-zinc-800 border-zinc-700 text-zinc-100 min-h-[100px] focus-visible:ring-blue-500"
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
                        <div className="space-y-4 pt-4 border-t border-zinc-800">
                            <h3 className="text-zinc-100 font-medium flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                Rejection Details
                            </h3>
                            <div className="space-y-2">
                                <Label htmlFor="learnings" className="text-zinc-400">Learnings (What did you improve?)</Label>
                                <Textarea
                                    id="learnings"
                                    className="bg-zinc-800 border-zinc-700 text-zinc-100 min-h-[80px] focus-visible:ring-red-500"
                                    value={formData.learnings || ""}
                                    onChange={(e) => setFormData({ ...formData, learnings: e.target.value })}
                                    placeholder="I need to practice system design more..."
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end pt-4 border-t border-zinc-800 gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
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
            </DialogContent>
        </Dialog>
    );
}
