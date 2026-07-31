import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<"span"> & {
  variant?: "muted" | "accent";
};

export default function Badge({ className, variant = "muted", ...props }: Props) {
  const variants: Record<NonNullable<Props["variant"]>, string> = {
    muted: "border-[var(--line)] bg-[var(--paper-deep)] text-[var(--ink-soft)]",
    accent: "border-[var(--accent)] bg-[var(--paper-soft)] text-[var(--accent)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center border px-2.5 py-1 font-mono text-[10.5px] font-medium tracking-[0.16em]",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
