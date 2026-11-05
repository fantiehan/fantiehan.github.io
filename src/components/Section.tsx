import PenStroke from "@/components/PenStroke";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  /** Optional link or control aligned with the heading. */
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export default function Section({ title, action, children, className }: Props) {
  return (
    <section className={cn("py-10 sm:py-12", className)}>
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="relative inline-block pb-2 text-[28px] font-medium leading-tight text-[var(--ink)] sm:text-[32px]">
          {title}
          <PenStroke className="absolute bottom-0 left-0 h-2 w-full text-[var(--accent)]" />
        </h2>
        {action ? <div className="pb-2 text-[16px]">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
