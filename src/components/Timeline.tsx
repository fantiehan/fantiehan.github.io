import { cn } from "@/lib/utils";
import type { TimelineItem } from "@/content/types";

type Props = {
  items: TimelineItem[];
  className?: string;
};

export default function Timeline({ items, className }: Props) {
  return (
    <ol className={cn("grid gap-7", className)}>
      {items.map((item) => (
        <li key={`${item.range}-${item.title}`} className="grid grid-cols-[40px_minmax(0,1fr)] gap-4">
          {item.logo ? (
            <img src={item.logo} alt="" className="mt-1 h-10 w-10 object-contain xerox-soft" />
          ) : (
            <span />
          )}
          <div>
            <p className="font-type text-[14px] leading-5 text-[var(--ink-soft)]">{item.range}</p>
            <h3 className="mt-1 text-[19px] font-medium leading-[1.3] text-[var(--ink)]">{item.title}</h3>
            {item.subtitle ? (
              <p className="mt-1 text-[16px] leading-[1.5] text-[var(--ink-soft)]">{item.subtitle}</p>
            ) : null}
            {item.details.length ? (
              <ul className="mt-1 text-[16px] leading-[1.5] text-[var(--ink-soft)]">
                {item.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
