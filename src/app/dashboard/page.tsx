"use client";

import dynamic from "next/dynamic";

const Dashboard = dynamic(
  () => import("@/components/custom/Dashboard").then((m) => m.Dashboard),
  { ssr: false },
);

export default function DashboardPage() {
  return (
    <main className="h-screen w-screen flex bg-background text-foreground overflow-hidden font-sans antialiased selection:bg-foreground selection:text-background">
      <Dashboard />
    </main>
  );
}
