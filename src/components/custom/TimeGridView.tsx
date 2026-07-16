"use client";

import {
  addDays,
  differenceInMinutes,
  format,
  isSameDay,
  startOfDay,
  startOfWeek,
} from "date-fns";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { CalendarEvent, EventType } from "@/types";

interface TimeGridViewProps {
  date: Date;
  mode: "week" | "day";
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function TimeGridView({
  date,
  mode,
  events,
  onEventClick,
}: TimeGridViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const daysToShow =
    mode === "week"
      ? Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(date), i))
      : [date];

  const relevantEvents = useMemo(() => {
    return events.filter((event) => {
      const eventStart = new Date(event.startDate);
      return daysToShow.some((day) => isSameDay(eventStart, day));
    });
  }, [events, daysToShow]);

  const getTypeColor = (type: EventType) => {
    switch (type) {
      case "Work":
        return "bg-blue-500/90 text-white border-blue-600";
      case "Interview":
        return "bg-orange-500/90 text-white border-orange-600";
      case "Task":
        return "bg-purple-500/90 text-white border-purple-600";
      case "Other":
        return "bg-gray-500/90 text-white border-gray-600";
      default:
        return "bg-blue-500/90 text-white";
    }
  };

  return (
    <div className="flex h-full overflow-hidden flex-col bg-card border-t border-border">
      {/* Header */}
      <div className="flex border-b border-border shrink-0">
        <div className="w-16 border-r border-border bg-card" />
        {daysToShow.map((day) => (
          <div
            key={day.toISOString()}
            className="flex-1 py-4 text-center border-r border-border last:border-0 bg-card relative"
          >
            <div
              className={cn(
                "text-[11px] font-medium uppercase mb-1 tracking-wider",
                isSameDay(day, new Date()) ? "text-blue-600" : "text-muted-foreground",
              )}
            >
              {format(day, "EEE")}
            </div>
            <div
              className={cn(
                "text-2xl font-normal w-10 h-10 flex items-center justify-center rounded-full mx-auto transition-colors",
                isSameDay(day, new Date())
                  ? "bg-blue-600 text-white"
                  : "text-muted-foreground hover:bg-secondary dark:hover:bg-secondary",
              )}
            >
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>

      {/* Scrollable Grid */}
      <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-card">
        <div className="flex min-h-[1440px]">
          {/* Time Axis */}
          <div className="w-16 flex-shrink-0 border-r border-border bg-card select-none">
            {hours.map((hour) => (
              <div key={hour} className="h-[60px] relative pointer-events-none">
                {hour !== 0 && (
                  <span className="absolute -top-3 right-3 text-xs text-muted-foreground font-medium text-[11px]">
                    {format(new Date().setHours(hour, 0), "ha")}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Days Columns */}
          <div className="flex-1 flex bg-card">
            {daysToShow.map((day, dayIndex) => (
              <div
                key={day.toISOString()}
                className="flex-1 border-r border-border last:border-0 relative min-w-[100px]"
              >
                {/* Horizontal Hour Lines */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="h-[60px] border-b border-border w-full absolute pointer-events-none"
                    style={{ top: `${hour * 60}px` }}
                  />
                ))}

                {/* Events for this day */}
                {relevantEvents
                  .filter(
                    (e) => isSameDay(new Date(e.startDate), day) && !e.isAllDay,
                  )
                  .map((event) => {
                    const start = new Date(event.startDate);
                    const end = new Date(event.endDate);

                    const startMinutes =
                      start.getHours() * 60 + start.getMinutes();
                    const duration = differenceInMinutes(end, start);

                    const top = startMinutes;
                    const height = Math.max(duration, 20);

                    return (
                      <div
                        key={event.id}
                        onClick={() => onEventClick(event)}
                        className={cn(
                          "absolute left-1 right-2 rounded border overflow-hidden cursor-pointer shadow-sm hover:opacity-100 opacity-90 transition-opacity p-1 text-xs",
                          getTypeColor(event.type),
                        )}
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                          zIndex: 10,
                        }}
                      >
                        <div className="font-semibold truncate leading-tight">
                          {event.title}
                        </div>
                        <div className="opacity-90 truncate text-[10px] mt-0.5">
                          {format(start, "h:mma")} - {format(end, "h:mma")}
                        </div>
                      </div>
                    );
                  })}

                {/* Current Time Indicator */}
                {isSameDay(day, new Date()) && (
                  <div
                    className="absolute w-full border-t-2 border-red-500 z-20 pointer-events-none"
                    style={{
                      top: `${new Date().getHours() * 60 + new Date().getMinutes()}px`,
                    }}
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full -mt-[5px] -ml-[1px]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
