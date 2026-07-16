import Dexie, { type EntityTable } from "dexie";
import "dexie-export-import";
import type {
  CalendarEvent,
  Contact,
  Job,
  SocialLink,
  Template,
} from "../types";

export const db = new Dexie("JobTrackerDB") as Dexie & {
  jobs: EntityTable<Job, "id">;
  contacts: EntityTable<Contact, "id">;
  templates: EntityTable<Template, "id">;
  socialLinks: EntityTable<SocialLink, "id">;
  calendarEvents: EntityTable<CalendarEvent, "id">;
};

// Define tables and indexes
db.version(1).stores({
  jobs: "id, status, appliedDate, createdAt",
  contacts: "id, name, status",
  templates: "id, type",
  socialLinks: "id, platform",
  calendarEvents: "id, startDate, type",
});

// Helper for exporting
export const exportDatabase = async () => {
  try {
    const blob = await db.export();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `job-tracker-backup-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export failed:", error);
    throw error;
  }
};

// Helper for importing
export const importDatabase = async (file: File) => {
  try {
    await db.import(file, {
      overwriteValues: true,
      clearTablesBeforeImport: true,
    });
  } catch (error) {
    console.error("Import failed:", error);
    throw error;
  }
};
