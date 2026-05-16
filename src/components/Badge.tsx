import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<"span"> & {
  variant?: "muted" | "accent";
};

export default function Badge({ className, variant = "muted", ...props }: Props) {
  const variants: Record<NonNullable<Props["variant"]>, string> = {
    muted:
      "border-[#d2d2d7] bg-[#f5f5f7] text-[#6e6e73] dark:border-white/12 dark:bg-white/[0.075] dark:text-[#a1a1a6]",
    accent:
      "border-[#0071e3]/20 bg-[#e8f2ff] text-[#0066cc] dark:border-[#2997ff]/25 dark:bg-[#2997ff]/12 dark:text-[#6bb8ff]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
