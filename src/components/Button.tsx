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
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-0";

  const sizes: Record<ButtonSize, string> = {
    sm: "h-9 px-4 text-sm",
    md: "h-10 px-5 text-sm",
  };

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-600/90 hover:-translate-y-[1px]",
    secondary:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:-translate-y-[1px] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10",
    ghost:
      "text-slate-600 hover:bg-slate-100 hover:-translate-y-[1px] dark:text-zinc-200 dark:hover:bg-white/5",
  };

  return (
    <a
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    />
  );
}
