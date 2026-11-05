import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * A note's headpiece. It develops from left to right like ink taking to paper when the page opens
 * (`.headpiece-develop` in CSS), then lags behind the text and fades as the reader scrolls past,
 * like a page turning away. The drift is a passive scroll listener writing one CSS variable.
 */
export default function Headpiece({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || reduceMotion) return;
    const update = () => {
      const height = node.offsetHeight || 1;
      const progress = Math.min(1, Math.max(0, window.scrollY / height));
      node.style.setProperty("--drift", progress.toFixed(3));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [reduceMotion]);

  return (
    <div ref={ref} className="headpiece-drift mx-auto max-w-[1200px] px-3 pt-8 sm:px-6 sm:pt-12">
      <img src={src} alt={alt} className="headpiece headpiece-develop mx-auto block w-full" />
    </div>
  );
}
