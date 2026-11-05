import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Draw the stroke once on mount, like a pen crossing the page. */
  animate?: boolean;
};

/** A single hand-drawn ink stroke used under the name and section titles. */
export default function PenStroke({ className, animate = false }: Props) {
  const reduceMotion = useReducedMotion();
  const draw = animate && !reduceMotion;

  return (
    <svg
      aria-hidden
      viewBox="0 0 300 12"
      preserveAspectRatio="none"
      className={cn("pointer-events-none block overflow-visible", className)}
    >
      <motion.path
        d="M2 8.5 C 38 4.5, 74 10, 118 6.5 S 196 3, 236 6 S 284 9.5, 298 5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        initial={draw ? { pathLength: 0 } : false}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, delay: 0.25, ease: [0.65, 0, 0.35, 1] }}
      />
    </svg>
  );
}
