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
    "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] transition duration-300 ease-out will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f2ea] dark:focus-visible:ring-offset-[#08090b]";

  const sizes: Record<ButtonSize, string> = {
    sm: "h-9 px-4 text-[13px]",
    md: "h-10 px-5 text-sm",
  };

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-[#211f1b] text-[#fffaf0] shadow-[0_10px_28px_rgba(33,31,27,0.16)] hover:-translate-y-[1px] hover:bg-[#2c2923] dark:bg-[#f6efe3] dark:text-[#11100e] dark:shadow-[0_12px_34px_rgba(246,239,227,0.11)] dark:hover:bg-white",
    secondary:
      "border border-[#d8cdb9]/80 bg-[#fffdf7]/75 text-[#353128] shadow-[0_8px_26px_rgba(34,30,24,0.05)] backdrop-blur hover:-translate-y-[1px] hover:border-[#b28a49]/45 hover:bg-white dark:border-white/10 dark:bg-white/[0.055] dark:text-[#f6efe3] dark:shadow-none dark:hover:border-[#d4b06a]/35 dark:hover:bg-white/[0.09]",
    ghost:
      "text-[#6d675d] hover:-translate-y-[1px] hover:bg-[#211f1b]/[0.045] hover:text-[#211f1b] dark:text-[#c9c0b1] dark:hover:bg-white/[0.07] dark:hover:text-white",
  };

  return (
    <a
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    />
  );
}
