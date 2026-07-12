"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoIcon, ShieldIcon } from "./icons";

const navLinks = [
  { href: "/chat", label: "Ask AI" },
  { href: "/complaint", label: "Report Issue" },
  { href: "/complaint/track", label: "Track" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <LogoIcon className="w-9 h-9 transition-transform group-hover:scale-105" />
          <div>
            <span className="text-lg font-bold text-[var(--foreground)] tracking-tight">Nagrik AI</span>
            <span className="hidden sm:block text-[10px] text-[var(--muted-fg)] leading-none">Civic Companion</span>
          </div>
        </Link>

        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "text-[var(--muted-fg)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--muted-fg)] border border-[var(--border)] rounded-xl px-3.5 py-2 hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          aria-label="Admin dashboard"
        >
          <ShieldIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Admin</span>
        </Link>
      </div>

      <nav aria-label="Mobile navigation" className="md:hidden flex border-t border-[var(--border)] px-2 py-1.5 gap-1">
        {navLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex-1 text-center py-2 rounded-lg text-xs font-medium transition-colors ${
                active ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "text-[var(--muted-fg)]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
