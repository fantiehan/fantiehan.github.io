import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
};

export default function Section({ title, subtitle, children, className }: Props) {
  return (
    <motion.section
      className={cn("py-14 sm:py-16", className)}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18, margin: "0px 0px -90px 0px" }}
      transition={{ duration: 0.66, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-7 border-t border-[#d2d2d7] pt-6 dark:border-white/12">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-2xl font-semibold tracking-[-0.035em] text-[#1d1d1f] dark:text-[#f5f5f7]">
            {title}
          </h2>
          {subtitle ? (
            <p className="max-w-xl text-sm leading-7 text-[#6e6e73] dark:text-[#a1a1a6] sm:text-right">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
      {children}
    </motion.section>
  );
}
