import { Loader2 } from "lucide-react";

export function Button({ children, className = "", loading = false, disabled = false, variant = "primary", size = "md", ...props }) {
  const variants = {
    primary: "bg-primary text-primary-foreground shadow-[0_12px_36px_rgba(129,145,255,0.25)] hover:bg-primary/90",
    secondary: "border border-border bg-surface/70 text-foreground hover:bg-white/10",
    accent: "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-95",
    ghost: "bg-transparent text-foreground hover:bg-white/8"
  };
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-sm",
    lg: "h-12 px-6 text-base"
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
