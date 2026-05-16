import { motion } from "framer-motion";
import { Building2, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimelineItem } from "@/content/types";

type Props = {
  items: TimelineItem[];
  className?: string;
};

export default function Timeline({ items, className }: Props) {
  const iconMap = {
    university: GraduationCap,
    company: Building2,
  };

  return (
    <div className={cn("relative grid gap-4", className)}>
      <div className="absolute bottom-6 left-4 top-6 hidden w-px bg-gradient-to-b from-transparent via-[#d2d2d7] to-transparent dark:via-white/16 sm:block" />
      {items.map((item, index) => (
        <motion.div
          key={`${item.range}-${item.title}`}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.52, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="surface-hairline group relative overflow-hidden rounded-[1.55rem] border border-[#d2d2d7]/80 bg-[#f5f5f7] p-5 shadow-[0_10px_32px_rgba(0,0,0,0.045)] transition duration-300 hover:-translate-y-[2px] hover:border-[#a1a1a6] hover:bg-white dark:border-white/10 dark:bg-white/[0.075] dark:shadow-refined-dark dark:hover:border-white/18 dark:hover:bg-white/[0.1] sm:ml-9"
        >
          <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-[#0071e3]/72 via-[#0071e3]/20 to-transparent opacity-80 dark:from-[#2997ff]/75" />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              {item.logo ? (
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[#d2d2d7] bg-white p-1.5 shadow-sm dark:border-white/12 dark:bg-white/10">
                  <img src={item.logo} alt={`${item.title} logo`} className="h-full w-full object-contain" />
                </span>
              ) : item.icon ? (
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[#d2d2d7] bg-white text-[#0066cc] dark:border-white/12 dark:bg-white/[0.08] dark:text-[#2997ff]">
                  {(() => {
                    const Icon = iconMap[item.icon];
                    return <Icon className="h-4 w-4" />;
                  })()}
                </span>
              ) : null}
              <div>
                <div className="text-sm font-semibold leading-6 tracking-[-0.01em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                  {item.title}
                </div>
                {item.subtitle ? (
                  <div className="mt-1 text-sm leading-6 text-[#6e6e73] dark:text-[#a1a1a6]">{item.subtitle}</div>
                ) : null}
              </div>
            </div>
            <div className="w-fit rounded-full border border-[#d2d2d7] bg-white px-3 py-1 text-xs font-medium text-[#6e6e73] dark:border-white/12 dark:bg-white/[0.075] dark:text-[#a1a1a6]">
              {item.range}
            </div>
          </div>
          {item.details.length ? (
            <ul className="mt-4 grid gap-2 text-sm leading-6 text-[#6e6e73] dark:text-[#a1a1a6]">
              {item.details.map((d) => (
                <li key={d} className="flex gap-2">
                  <span className="mt-[0.65rem] h-1 w-1 shrink-0 rounded-full bg-[#0071e3]/80 dark:bg-[#2997ff]/85" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </motion.div>
      ))}
    </div>
  );
}
