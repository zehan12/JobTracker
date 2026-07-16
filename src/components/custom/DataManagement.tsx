"use client";

import { DownloadIcon, UploadIcon } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { exportDatabase, importDatabase } from "@/lib/db";
import { Button } from "@/components/ui/button";

export function DataManagement() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      await exportDatabase();
      toast.success("Data exported successfully!");
    } catch (e) {
      toast.error("Failed to export data.");
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importDatabase(file);
      toast.success("Data imported successfully!");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error("Failed to import data. Check file format.");
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleExport}
        title="Export Data"
        className="h-8 w-8"
      >
        <DownloadIcon className="w-4 h-4" />
      </Button>
      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        onChange={handleImport}
        className="hidden"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => fileInputRef.current?.click()}
        title="Import Data"
        className="h-8 w-8"
      >
        <UploadIcon className="w-4 h-4" />
      </Button>
    </div>
  );
}
