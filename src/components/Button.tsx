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
    "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] transition duration-300 ease-out will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-[#2997ff]/55 dark:focus-visible:ring-offset-black";

  const sizes: Record<ButtonSize, string> = {
    sm: "h-9 px-4 text-[13px]",
    md: "h-10 px-5 text-sm",
  };

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-[#0071e3] text-white shadow-[0_10px_26px_rgba(0,113,227,0.18)] hover:-translate-y-[1px] hover:bg-[#0077ed] active:bg-[#006edb] dark:bg-[#2997ff] dark:text-black dark:shadow-[0_12px_32px_rgba(41,151,255,0.16)] dark:hover:bg-[#46a6ff]",
    secondary:
      "border border-[#d2d2d7] bg-white text-[#1d1d1f] shadow-[0_8px_24px_rgba(0,0,0,0.045)] hover:-translate-y-[1px] hover:border-[#a1a1a6] hover:bg-[#f5f5f7] dark:border-white/14 dark:bg-[#1d1d1f] dark:text-[#f5f5f7] dark:shadow-none dark:hover:bg-[#242426]",
    ghost:
      "text-[#0066cc] hover:-translate-y-[1px] hover:bg-[#0071e3]/[0.07] hover:text-[#0071e3] dark:text-[#2997ff] dark:hover:bg-[#2997ff]/[0.12] dark:hover:text-[#6bb8ff]",
  };

  return (
    <a
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    />
  );
}
