import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TimelineItem } from "@/content/types";

type Props = {
  items: TimelineItem[];
  className?: string;
};

export default function Timeline({ items, className }: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={cn("grid gap-4", className)}>
      {items.map((item, index) => (
        <motion.article
          key={`${item.range}-${item.title}`}
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.48, delay: reduceMotion ? 0 : index * 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="surface-hairline border border-[var(--line)] bg-[var(--paper-deep)] p-5 shadow-paper-soft transition duration-300 hover:-translate-y-[2px] hover:border-[var(--line-strong)]"
        >
          <div className="grid gap-5 sm:grid-cols-[0.22fr_1fr] sm:items-start">
            <div className="font-mono text-[11px] leading-5 tracking-[0.12em] text-[var(--accent)]">
              {item.range}
            </div>
            <div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  {item.logo ? (
                    <span className="grid h-11 w-11 shrink-0 place-items-center border border-[var(--line)] bg-[var(--paper)] p-1.5">
                      <img src={item.logo} alt={`${item.title} logo`} className="h-full w-full object-contain xerox-soft" />
                    </span>
                  ) : null}
                  <div>
                    <h3 className="text-[18px] font-semibold leading-6 text-[var(--ink)]">
                      {item.title}
                    </h3>
                    {item.subtitle ? (
                      <p className="mt-1 text-[15px] leading-6 text-[var(--ink-soft)]">{item.subtitle}</p>
                    ) : null}
                  </div>
                </div>
              </div>
              {item.details.length ? (
                <ul className="mt-4 grid gap-2 text-[15px] leading-6 text-[var(--ink-soft)]">
                  {item.details.map((detail) => (
                    <li key={detail} className="grid grid-cols-[1rem_1fr] gap-2">
                      <span className="font-mono text-[var(--accent)]">-</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
