"use client";

import { useEffect, useState } from "react";
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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedJobs = localStorage.getItem(JOB_STORAGE_KEY);
    const savedContacts = localStorage.getItem(CONTACT_STORAGE_KEY);
    const savedTemplates = localStorage.getItem(TEMPLATE_STORAGE_KEY);
    const savedLinks = localStorage.getItem(LINK_STORAGE_KEY);
    const savedEvents = localStorage.getItem(EVENT_STORAGE_KEY);

    if (savedJobs) {
      try {
        setJobs(JSON.parse(savedJobs));
      } catch (e) {
        console.error(e);
      }
    }
    if (savedContacts) {
      try {
        setContacts(JSON.parse(savedContacts));
      } catch (e) {
        console.error(e);
      }
    }
    if (savedTemplates) {
      try {
        setTemplates(JSON.parse(savedTemplates));
      } catch (e) {
        console.error(e);
      }
    }
    if (savedLinks) {
      try {
        setSocialLinks(JSON.parse(savedLinks));
      } catch (e) {
        console.error(e);
      }
    }
    if (savedEvents) {
      try {
        setCalendarEvents(JSON.parse(savedEvents));
      } catch (e) {
        console.error(e);
      }
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(JOB_STORAGE_KEY, JSON.stringify(jobs));
      localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(contacts));
      localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
      localStorage.setItem(LINK_STORAGE_KEY, JSON.stringify(socialLinks));
      localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(calendarEvents));
    }
  }, [jobs, contacts, templates, socialLinks, calendarEvents, isLoaded]);

  // --- JOB ACTIONS ---
  const addJob = (
    job: Omit<Job, "id" | "createdAt" | "updatedAt" | "interviews">,
  ) => {
    const newJob: Job = {
      ...job,
      id: crypto.randomUUID(),
      interviews: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setJobs((prev) => [newJob, ...prev]);
  };

  const updateJob = (id: string, updates: Partial<Job>) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id
          ? { ...j, ...updates, updatedAt: new Date().toISOString() }
          : j,
      ),
    );
  };

  const deleteJob = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  // --- CONTACT ACTIONS ---
  const addContact = (
    contact: Omit<Contact, "id" | "createdAt" | "updatedAt">,
  ) => {
    const newContact: Contact = {
      ...contact,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setContacts((prev) => [newContact, ...prev]);
  };
  const updateContact = (id: string, updates: Partial<Contact>) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, ...updates, updatedAt: new Date().toISOString() }
          : c,
      ),
    );
  };
  const deleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  // --- TEMPLATE ACTIONS ---
  const addTemplate = (template: Omit<Template, "id" | "updatedAt">) => {
    const newTemplate: Template = {
      ...template,
      id: crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
    };
    setTemplates((prev) => [newTemplate, ...prev]);
  };
  const updateTemplate = (id: string, updates: Partial<Template>) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, ...updates, updatedAt: new Date().toISOString() }
          : t,
      ),
    );
  };
  const deleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  // --- LINK ACTIONS ---
  const addLink = (link: Omit<SocialLink, "id">) => {
    setSocialLinks((prev) => [...prev, { ...link, id: crypto.randomUUID() }]);
  };
  const updateLink = (id: string, updates: Partial<SocialLink>) => {
    setSocialLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    );
  };
  const deleteLink = (id: string) => {
    setSocialLinks((prev) => prev.filter((l) => l.id !== id));
  };

  // --- CALENDAR EVENT ACTIONS ---
  const addEvent = (event: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = { ...event, id: crypto.randomUUID() };
    setCalendarEvents((prev) => [...prev, newEvent]);
  };
  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setCalendarEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    );
  };
  const deleteEvent = (id: string) => {
    setCalendarEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return {
    jobs,
    contacts,
    templates,
    socialLinks,
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
    calendarEvents,
    addEvent,
    updateEvent,
    deleteEvent,
  };
}
