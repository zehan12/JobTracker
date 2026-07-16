import Link from "next/link";
import { ArrowRight, Briefcase, Calendar, Star, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-x-hidden selection:bg-foreground selection:text-background">
      <header className="relative z-20 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-foreground" />
          </div>
          <span className="text-xl font-medium tracking-tight text-foreground">
            JobTracker
          </span>
        </div>
        <nav>
          <Link
            href="/dashboard"
            className="group relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors duration-200 ease-in-out bg-secondary rounded-full hover:bg-accent"
          >
            <span className="mr-2">Open Dashboard</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </nav>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-24 pb-32 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full border border-border bg-card shadow-sm transition-colors hover:bg-secondary">
          <Star className="h-3.5 w-3.5 text-foreground" />
          <span className="text-xs font-medium text-foreground">
            Your ultimate career companion
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-8 leading-[1.1] text-foreground">
          Track Applications.
          <br />
          <span className="text-muted-foreground">
            Land the Dream Job.
          </span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-12 font-normal leading-relaxed">
          Organize your job search, schedule interviews, and network smarter.
          All the tools you need in one powerful, beautifully designed
          dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/dashboard"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-medium text-primary-foreground transition-all duration-300 ease-out bg-primary rounded-full hover:opacity-90"
          >
            <span>Start Tracking Now</span>
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1.5" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-muted-foreground transition-colors duration-200 rounded-full hover:text-foreground hover:bg-secondary"
          >
            Explore Features
          </a>
        </div>

        {/* Feature Cards Showcase */}
        <div
          id="features"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full text-left"
        >
          {[
            {
              title: "Kanban Board",
              description:
                "Visualize your application pipeline from applied to offer.",
              icon: <Briefcase className="h-5 w-5 text-foreground" />,
            },
            {
              title: "Smart Calendar",
              description:
                "Never miss an interview with integrated scheduling.",
              icon: <Calendar className="h-5 w-5 text-foreground" />,
            },
            {
              title: "Career Insights",
              description:
                "Track your progress and improve your application success rate.",
              icon: <TrendingUp className="h-5 w-5 text-foreground" />,
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group flex flex-col items-start p-8 rounded-2xl bg-card border border-border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-6 p-3 rounded-xl bg-secondary border border-border transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border mt-12 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} JobTracker. Designed for success.
        </p>
      </footer>
    </div>
  );
}
