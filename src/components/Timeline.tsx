import { cn } from "@/lib/utils";
import type { TimelineItem } from "@/content/types";
import { Building2, GraduationCap } from "lucide-react";

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
    <div className={cn("grid gap-4", className)}>
      {items.map((item) => (
        <div
          key={`${item.range}-${item.title}`}
          className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
        >
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              {item.icon ? (
                <span className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white">
                  {(() => {
                    const Icon = iconMap[item.icon];
                    return <Icon className="h-4 w-4" />;
                  })()}
                </span>
              ) : null}
              <span>{item.title}</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-zinc-400">{item.range}</div>
          </div>
          {item.subtitle ? (
            <div className="mt-1 text-sm text-slate-600 dark:text-zinc-300">{item.subtitle}</div>
          ) : null}
          {item.details.length ? (
            <ul className="mt-3 space-y-1 text-sm leading-6 text-slate-500 dark:text-zinc-400">
              {item.details.map((d) => (
                <li key={d}>• {d}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </div>
  );
}
