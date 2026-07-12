const variants = {
  primary: "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] shadow-sm shadow-[var(--primary)]/20",
  secondary: "bg-white text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--muted)]",
  ghost: "text-[var(--muted-fg)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-xl",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  ...props
}) {
  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
