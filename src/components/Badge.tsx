import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<"span"> & {
  variant?: "muted" | "accent";
};

export default function Badge({ className, variant = "muted", ...props }: Props) {
  const variants: Record<NonNullable<Props["variant"]>, string> = {
    muted:
      "border-[#d8cdb9]/80 bg-[#fffaf0]/70 text-[#6d675d] dark:border-white/10 dark:bg-white/[0.055] dark:text-[#c9c0b1]",
    accent:
      "border-[#b28a49]/30 bg-[#b28a49]/10 text-[#735728] dark:border-[#d4b06a]/30 dark:bg-[#d4b06a]/10 dark:text-[#ead4a4]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
