"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTracker } from "@/hooks/useTracker";
import { CalendarView } from "./CalendarView";
import { JobBoard } from "./JobBoard";
import { NetworkView } from "./NetworkView";
import { ResourcesView } from "./ResourcesView";
import { ScheduleView } from "./ScheduleView";
import { ThemeToggle } from "./ThemeToggle";

export function Dashboard() {
  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-background">
      <Tabs
        defaultValue="schedule"
        className="flex-1 flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 z-10 h-14 shrink-0 shadow-sm">
          <TabsList className="bg-transparent p-0 gap-2 w-auto justify-start">
            {["board", "calendar", "schedule", "network", "resources"].map(
              (tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="capitalize rounded-full px-4 py-1 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100"
                >
                  {tab}
                </TabsTrigger>
              ),
            )}
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-2" />
            <ThemeToggle />
          </div>
        </div>

        <div className="flex-1 overflow-hidden bg-zinc-50 dark:bg-black relative">
          <TabsContent
            value="board"
            className="h-full m-0 p-6 data-[state=inactive]:hidden animate-in fade-in duration-300"
          >
            <JobBoard />
          </TabsContent>
          <TabsContent
            value="calendar"
            className="h-full m-0 data-[state=inactive]:hidden animate-in fade-in duration-300"
          >
            <CalendarView />
          </TabsContent>
          <TabsContent
            value="schedule"
            className="h-full m-0 p-6 data-[state=inactive]:hidden animate-in fade-in duration-300"
          >
            <ScheduleView />
          </TabsContent>
          <TabsContent
            value="network"
            className="h-full m-0 data-[state=inactive]:hidden animate-in fade-in duration-300"
          >
            <NetworkView />
          </TabsContent>
          <TabsContent
            value="resources"
            className="h-full m-0 data-[state=inactive]:hidden animate-in fade-in duration-300"
          >
            <ResourcesView />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
