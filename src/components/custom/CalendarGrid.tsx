"use client";

import {
  addDays,
  differenceInDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types";

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export function CalendarGrid({
  currentDate,
  events,
  onDateClick,
  onEventClick,
}: CalendarGridProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = useMemo(() => {
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [startDate, endDate]);

  const weeks = useMemo(() => {
    const weeksArray = [];
    let currentWeek = [];

    for (const day of calendarDays) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeksArray.push(currentWeek);
        currentWeek = [];
      }
    }
    return weeksArray;
  }, [calendarDays]);

  const getWeekEvents = (weekDays: Date[]) => {
    const weekStart = weekDays[0];
    const weekEnd = weekDays[6];

    const relevantEvents = events.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      return eventStart <= weekEnd && eventEnd >= weekStart;
    });

    relevantEvents.sort((a, b) => {
      const aStart = new Date(a.startDate);
      const bStart = new Date(b.startDate);
      if (aStart.getTime() !== bStart.getTime())
        return aStart.getTime() - bStart.getTime();

      const aDuration = differenceInDays(new Date(a.endDate), aStart);
      const bDuration = differenceInDays(new Date(b.endDate), bStart);
      return bDuration - aDuration;
    });

    const slots: (CalendarEvent | null)[][] = [];

    const eventPositions = relevantEvents.map((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);

      const displayStart = eventStart < weekStart ? weekStart : eventStart;
      const displayEnd = eventEnd > weekEnd ? weekEnd : eventEnd;

      const startIndex = getDay(displayStart);
      const span = differenceInDays(displayEnd, displayStart) + 1;

      let slotIndex = 0;
      while (true) {
        let collision = false;
        if (!slots[slotIndex]) slots[slotIndex] = Array(7).fill(null);

        for (let i = startIndex; i < startIndex + span; i++) {
          if (slots[slotIndex][i]) {
            collision = true;
            break;
          }
        }

        if (!collision) {
          for (let i = startIndex; i < startIndex + span; i++) {
            slots[slotIndex][i] = event;
          }
          return { event, slotIndex, startIndex, span };
        }
        slotIndex++;
      }
    });

    return { eventPositions, maxSlots: slots.length };
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Work":
        return "bg-blue-500 text-white border-blue-600";
      case "Interview":
        return "bg-orange-500 text-white border-orange-600";
      case "Task":
        return "bg-purple-500 text-white border-purple-600";
      case "Other":
        return "bg-gray-500 text-white border-gray-600";
      default:
        return "bg-blue-500 text-white";
    }
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="grid grid-cols-7 border-b border-border">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
          <div
            key={day}
            className="py-2 text-center text-[10px] font-semibold text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Weeks */}
      <div className="flex-1 flex flex-col">
        {weeks.map((week, weekIndex) => {
          const { eventPositions, maxSlots } = getWeekEvents(week);

          return (
            <div
              key={weekIndex}
              className="flex-1 relative min-h-[100px] border-b border-border last:border-0"
            >
              {/* Background Grid */}
              <div className="absolute inset-0 grid grid-cols-7 h-full">
                {week.map((day, dayIndex) => (
                  <div
                    key={day.toISOString()}
                    onClick={() => onDateClick(day)}
                    className={cn(
                      "h-full border-r border-border p-1 cursor-pointer transition-colors",
                      dayIndex === 6 && "border-r-0",
                      !isSameMonth(day, currentDate) &&
                        "bg-secondary",
                    )}
                  >
                    <div className="flex justify-center mt-1">
                      <span
                        className={cn(
                          "text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full",
                          isSameDay(day, new Date())
                            ? "bg-blue-600 text-white"
                            : "text-muted-foreground hover:bg-secondary dark:hover:bg-secondary",
                        )}
                      >
                        {format(day, "d")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Events Layer */}
              <div className="relative mt-8 grid grid-cols-7 pointer-events-none px-1">
                <div style={{ height: `${Math.max(maxSlots, 1) * 24}px` }} />

                {eventPositions.map(
                  ({ event, slotIndex, startIndex, span }, idx) => {
                    const isTimed = !event.isAllDay && span === 1;

                    return (
                      <div
                        key={`${event.id}-${weekIndex}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                        className={cn(
                          "absolute px-1.5 text-xs truncate cursor-pointer pointer-events-auto transition-all flex items-center",
                          !isTimed &&
                            "h-5 rounded-[4px] shadow-sm border opacity-90 hover:opacity-100", // Bar style
                          isTimed &&
                            "h-5 hover:bg-secondary dark:hover:bg-secondary rounded-sm font-medium text-foreground", // Text style
                          !isTimed && getTypeColor(event.type),
                        )}
                        style={{
                          top: `${slotIndex * 24}px`,
                          left: `${(startIndex / 7) * 100}%`,
                          marginLeft: "2px",
                          width: `calc(${(span / 7) * 100}% - 4px)`,
                        }}
                      >
                        {isTimed ? (
                          <>
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full mr-1.5 shrink-0",
                                event.type === "Work" && "bg-blue-500",
                                event.type === "Interview" && "bg-orange-500",
                                event.type === "Task" && "bg-purple-500",
                                event.type === "Other" && "bg-gray-500",
                              )}
                            />
                            <span className="mr-1.5 text-muted-foreground font-normal">
                              {format(new Date(event.startDate), "h:mma")
                                .toLowerCase()
                                .replace(":00", "")}
                            </span>
                            <span className="font-medium text-muted-foreground">
                              {event.title}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="font-semibold mr-1 leading-none text-white/90 shadow-sm">
                              {event.type === "Interview"
                                ? "🎤"
                                : event.type === "Task"
                                  ? "📝"
                                  : ""}
                            </span>
                            <span className="font-medium">{event.title}</span>
                          </>
                        )}
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
