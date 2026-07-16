"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { db } from "../lib/db";
import type {
  CalendarEvent,
  Contact,
  Job,
  SocialLink,
  Template,
} from "../types";

const JOB_STORAGE_KEY = "job-application-tracker-v1";
const CONTACT_STORAGE_KEY = "job-network-tracker-v1";
const TEMPLATE_STORAGE_KEY = "job-template-tracker-v1";
const LINK_STORAGE_KEY = "job-link-tracker-v1";
const EVENT_STORAGE_KEY = "job-calendar-event-tracker-v1";

export function useTracker() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Migrate old localStorage data to Dexie if it exists
  useEffect(() => {
    const migrateData = async () => {
      try {
        const savedJobs = localStorage.getItem(JOB_STORAGE_KEY);
        if (savedJobs) {
          const parsed = JSON.parse(savedJobs);
          if (parsed.length) await db.jobs.bulkPut(parsed);
          localStorage.removeItem(JOB_STORAGE_KEY);
        }

        const savedContacts = localStorage.getItem(CONTACT_STORAGE_KEY);
        if (savedContacts) {
          const parsed = JSON.parse(savedContacts);
          if (parsed.length) await db.contacts.bulkPut(parsed);
          localStorage.removeItem(CONTACT_STORAGE_KEY);
        }

        const savedTemplates = localStorage.getItem(TEMPLATE_STORAGE_KEY);
        if (savedTemplates) {
          const parsed = JSON.parse(savedTemplates);
          if (parsed.length) await db.templates.bulkPut(parsed);
          localStorage.removeItem(TEMPLATE_STORAGE_KEY);
        }

        const savedLinks = localStorage.getItem(LINK_STORAGE_KEY);
        if (savedLinks) {
          const parsed = JSON.parse(savedLinks);
          if (parsed.length) await db.socialLinks.bulkPut(parsed);
          localStorage.removeItem(LINK_STORAGE_KEY);
        }

        const savedEvents = localStorage.getItem(EVENT_STORAGE_KEY);
        if (savedEvents) {
          const parsed = JSON.parse(savedEvents);
          if (parsed.length) await db.calendarEvents.bulkPut(parsed);
          localStorage.removeItem(EVENT_STORAGE_KEY);
        }
      } catch (e) {
        console.error("Migration failed:", e);
      } finally {
        setIsLoaded(true);
      }
    };

    migrateData();
  }, []);

  // Reactively query the database
  // Using reverse().sortBy('createdAt') for jobs if you want newest first
  const jobs = useLiveQuery(() => db.jobs.reverse().sortBy("createdAt")) || [];
  const contacts =
    useLiveQuery(() => db.contacts.reverse().sortBy("createdAt")) || [];
  const templates =
    useLiveQuery(() => db.templates.reverse().sortBy("updatedAt")) || [];
  const socialLinks = useLiveQuery(() => db.socialLinks.toArray()) || [];
  const calendarEvents = useLiveQuery(() => db.calendarEvents.toArray()) || [];

  // --- JOB ACTIONS ---
  const addJob = async (
    job: Omit<Job, "id" | "createdAt" | "updatedAt" | "interviews">,
  ) => {
    await db.jobs.add({
      ...job,
      id: crypto.randomUUID(),
      interviews: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Job);
  };

  const updateJob = async (id: string, updates: Partial<Job>) => {
    await db.jobs.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteJob = async (id: string) => {
    await db.jobs.delete(id);
  };

  // --- CONTACT ACTIONS ---
  const addContact = async (
    contact: Omit<Contact, "id" | "createdAt" | "updatedAt">,
  ) => {
    await db.contacts.add({
      ...contact,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Contact);
  };

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    await db.contacts.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteContact = async (id: string) => {
    await db.contacts.delete(id);
  };

  // --- TEMPLATE ACTIONS ---
  const addTemplate = async (template: Omit<Template, "id" | "updatedAt">) => {
    await db.templates.add({
      ...template,
      id: crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
    } as Template);
  };

  const updateTemplate = async (id: string, updates: Partial<Template>) => {
    await db.templates.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteTemplate = async (id: string) => {
    await db.templates.delete(id);
  };

  // --- LINK ACTIONS ---
  const addLink = async (link: Omit<SocialLink, "id">) => {
    await db.socialLinks.add({ ...link, id: crypto.randomUUID() });
  };

  const updateLink = async (id: string, updates: Partial<SocialLink>) => {
    await db.socialLinks.update(id, updates);
  };

  const deleteLink = async (id: string) => {
    await db.socialLinks.delete(id);
  };

  // --- CALENDAR EVENT ACTIONS ---
  const addEvent = async (event: Omit<CalendarEvent, "id">) => {
    await db.calendarEvents.add({ ...event, id: crypto.randomUUID() });
  };

  const updateEvent = async (id: string, updates: Partial<CalendarEvent>) => {
    await db.calendarEvents.update(id, updates);
  };

  const deleteEvent = async (id: string) => {
    await db.calendarEvents.delete(id);
  };

  return {
    jobs,
    contacts,
    templates,
    socialLinks,
    calendarEvents,
    isLoaded,
    addJob,
    updateJob,
    deleteJob,
    addContact,
    updateContact,
    deleteContact,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    addLink,
    updateLink,
    deleteLink,
    addEvent,
    updateEvent,
    deleteEvent,
  };
}
