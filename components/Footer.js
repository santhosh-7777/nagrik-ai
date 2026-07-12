import Link from "next/link";
import { LogoIcon } from "./icons";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-white mt-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <LogoIcon className="w-7 h-7" />
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">Nagrik AI</p>
              <p className="text-xs text-[var(--muted-fg)]">Making civic services accessible to every citizen</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--muted-fg)]">
            <Link href="/chat" className="hover:text-[var(--primary)] transition-colors">Ask AI</Link>
            <Link href="/complaint" className="hover:text-[var(--primary)] transition-colors">Report Issue</Link>
            <Link href="/complaint/track" className="hover:text-[var(--primary)] transition-colors">Track Complaint</Link>
            <Link href="/admin" className="hover:text-[var(--primary)] transition-colors">Admin</Link>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between gap-2 text-xs text-[var(--muted-fg)]">
          <p>Built for Smart Bharat Challenge — PromptWars x Devengers</p>
          <p>Answers grounded in verified government scheme data</p>
        </div>
      </div>
    </footer>
  );
}
