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
      className={cn("py-14", className)}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h2>
        {subtitle ? (
          <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-zinc-400">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </motion.section>
  );
}
