"use client";

import {
  addDays,
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTracker } from "@/hooks/useTracker";
import { type CalendarEvent, Job } from "@/types";
import { CalendarGrid } from "./CalendarGrid";
import { EventModal } from "./EventModal";
import { TimeGridView } from "./TimeGridView";

type ViewMode = "month" | "week" | "day";

export function ScheduleView() {
  const { jobs, calendarEvents, addEvent, updateEvent, deleteEvent } =
    useTracker();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewMode>("month");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>();

  // Combine manual events + job applications + interviews
  const allEvents = useMemo(() => {
    const events: CalendarEvent[] = [...calendarEvents];

    jobs.forEach((job) => {
      // 1. Application Date
      events.push({
        id: `job-app-${job.id}`,
        title: `Applied: ${job.role} @ ${job.company}`,
        startDate: job.appliedDate, // Assumes ISO string
        endDate: job.appliedDate,
        type: "Work",
        isAllDay: true,
      });

      // 2. Interviews
      job.interviews.forEach((interview, idx) => {
        events.push({
          id: `job-int-${job.id}-${idx}`,
          title: `Interview: ${job.role}`,
          startDate: interview.date,
          endDate: interview.date, // If time isn't specific, might need logic
          type: "Interview",
          description: interview.notes,
          isAllDay: !interview.date.includes("T"), // Heuristic, or just assume true for legacy
        });
      });
    });

    return events;
  }, [calendarEvents, jobs]);

  const handlePrevious = () => {
    if (view === "month") setCurrentDate(subMonths(currentDate, 1));
    else if (view === "week") setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (view === "month") setCurrentDate(addMonths(currentDate, 1));
    else if (view === "week") setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const handleToday = () => setCurrentDate(new Date());

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setEditingEvent(undefined);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    if (event.id.startsWith("job-")) return;
    setEditingEvent(event);
    setSelectedDate(undefined);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (eventData: Omit<CalendarEvent, "id">) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
    } else {
      addEvent(eventData);
    }
  };

  const getHeaderLabel = () => {
    if (view === "month") return format(currentDate, "MMMM yyyy");
    if (view === "day") return format(currentDate, "MMMM d, yyyy");
    // Week view: show range
    const start = startOfWeek(currentDate);
    const end = endOfWeek(currentDate);
    if (start.getMonth() === end.getMonth()) {
      return `${format(start, "MMMM d")} – ${format(end, "d, yyyy")}`;
    }
    return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToday}
              className="px-3"
            >
              Today
            </Button>
            <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1" />
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 min-w-[200px]">
            {getHeaderLabel()}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Select value={view} onValueChange={(v) => setView(v as ViewMode)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => {
              setSelectedDate(new Date());
              setEditingEvent(undefined);
              setIsModalOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Event
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden min-h-0 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl">
        {view === "month" ? (
          <CalendarGrid
            currentDate={currentDate}
            events={allEvents}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        ) : (
          <TimeGridView
            date={currentDate}
            mode={view}
            events={allEvents}
            onEventClick={handleEventClick}
          />
        )}
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        initialDate={selectedDate || currentDate}
        existingEvent={editingEvent}
      />
    </div>
  );
}
