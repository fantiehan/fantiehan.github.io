import { cn } from "@/lib/utils";

/** The site mark: the same ink butterfly as the favicon, drawn in the current theme's ink. */
export default function ButterflyMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 32 32" className={cn("block", className)}>
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path
          fill="var(--paper)"
          strokeWidth={1.6}
          d="M15.4 15.2 C 12.6 8.6, 6.4 4.6, 3.6 6.8 C 1.6 8.6, 3.8 13.8, 9 15.6 C 4.8 16.6, 3.6 21, 6.2 23.6 C 9 26.2, 13.4 22.4, 15.4 17.4 Z"
        />
        <path
          fill="var(--paper)"
          strokeWidth={1.6}
          d="M16.6 15.2 C 19.4 8.6, 25.6 4.6, 28.4 6.8 C 30.4 8.6, 28.2 13.8, 23 15.6 C 27.2 16.6, 28.4 21, 25.8 23.6 C 23 26.2, 18.6 22.4, 16.6 17.4 Z"
        />
        <path
          fill="none"
          stroke="var(--accent)"
          strokeWidth={1.3}
          d="M7.2 9.4 C 9.4 10.2, 11.4 11.8, 12.6 13.6 M24.8 9.4 C 22.6 10.2, 20.6 11.8, 19.4 13.6"
        />
        <path fill="none" strokeWidth={2} d="M16 11.2 L 16 23.4" />
        <path fill="none" strokeWidth={1.1} d="M15.6 11 C 14.8 8.6, 13.4 7.2, 12.2 6.6 M16.4 11 C 17.2 8.6, 18.6 7.2, 19.8 6.6" />
      </g>
    </svg>
  );
}
