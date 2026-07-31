import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  subtitle?: string;
  meta?: string;
  children: React.ReactNode;
  className?: string;
};

export default function Section({ title, subtitle, meta, children, className }: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className={cn("py-12 sm:py-14", className)}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-7 border-b border-[var(--line)] pb-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-mono text-[13px] font-medium tracking-[0.18em] text-[var(--ink)]">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-2 max-w-2xl text-[16px] leading-7 text-[var(--ink-soft)]">
                {subtitle}
              </p>
            ) : null}
          </div>
          {meta ? <span className="font-mono text-[11px] text-[var(--ink-soft)]">{meta}</span> : null}
        </div>
      </div>
      {children}
    </motion.section>
  );
}
