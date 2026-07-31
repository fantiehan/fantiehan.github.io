import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

type Props = React.ComponentPropsWithoutRef<"a"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export default function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 border font-mono font-medium tracking-[0.08em] transition duration-300 ease-out hover:-translate-y-[1px] active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]";

  const sizes: Record<ButtonSize, string> = {
    sm: "min-h-9 px-3.5 py-2 text-[11px]",
    md: "min-h-10 px-4 py-2.5 text-[12px]",
  };

  const variants: Record<ButtonVariant, string> = {
    primary: "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] shadow-paper hover:bg-[var(--accent)] hover:text-[var(--paper)]",
    secondary: "border-[var(--line-strong)] bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
    ghost: "border-transparent bg-transparent text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--paper-soft)]",
  };

  return <a className={cn(base, sizes[size], variants[variant], className)} {...props} />;
}
