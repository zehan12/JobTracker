import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Contact, ContactStatus } from "@/types";

interface NetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Contact>) => void;
  initialData?: Contact;
}

export function NetworkModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: NetworkModalProps) {
  const [formData, setFormData] = useState<Partial<Contact>>({
    name: "",
    role: "",
    company: "",
    email: "",
    linkedin: "",
    status: "To Contact",
    notes: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        role: "",
        company: "",
        email: "",
        linkedin: "",
        status: "To Contact",
        notes: "",
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    toast.success("Contact saved");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {initialData ? "Edit Contact" : "Add Contact"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-500 dark:text-zinc-400">
              Name *
            </Label>
            <Input
              id="name"
              required
              className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus-visible:ring-blue-500"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. Sarah Smith"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="company"
                className="text-zinc-500 dark:text-zinc-400"
              >
                Company
              </Label>
              <Input
                id="company"
                className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus-visible:ring-blue-500"
                value={formData.company || ""}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                placeholder="e.g. Netflix"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="role"
                className="text-zinc-500 dark:text-zinc-400"
              >
                Role
              </Label>
              <Input
                id="role"
                className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus-visible:ring-blue-500"
                value={formData.role || ""}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                placeholder="e.g. Recruiter"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-500 dark:text-zinc-400">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(val) =>
                setFormData({ ...formData, status: val as ContactStatus })
              }
            >
              <SelectTrigger className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                <SelectItem value="To Contact">To Contact</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Replied">Replied</SelectItem>
                <SelectItem value="Ghosted">Ghosted</SelectItem>
                <SelectItem value="Connected">Connected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-500 dark:text-zinc-400">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus-visible:ring-blue-500"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="sarah@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="linkedin"
              className="text-zinc-500 dark:text-zinc-400"
            >
              LinkedIn URL
            </Label>
            <Input
              id="linkedin"
              className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus-visible:ring-blue-500"
              value={formData.linkedin || ""}
              onChange={(e) =>
                setFormData({ ...formData, linkedin: e.target.value })
              }
              placeholder="https://linkedin.com/in/..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-zinc-500 dark:text-zinc-400">
              Notes
            </Label>
            <Textarea
              id="notes"
              className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 min-h-[80px] focus-visible:ring-blue-500"
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Referral request sent..."
            />
          </div>

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
              Save Contact
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
