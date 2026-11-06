import { BODY, LEFT_ANTENNA, LEFT_VEIN, LEFT_WING, RIGHT_ANTENNA, RIGHT_VEIN, RIGHT_WING } from "@/lib/butterfly";
import { cn } from "@/lib/utils";

/** The site mark: the same ink butterfly as the favicon, drawn in the current theme's ink. */
export default function ButterflyMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 32 32" className={cn("block", className)}>
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path fill="var(--paper)" strokeWidth={1.6} d={LEFT_WING} />
        <path fill="var(--paper)" strokeWidth={1.6} d={RIGHT_WING} />
        <path fill="none" stroke="var(--accent)" strokeWidth={1.3} d={`${LEFT_VEIN} ${RIGHT_VEIN}`} />
        <path fill="none" strokeWidth={2} d={BODY} />
        <path fill="none" strokeWidth={1.1} d={`${LEFT_ANTENNA} ${RIGHT_ANTENNA}`} />
      </g>
    </svg>
  );
}
