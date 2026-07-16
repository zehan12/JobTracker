"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  Calendar as CalendarIcon,
  Clock,
  Network,
  Layers,
  Sparkles,
} from "lucide-react";
import { CalendarView } from "./CalendarView";
import { JobBoard } from "./JobBoard";
import { NetworkView } from "./NetworkView";
import { ResourcesView } from "./ResourcesView";
import { ScheduleView } from "./ScheduleView";
import { ThemeToggle } from "./ThemeToggle";
import { DataManagement } from "./DataManagement";

export function Dashboard() {
  return (
    <Tabs
      defaultValue="board"
      orientation="vertical"
      className="flex-1 flex flex-row overflow-hidden w-full h-full gap-0"
    >
      {/* Sidebar */}
      <div className="w-72 border-r border-border bg-card flex flex-col justify-between shrink-0 z-20">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-foreground" />
            </div>
            <span className="text-xl font-medium tracking-tight text-foreground">
              JobTracker
            </span>
          </div>

          <TabsList className="flex flex-col h-auto bg-transparent p-0 gap-1 items-stretch w-full">
            {[
              {
                id: "board",
                label: "Job Board",
                icon: <Layers className="h-4 w-4" />,
              },
              {
                id: "calendar",
                label: "Calendar",
                icon: <CalendarIcon className="h-4 w-4" />,
              },
              {
                id: "schedule",
                label: "Schedule",
                icon: <Clock className="h-4 w-4" />,
              },
              {
                id: "network",
                label: "Network",
                icon: <Network className="h-4 w-4" />,
              },
              {
                id: "resources",
                label: "Resources",
                icon: <Sparkles className="h-4 w-4" />,
              },
            ].map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="justify-start px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg w-full text-muted-foreground hover:text-foreground hover:bg-secondary data-[state=active]:bg-secondary data-[state=active]:text-foreground border-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-center gap-3">
                  {tab.icon}
                  {tab.label}
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="p-6 border-t border-border bg-card">
          <div className="flex flex-col gap-4">
            <DataManagement />
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Theme
              </span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden bg-background">
        <div className="absolute inset-0 overflow-y-auto overflow-x-hidden">
          <TabsContent
            value="board"
            className="min-h-full m-0 p-8 data-[state=inactive]:hidden animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none"
          >
            <JobBoard />
          </TabsContent>
          <TabsContent
            value="calendar"
            className="min-h-full m-0 p-8 data-[state=inactive]:hidden animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none"
          >
            <CalendarView />
          </TabsContent>
          <TabsContent
            value="schedule"
            className="min-h-full m-0 p-8 data-[state=inactive]:hidden animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none"
          >
            <ScheduleView />
          </TabsContent>
          <TabsContent
            value="network"
            className="min-h-full m-0 p-8 data-[state=inactive]:hidden animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none"
          >
            <NetworkView />
          </TabsContent>
          <TabsContent
            value="resources"
            className="min-h-full m-0 p-8 data-[state=inactive]:hidden animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none"
          >
            <ResourcesView />
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
}
