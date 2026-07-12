export default function Card({ children, className = "", hover = false, ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-[var(--border)] shadow-sm ${hover ? "transition-all duration-200 hover:shadow-md hover:border-[var(--primary)]/20 hover:-translate-y-0.5" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={`p-6 pb-0 ${className}`}>{children}</div>;
}

export function CardBody({ children, className = "" }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}
