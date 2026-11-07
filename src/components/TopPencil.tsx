import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Pencil from "@/components/Pencil";
import { ERASER, PIVOT, TIP, smoothPath, turn } from "@/lib/pencil";
import { useMasthead } from "@/store/masthead";

/** The strip the line is drawn in, centred on the nav's bottom rule, and how far in from each side it runs. */
const HEIGHT = 14;
const MID = HEIGHT / 2;
const INSET = 10;
/** Lying low along the line, so the pencil stays clear of the nav's words above it. */
const LEAN = -74;

/** The same three graphite passes as the margin line, drawn left to right and closer to straight. */
const PASSES = [
  { phase: 0, width: 2.4, opacity: 0.78 },
  { phase: 0.55, width: 1.4, opacity: 0.42 },
  { phase: -0.4, width: 0.8, opacity: 0.3 },
];

function wobblyRow(width: number, phase: number) {
  const points: [number, number][] = [];
  for (let x = INSET; x <= width - INSET; x += 22) {
    const y = MID + 1.5 * Math.sin(x * 0.016 + phase) + 0.9 * Math.sin(x * 0.043 + 1.3 + phase * 1.7) + 0.5 * Math.sin(x * 0.12 + 0.4 + phase * 2.3);
    points.push([x, y]);
  }
  if (points[points.length - 1][0] < width - INSET) points.push([width - INSET, MID]);
  return smoothPath(points);
}

/**
 * Reading progress on narrow screens, where there is no margin for the pencil to work in: it goes over
 * the nav's bottom rule in graphite as the page scrolls, and turns over to rub it out on the way back
 * up. The margin pencil does the same on wide screens.
 *
 * Phones repaint filtered SVG slowly, so the line is painted once and never again: a window slides
 * open over it, and the window and the line move in opposite directions by the same amount, so the
 * line stays put while more of it shows. Moving layers is all the scrolling ever asks for.
 */
export default function TopPencil() {
  const { pathname } = useLocation();
  const boxRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const penRef = useRef<HTMLDivElement>(null);
  const signing = useMasthead((state) => state.signing);
  const [width, setWidth] = useState(0);
  const [top, setTop] = useState(64 - MID);
  const [scrollable, setScrollable] = useState(false);

  const paths = useMemo(() => (width > INSET * 4 ? PASSES.map((pass) => wobblyRow(width, pass.phase)) : []), [width]);

  useEffect(() => {
    const measure = () => {
      if (boxRef.current) setWidth(Math.round(boxRef.current.clientWidth));
      // The nav's height changes with the width, as its links wrap; the line sits on its bottom rule.
      const nav = document.querySelector("header");
      if (nav) setTop(Math.round(nav.getBoundingClientRect().bottom - MID));
      setScrollable(document.documentElement.scrollHeight - window.innerHeight > 240);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pathname]);

  useLayoutEffect(() => {
    const view = windowRef.current;
    const line = lineRef.current;
    const pen = penRef.current;
    if (!paths.length || !view || !line || !pen) return;
    pen.style.transformOrigin = `${PIVOT.x}px ${PIVOT.y}px`;
    const span = width - INSET * 2;
    // Where the line runs at each point across, so the pencil can ride on it without asking the SVG.
    const heights = Array.from({ length: Math.ceil(width / 4) + 1 }, (_, index) => {
      const x = index * 4;
      return MID + 1.5 * Math.sin(x * 0.016) + 0.9 * Math.sin(x * 0.043 + 1.3) + 0.5 * Math.sin(x * 0.12 + 0.4);
    });

    let lastY = window.scrollY;
    let erasing = false;
    let frame = 0;
    const place = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const delta = window.scrollY - lastY;
      if (Math.abs(delta) > 1) erasing = delta < 0 && progress > 0;
      if (progress === 0) erasing = false;
      lastY = window.scrollY;

      const end = INSET + progress * span;
      const hidden = width - end;
      view.style.transform = `translate3d(${(-hidden).toFixed(1)}px, 0, 0)`;
      line.style.transform = `translate3d(${hidden.toFixed(1)}px, 0, 0)`;
      view.style.visibility = progress > 0.002 ? "visible" : "hidden";
      // Drawing, the graphite is on the line's end; erasing, the pencil is turned over onto its eraser.
      const angle = erasing ? 180 + LEAN : LEAN;
      const contact = turn(erasing ? ERASER : TIP, angle);
      const y = heights[Math.min(heights.length - 1, Math.round(end / 4))];
      pen.style.transform = `translate3d(${(end - contact.x).toFixed(1)}px, ${(y - contact.y).toFixed(1)}px, 0) rotate(${angle}deg)`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(place);
    };

    place();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [paths, pathname, width]);

  return (
    <div
      ref={boxRef}
      aria-hidden
      className="top-pencil pointer-events-none fixed left-0 right-0 z-[45] xl:hidden"
      style={{ top, height: HEIGHT, opacity: scrollable && paths.length && !signing ? 1 : 0 }}
    >
      {paths.length ? (
        <div ref={windowRef} className="top-pencil-layer absolute inset-0 overflow-hidden">
          <div ref={lineRef} className="top-pencil-layer absolute inset-0">
            <svg width={width} height={HEIGHT} viewBox={`0 0 ${width} ${HEIGHT}`} className="absolute inset-0 overflow-visible">
              <defs>
                {/* Graphite on paper: ragged edges from a small displacement, and broken tooth from grain. */}
                <filter id="graphite-row" filterUnits="userSpaceOnUse" x={-12} y={-12} width={width + 24} height={HEIGHT + 24}>
                  <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves={2} seed={4} result="wobble" />
                  <feDisplacementMap in="SourceGraphic" in2="wobble" scale={2.2} xChannelSelector="R" yChannelSelector="G" result="ragged" />
                  <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves={1} seed={11} result="tooth" />
                  <feColorMatrix in="tooth" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.9 0 0 0 -0.35" result="grain" />
                  <feComposite in="ragged" in2="grain" operator="in" />
                </filter>
              </defs>
              <g filter="url(#graphite-row)">
                {PASSES.map((pass, index) => (
                  <path
                    key={pass.phase}
                    d={paths[index]}
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth={pass.width}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={pass.opacity}
                  />
                ))}
              </g>
            </svg>
          </div>
        </div>
      ) : null}
      <div ref={penRef} className="top-pencil-layer absolute left-0 top-0">
        <Pencil />
      </div>
    </div>
  );
}
