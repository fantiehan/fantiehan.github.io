import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary";
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
    "inline-flex items-center justify-center gap-2 rounded-[3px] border font-medium transition-colors duration-200";

  const sizes: Record<ButtonSize, string> = {
    sm: "min-h-9 px-3.5 text-[15px]",
    md: "min-h-11 px-5 text-[17px]",
  };

  const variants: Record<ButtonVariant, string> = {
    primary: "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] hover:border-[var(--accent)] hover:bg-[var(--accent)]",
    secondary: "border-[var(--line-strong)] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
  };

  return <a className={cn(base, sizes[size], variants[variant], className)} {...props} />;
}
