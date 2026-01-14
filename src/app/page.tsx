import { Dashboard } from "@/components/Dashboard";

export default function Home() {
  return (
    <main className="h-screen flex flex-col bg-black text-white overflow-hidden font-sans antialiased selection:bg-zinc-800 selection:text-zinc-100">
      <header className="px-6 py-4 flex items-center justify-between border-b border-zinc-900 bg-black z-20">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-zinc-100" />
          <h1 className="text-sm font-semibold tracking-tight text-zinc-100">
            Job Tracker
          </h1>
        </div>
      </header>
      <Dashboard />
    </main>
  );
}
