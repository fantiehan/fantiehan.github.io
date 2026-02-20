import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<"span"> & {
  variant?: "muted" | "accent";
};

export default function Badge({ className, variant = "muted", ...props }: Props) {
  const variants: Record<NonNullable<Props["variant"]>, string> = {
    muted: "border-slate-200 bg-slate-100 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200",
    accent: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-400/25 dark:bg-blue-500/10 dark:text-blue-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
