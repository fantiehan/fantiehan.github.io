import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
};

export default function Section({ title, subtitle, children, className }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.15"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [18, -18]);
  const smoothOpacity = useSpring(opacity, { stiffness: 140, damping: 24 });
  const smoothY = useSpring(y, { stiffness: 140, damping: 24 });

  return (
    <motion.section
      ref={ref}
      className={cn("py-14", className)}
      style={{ opacity: smoothOpacity, y: smoothY }}
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h2>
        {subtitle ? (
          <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-zinc-400">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </motion.section>
  );
}
