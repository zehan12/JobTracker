"use client";

import { useTracker } from "@/hooks/useTracker";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function CalendarView() {
    const { jobs } = useTracker();
    const [date, setDate] = useState<Date | undefined>(new Date());

    // Group jobs by date for efficient lookup
    const jobsByDate = jobs.reduce((acc, job) => {
        const dateStr = job.appliedDate.split('T')[0];
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(job);
        return acc;
    }, {} as Record<string, typeof jobs>);

    const selectedJobs = date ? jobs.filter(job => isSameDay(parseISO(job.appliedDate), date)) : [];

    // Create modifiers for days with applications
    const activityDays = Object.keys(jobsByDate).map(d => parseISO(d));

    return (
        <div className="flex flex-col md:flex-row gap-8 p-4 md:p-6 max-w-7xl mx-auto h-[calc(100vh-140px)]">
            <div className="flex-1 max-w-[400px]">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-zinc-100">Application Calendar</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border border-zinc-800 text-zinc-100"
                            modifiers={{
                                hasJob: activityDays
                            }}
                            modifiersClassNames={{
                                hasJob: "bg-blue-900/40 text-blue-200 font-bold hover:bg-blue-800/50"
                            }}
                        />
                    </CardContent>
                </Card>

                <div className="mt-4 p-4 bg-zinc-900/50 rounded-lg text-sm text-zinc-400 border border-zinc-800">
                    <p className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Days with applications applied
                    </p>
                </div>
            </div>

            <div className="flex-1 bg-zinc-900/20 border border-zinc-800/50 rounded-xl p-6 overflow-hidden flex flex-col">
                <h3 className="text-xl font-semibold text-zinc-100 mb-4 flex items-center gap-2">
                    Activity for {date ? format(date, 'MMMM do, yyyy') : 'Selected Date'}
                    <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
                        {selectedJobs.length}
                    </Badge>
                </h3>

                <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                    {selectedJobs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-500 py-10 opacity-70">
                            <p>No applications found for this date.</p>
                        </div>
                    ) : (
                        selectedJobs.map(job => (
                            <div key={job.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-semibold text-zinc-200">{job.role}</h4>
                                        <p className="text-sm text-zinc-400">{job.company}</p>
                                    </div>
                                    <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                                        {job.status}
                                    </Badge>
                                </div>
                                {job.status === 'Interview' && (
                                    <div className="mt-2 text-xs text-purple-400 bg-purple-900/10 px-2 py-1 rounded inline-block">
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
