const variants = {
  critical: "bg-red-50 text-red-700 ring-1 ring-red-200",
  medium: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  not_urgent: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  received: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  in_progress: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  resolved: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  default: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
};

export default function Badge({ children, variant = "default", className = "" }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${variants[variant] || variants.default} ${className}`}
    >
      {children}
    </span>
  );
}
