import Link from "next/link";
import { ArrowLeftIcon } from "./icons";

export default function PageHeader({ title, description, backHref = "/" }) {
  return (
    <div className="mb-8">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-fg)] hover:text-[var(--primary)] transition-colors mb-4"
      >
        <ArrowLeftIcon />
        Back to home
      </Link>
      <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">{title}</h1>
      {description && (
        <p className="mt-2 text-[var(--muted-fg)] max-w-2xl">{description}</p>
      )}
    </div>
  );
}
