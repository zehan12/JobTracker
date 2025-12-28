"use client";

import { useTracker } from "@/hooks/useTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobBoard } from "./JobBoard";
import { CalendarView } from "./CalendarView";
import { NetworkView } from "./NetworkView";
import { ResourcesView } from "./ResourcesView";

export function Dashboard() {
    return (
        <div className="flex-1 overflow-hidden flex flex-col bg-black">
            <Tabs defaultValue="board" className="flex-1 flex flex-col overflow-hidden">
                <div className="px-6 border-b border-zinc-900 bg-black z-10 pt-2">
                    <TabsList className="bg-transparent h-10 p-0 gap-6 w-full justify-start">
                        {['board', 'calendar', 'network', 'resources'].map((tab) => (
                            <TabsTrigger
                                key={tab}
                                value={tab}
                                className="capitalize data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-zinc-100 rounded-none h-full px-0 pb-2 text-zinc-500 font-medium transition-colors hover:text-zinc-300 border-b-2 border-transparent data-[state=active]:border-zinc-100"
                            >
                                {tab}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <div className="flex-1 overflow-hidden bg-black relative">
                    <TabsContent value="board" className="h-full m-0 p-6 data-[state=inactive]:hidden animate-in fade-in duration-300">
                        <JobBoard />
                    </TabsContent>
                    <TabsContent value="calendar" className="h-full m-0 data-[state=inactive]:hidden animate-in fade-in duration-300">
                        <CalendarView />
                    </TabsContent>
                    <TabsContent value="network" className="h-full m-0 data-[state=inactive]:hidden animate-in fade-in duration-300">
                        <NetworkView />
                    </TabsContent>
                    <TabsContent value="resources" className="h-full m-0 data-[state=inactive]:hidden animate-in fade-in duration-300">
                        <ResourcesView />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
