import Link from "next/link";
import Card, { CardBody } from "@/components/ui/Card";
import { ChatIcon, MegaphoneIcon, SearchIcon, ShieldIcon, SparklesIcon } from "@/components/icons";

const features = [
  {
    href: "/chat",
    icon: ChatIcon,
    title: "Ask Nagrik AI",
    description: "Get answers on government schemes, documents, and eligibility — grounded in verified data, in your language.",
    accent: "bg-blue-50 text-blue-600",
    cta: "Start chatting",
  },
  {
    href: "/complaint",
    icon: MegaphoneIcon,
    title: "Report an Issue",
    description: "Submit civic complaints with auto urgency classification. Get a tracking ID instantly.",
    accent: "bg-orange-50 text-orange-600",
    cta: "File complaint",
  },
  {
    href: "/complaint/track",
    icon: SearchIcon,
    title: "Track Complaint",
    description: "Check live status of your complaint — from Received to In Progress to Resolved.",
    accent: "bg-emerald-50 text-emerald-600",
    cta: "Track now",
  },
];

const highlights = [
  { label: "15+ Schemes", detail: "Verified knowledge base" },
  { label: "Multilingual", detail: "Hindi, Telugu, English & more" },
  { label: "AI-Powered", detail: "Smart categorization & answers" },
  { label: "No Login", detail: "Open access for all citizens" },
];

export default function Home() {
  return (
    <main>
      <section className="hero-gradient">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-12 pb-16 sm:pt-16 sm:pb-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)]/10 px-4 py-1.5 text-sm font-medium text-[var(--primary)] mb-6">
              <SparklesIcon className="w-4 h-4" />
              Smart Bharat Challenge — AI for Every Citizen
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--foreground)] tracking-tight leading-[1.1]">
              Your AI-powered{" "}
              <span className="text-[var(--primary)]">civic companion</span>
            </h1>

            <p className="mt-5 text-lg text-[var(--muted-fg)] leading-relaxed max-w-2xl">
              Access government services, report public issues, and get personalized assistance — in the language you speak.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-xl font-medium shadow-sm shadow-[var(--primary)]/25 hover:bg-[var(--primary-dark)] transition-all"
              >
                <ChatIcon className="w-5 h-5" />
                Ask Nagrik AI
              </Link>
              <Link
                href="/complaint"
                className="inline-flex items-center gap-2 bg-white text-[var(--foreground)] border border-[var(--border)] px-6 py-3 rounded-xl font-medium hover:bg-[var(--muted)] transition-all"
              >
                <MegaphoneIcon className="w-5 h-5" />
                Report an Issue
              </Link>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {highlights.map((h) => (
              <div key={h.label} className="bg-white/60 backdrop-blur rounded-xl border border-[var(--border)] px-4 py-3">
                <p className="text-sm font-semibold text-[var(--foreground)]">{h.label}</p>
                <p className="text-xs text-[var(--muted-fg)] mt-0.5">{h.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">What would you like to do?</h2>

        <nav aria-label="Main services" className="grid gap-5 sm:grid-cols-3">
          {features.map((f) => (
            <Link key={f.href} href={f.href} aria-label={f.title}>
              <Card hover className="h-full">
                <CardBody className="flex flex-col h-full">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${f.accent} mb-4`}>
                    <f.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">{f.title}</h3>
                  <p className="text-sm text-[var(--muted-fg)] leading-relaxed flex-1">{f.description}</p>
                  <span className="mt-4 text-sm font-medium text-[var(--primary)]">{f.cta} →</span>
                </CardBody>
              </Card>
            </Link>
          ))}
        </nav>
      </section>

      <section className="border-t border-[var(--border)] bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
              <ShieldIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--foreground)]">Government staff?</h3>
              <p className="text-sm text-[var(--muted-fg)] mt-1">
                Access the admin dashboard to view and manage citizen complaints.
              </p>
            </div>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm font-medium border border-[var(--border)] rounded-xl px-5 py-2.5 hover:bg-[var(--muted)] transition-colors shrink-0"
          >
            <ShieldIcon className="w-4 h-4" />
            Admin Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
