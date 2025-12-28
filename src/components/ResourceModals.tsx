import { Template, SocialLink } from "@/types";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// --- TEMPLATE MODAL ---

interface TemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Template>) => void;
    initialData?: Template;
}

export function TemplateModal({ isOpen, onClose, onSubmit, initialData }: TemplateModalProps) {
    const [formData, setFormData] = useState<Partial<Template>>({
        title: "",
        content: "",
        type: "Cover Letter"
    });

    useEffect(() => {
        if (initialData) setFormData(initialData);
        else setFormData({ title: "", content: "", type: "Cover Letter" });
    }, [initialData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        toast.success("Template saved");
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl bg-zinc-900 border-zinc-800 text-zinc-100">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit Template" : "New Template"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="bg-zinc-800 border-zinc-700"
                                placeholder="e.g. Frontend Cover Letter"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(val) => setFormData({ ...formData, type: val as any })}
                            >
                                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                                    <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                    <SelectItem value="Cover Letter">Cover Letter</SelectItem>
                                    <SelectItem value="Email">Email</SelectItem>
                                    <SelectItem value="Message">Message</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Content</Label>
                        <Textarea
                            required
                            value={formData.content}
                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                            className="bg-zinc-800 border-zinc-700 min-h-[200px]"
                            placeholder="Dear Hiring Manager..."
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-500">Save</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// --- LINK MODAL ---

interface LinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<SocialLink>) => void;
    initialData?: SocialLink;
}

export function LinkModal({ isOpen, onClose, onSubmit, initialData }: LinkModalProps) {
    const [formData, setFormData] = useState<Partial<SocialLink>>({
        platform: "",
        url: ""
    });

    useEffect(() => {
        if (initialData) setFormData(initialData);
        else setFormData({ platform: "", url: "" });
    }, [initialData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        toast.success("Link saved");
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 text-zinc-100">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit Link" : "New Link"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Platform / Title</Label>
                        <Input
                            required
                            value={formData.platform}
                            onChange={e => setFormData({ ...formData, platform: e.target.value })}
                            className="bg-zinc-800 border-zinc-700"
                            placeholder="e.g. LinkedIn"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>URL</Label>
                        <Input
                            required
                            value={formData.url}
                            onChange={e => setFormData({ ...formData, url: e.target.value })}
                            className="bg-zinc-800 border-zinc-700"
                            placeholder="https://..."
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-500">Save</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
