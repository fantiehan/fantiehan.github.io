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
      <div className="absolute bottom-6 left-4 top-6 hidden w-px bg-gradient-to-b from-transparent via-[#cdbfaa] to-transparent dark:via-white/16 sm:block" />
      {items.map((item, index) => (
        <motion.div
          key={`${item.range}-${item.title}`}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.52, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="surface-hairline group relative overflow-hidden rounded-[1.55rem] border border-[#d8cdb9]/75 bg-[#fffdf7]/80 p-5 shadow-refined backdrop-blur transition duration-300 hover:-translate-y-[2px] hover:border-[#b28a49]/35 hover:bg-white dark:border-white/10 dark:bg-white/[0.055] dark:shadow-refined-dark dark:hover:border-[#d4b06a]/30 dark:hover:bg-white/[0.075] sm:ml-9"
        >
          <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-[#b28a49]/60 via-[#b28a49]/20 to-transparent opacity-70 dark:from-[#d4b06a]/65" />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              {item.logo ? (
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[#d8cdb9]/70 bg-white/90 p-1.5 shadow-sm dark:border-white/10 dark:bg-white/10">
                  <img src={item.logo} alt={`${item.title} logo`} className="h-full w-full object-contain" />
                </span>
              ) : item.icon ? (
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[#d8cdb9]/70 bg-[#fffaf0] text-[#7c5d2d] dark:border-white/10 dark:bg-white/[0.07] dark:text-[#e7cf9b]">
                  {(() => {
                    const Icon = iconMap[item.icon];
                    return <Icon className="h-4 w-4" />;
                  })()}
                </span>
              ) : null}
              <div>
                <div className="text-sm font-semibold leading-6 tracking-[-0.01em] text-[#211f1b] dark:text-[#f6efe3]">
                  {item.title}
                </div>
                {item.subtitle ? (
                  <div className="mt-1 text-sm leading-6 text-[#6d675d] dark:text-[#c9c0b1]">{item.subtitle}</div>
                ) : null}
              </div>
            </div>
            <div className="w-fit rounded-full border border-[#d8cdb9]/65 bg-[#f7f2ea]/70 px-3 py-1 text-xs font-medium text-[#756d60] dark:border-white/10 dark:bg-white/[0.055] dark:text-[#bdb4a6]">
              {item.range}
            </div>
          </div>
          {item.details.length ? (
            <ul className="mt-4 grid gap-2 text-sm leading-6 text-[#746d62] dark:text-[#bdb4a6]">
              {item.details.map((d) => (
                <li key={d} className="flex gap-2">
                  <span className="mt-[0.65rem] h-1 w-1 shrink-0 rounded-full bg-[#b28a49]/75 dark:bg-[#d4b06a]/80" />
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
