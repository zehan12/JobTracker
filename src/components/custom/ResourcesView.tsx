"use client";

import { CopyIcon } from "lucide-react"; // Or use our own icon if not installed, but shadcn usually implies lucide
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTracker } from "@/hooks/useTracker";
import type { SocialLink, Template } from "@/types";
import { LinkModal, TemplateModal } from "./ResourceModals";
import { EditIcon, PlusIcon, TrashIcon } from "@/components/ui/Icons";

// Simple Copy Icon replacement if lucide isn't available, but standard shadcn uses it.
// I'll try to use the one from Icons.tsx if I add it, or scalable SVG here.
const CopySvg = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

import { toast } from "sonner";

export function ResourcesView() {
  const {
    templates,
    socialLinks,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    addLink,
    updateLink,
    deleteLink,
  } = useTracker();

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleTemplateSubmit = (data: Partial<Template>) => {
    if (editingTemplate) updateTemplate(editingTemplate.id, data);
    else addTemplate(data as any);
    setIsTemplateModalOpen(false);
  };

  const handleLinkSubmit = (data: Partial<SocialLink>) => {
    if (editingLink) updateLink(editingLink.id, data);
    else addLink(data as any);
    setIsLinkModalOpen(false);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 h-full overflow-y-auto custom-scrollbar">
      {/* --- TEMPLATES SECTION --- */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-foreground">
            Templates
          </h2>
          <Button
            onClick={() => {
              setEditingTemplate(null);
              setIsTemplateModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-500 text-white"
          >
            <PlusIcon className="w-4 h-4 mr-2" /> New Template
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.length === 0 ? (
            <div className="col-span-full border-2 border-dashed border-border rounded-xl p-10 text-center text-muted-foreground">
              No templates yet. Create one for cover letters or cold emails.
            </div>
          ) : (
            templates.map((template) => (
              <Card
                key={template.id}
                className="bg-card border-border flex flex-col shadow-sm"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-muted-foreground">
                      {template.title}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="text-muted-foreground border-border"
                    >
                      {template.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground text-sm line-clamp-3 font-mono bg-secondary p-2 rounded">
                    {template.content}
                  </p>
                </CardContent>
                <CardFooter className="pt-2 border-t border-border flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(template.content)}
                    className="text-muted-foreground hover:text-muted-foreground dark:hover:text-muted-foreground"
                  >
                    <CopySvg className="w-4 h-4 mr-1" /> Copy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingTemplate(template);
                      setIsTemplateModalOpen(true);
                    }}
                    className="text-muted-foreground hover:text-blue-500 dark:hover:text-blue-400"
                  >
                    <EditIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTemplate(template.id)}
                    className="text-muted-foreground hover:text-red-500 dark:hover:text-red-400"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* --- SOCIAL LINKS SECTION --- */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-foreground">
            Social Links
          </h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setEditingLink(null);
              setIsLinkModalOpen(true);
            }}
            className="bg-secondary text-foreground hover:bg-secondary dark:hover:bg-secondary"
          >
            <PlusIcon className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>

        <div className="space-y-3">
          {socialLinks.length === 0 ? (
            <div className="border border-border rounded-xl p-6 text-center text-muted-foreground text-sm">
              Add your LinkedIn, Portfolio, etc.
            </div>
          ) : (
            socialLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between p-3 bg-card border border-border rounded-lg group hover:border-border dark:hover:border-border transition-colors shadow-sm"
              >
                <div className="overflow-hidden">
                  <h4 className="font-medium text-muted-foreground">
                    {link.platform}
                  </h4>
                  <a
                    href={link.url}
                    target="_blank"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline truncate block"
                    rel="noreferrer"
                  >
                    {link.url}
                  </a>
                </div>
                <div className="flex items-center gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(link.url)}
                    className="h-7 w-7 text-muted-foreground hover:text-muted-foreground dark:hover:text-muted-foreground"
                  >
                    <CopySvg className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingLink(link);
                      setIsLinkModalOpen(true);
                    }}
                    className="h-7 w-7 text-muted-foreground hover:text-muted-foreground dark:hover:text-muted-foreground"
                  >
                    <EditIcon className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteLink(link.id)}
                    className="h-7 w-7 text-muted-foreground hover:text-red-500 dark:hover:text-red-400"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSubmit={handleTemplateSubmit}
        initialData={editingTemplate || undefined}
      />

      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onSubmit={handleLinkSubmit}
        initialData={editingLink || undefined}
      />
    </div>
  );
}
