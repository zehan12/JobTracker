"use client";

import { format, isSameDay, parseISO } from "date-fns";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTracker } from "@/hooks/useTracker";

export function CalendarView() {
  const { jobs } = useTracker();
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Group jobs by date for efficient lookup
  const jobsByDate = jobs.reduce(
    (acc, job) => {
      const dateStr = job.appliedDate.split("T")[0];
      if (!acc[dateStr]) acc[dateStr] = [];
      acc[dateStr].push(job);
      return acc;
    },
    {} as Record<string, typeof jobs>,
  );

  const selectedJobs = date
    ? jobs.filter((job) => isSameDay(parseISO(job.appliedDate), date))
    : [];

  // Create modifiers for days with applications
  const activityDays = Object.keys(jobsByDate).map((d) => parseISO(d));

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 md:p-6 max-w-7xl mx-auto h-[calc(100vh-140px)]">
      <div className="flex-1 max-w-[400px]">
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">
              Application Calendar
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border border-border text-foreground"
              modifiers={{
                hasJob: activityDays,
              }}
              modifiersClassNames={{
                hasJob:
                  "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 font-bold hover:bg-blue-200 dark:hover:bg-blue-800/50",
              }}
            />
          </CardContent>
        </Card>

        <div className="mt-4 p-4 bg-secondary rounded-lg text-sm text-muted-foreground border border-border">
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Days with applications applied
          </p>
        </div>
      </div>

      <div className="flex-1 bg-card border border-border rounded-xl p-6 overflow-hidden flex flex-col shadow-sm">
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          Activity for {date ? format(date, "MMMM do, yyyy") : "Selected Date"}
          <Badge
            variant="secondary"
            className="bg-secondary text-muted-foreground"
          >
            {selectedJobs.length}
          </Badge>
        </h3>

        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
          {selectedJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-10 opacity-70">
              <p>No applications found for this date.</p>
            </div>
          ) : (
            selectedJobs.map((job) => (
              <div
                key={job.id}
                className="p-4 bg-secondary border border-border rounded-lg hover:border-border dark:hover:border-border transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-muted-foreground">
                      {job.role}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {job.company}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-border text-muted-foreground"
                  >
                    {job.status}
                  </Badge>
                </div>
                {job.status === "Interview" && (
                  <div className="mt-2 text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/10 px-2 py-1 rounded inline-block">
                    {job.interviews.length} Interview Rounds
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
