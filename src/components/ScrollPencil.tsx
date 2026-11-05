import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Pencil from "@/components/Pencil";
import { ERASER, PIVOT, TIP, turn } from "@/lib/pencil";
import { useMasthead } from "@/store/masthead";

const WIDTH = 24;
const LEAN = 24;

/**
 * A deterministic wobbly vertical line, like one drawn freehand down a margin. `phase` shifts the
 * wobble so a second pass drifts on and off the first, as a line gone over twice does.
 */
function wobblyPath(height: number, phase: number) {
  const points: [number, number][] = [];
  for (let y = 0; y <= height; y += 22) {
    const x =
      WIDTH / 2 +
      3.4 * Math.sin(y * 0.016 + phase) +
      1.9 * Math.sin(y * 0.043 + 1.3 + phase * 1.7) +
      1.1 * Math.sin(y * 0.12 + 0.4 + phase * 2.3);
    points.push([x, y]);
  }
  if (points[points.length - 1][1] < height) points.push([WIDTH / 2, height]);
  // Catmull-Rom through the points, written as cubic Béziers.
  let d = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [p0, p1, p2, p3] = [points[i - 1] ?? points[i], points[i], points[i + 1], points[i + 2] ?? points[i + 1]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(2)} ${c1[1].toFixed(2)}, ${c2[0].toFixed(2)} ${c2[1].toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return d;
}

/** Graphite passes: the main stroke, a second pass that wanders off it, and a faint hairline. */
const PASSES = [
  { phase: 0, width: 2.6, opacity: 0.78 },
  { phase: 0.55, width: 1.5, opacity: 0.42 },
  { phase: -0.4, width: 0.8, opacity: 0.3 },
];

/**
 * Reading progress as a pencil line in the right margin. Scrolling down, the pencil draws a rough
 * graphite line; scrolling up, it turns over and the eraser rubs the line back out. The line never
 * crosses the footer's rule: the pencil meets it at the end of the page and is set down on it, and
 * picking it up again (a click) takes the reader back to the top, erasing on the way. Wide screens
 * only, where the margin has room; hidden on pages too short to scroll.
 */
export default function ScrollPencil() {
  const { pathname } = useLocation();
  const boxRef = useRef<HTMLDivElement>(null);
  const strokeRefs = useRef<(SVGPathElement | null)[]>([]);
  const penRef = useRef<HTMLButtonElement>(null);
  const [resting, setResting] = useState(false);
  const signing = useMasthead((state) => state.signing);
  const [height, setHeight] = useState(0);
  const [scrollable, setScrollable] = useState(false);

  const paths = useMemo(() => (height ? PASSES.map((pass) => wobblyPath(height, pass.phase)) : []), [height]);

  // Track the column height and whether the page is long enough to bother.
  useEffect(() => {
    const measure = () => {
      if (boxRef.current) setHeight(Math.round(boxRef.current.clientHeight));
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
    const strokes = strokeRefs.current.slice(0, PASSES.length);
    const pen = penRef.current;
    if (!paths.length || strokes.some((stroke) => !stroke) || !pen) return;
    const lengths = strokes.map((stroke) => stroke!.getTotalLength());
    strokes.forEach((stroke, index) => {
      // A gap longer than the line, so nothing past the drawn part ever shows.
      stroke!.style.strokeDasharray = `${lengths[index]} ${lengths[index] + 40}`;
    });

    // Height along the main stroke, sampled so the line can be cut where the footer rule crosses it.
    const samples: number[] = [];
    for (let at = 0; at <= lengths[0]; at += 4) samples.push(main(at).y);
    function main(at: number) {
      return strokes[0]!.getPointAtLength(at);
    }
    const lengthAtY = (y: number) => {
      const index = samples.findIndex((sampleY) => sampleY >= y);
      return index < 0 ? lengths[0] : index * 4;
    };

    let lastY = window.scrollY;
    let erasing = false;
    let wasResting: boolean | null = null;
    let settling = 0;

    const place = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const delta = window.scrollY - lastY;
      if (Math.abs(delta) > 1) erasing = delta < 0 && progress > 0;
      if (progress === 0) erasing = false;
      lastY = window.scrollY;

      // Where the footer rule crosses the column, in the column's own coordinates.
      const footer = document.querySelector(".site-footer");
      const box = boxRef.current;
      const ruleY = footer && box ? footer.getBoundingClientRect().top - box.getBoundingClientRect().top : Infinity;
      const free = progress * lengths[0];
      const limit = ruleY < Infinity ? lengthAtY(ruleY - 3) : lengths[0];
      const at = Math.min(free, limit);
      const rest = free >= limit && progress > 0;

      strokes.forEach((stroke, index) => {
        const drawn = (at / lengths[0]) * lengths[index];
        stroke!.style.strokeDashoffset = `${lengths[index] - drawn}`;
        stroke!.style.visibility = drawn < 1.5 ? "hidden" : "visible";
      });

      if (rest !== wasResting && box) {
        wasResting = rest;
        setResting(rest);
        window.clearTimeout(settling);
        // The line is cut at the rule straight away. The pencil eases down, then rides with the page.
        if (rest) {
          box.dataset.rest = "landing";
          settling = window.setTimeout(() => (box.dataset.rest = "settled"), 400);
        } else {
          delete box.dataset.rest;
        }
      }

      const point = main(at);
      if (rest) {
        // Set down on the rule, lying along it to the left of the line's end, a little askew.
        const angle = -84;
        const tx = point.x - 30 - PIVOT.x;
        const ty = ruleY - 4.6 - PIVOT.y;
        pen.style.transformOrigin = `${PIVOT.x}px ${PIVOT.y}px`;
        pen.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) rotate(${angle}deg)`;
        return;
      }

      const ahead = main(Math.min(lengths[0], at + 6));
      const slope = (Math.atan2(ahead.x - point.x, ahead.y - point.y) * 180) / Math.PI;
      // Drawing: graphite on the line end, body leaning up and away. Erasing: turned over, eraser on
      // the line end. The half turn between the two is the pencil being flipped in the hand.
      const angle = (erasing ? 180 + LEAN : LEAN) - slope * 0.6;
      const contact = turn(erasing ? ERASER : TIP, angle);
      const tx = point.x - contact.x;
      const ty = point.y - contact.y;
      pen.style.transformOrigin = `${PIVOT.x}px ${PIVOT.y}px`;
      pen.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) rotate(${angle.toFixed(2)}deg)`;
    };

    place();
    window.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place);
      window.removeEventListener("resize", place);
      window.clearTimeout(settling);
    };
  }, [paths, pathname]);

  return (
    <div
      ref={boxRef}
      className="scroll-pencil pointer-events-none fixed bottom-7 right-[26px] top-[92px] z-30 hidden xl:block"
      style={{ width: WIDTH, opacity: scrollable && paths.length && !signing ? 1 : 0 }}
    >
      {paths.length ? (
        <svg aria-hidden width={WIDTH} height={height} viewBox={`0 0 ${WIDTH} ${height}`} className="absolute inset-0 overflow-visible">
          <defs>
            {/* Graphite on paper: ragged edges from a small displacement, and broken tooth from grain. */}
            <filter id="graphite" filterUnits="userSpaceOnUse" x={-12} y={-12} width={WIDTH + 24} height={height + 24}>
              <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves={2} seed={4} result="wobble" />
              <feDisplacementMap in="SourceGraphic" in2="wobble" scale={2.4} xChannelSelector="R" yChannelSelector="G" result="ragged" />
              <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves={1} seed={11} result="tooth" />
              <feColorMatrix in="tooth" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.9 0 0 0 -0.35" result="grain" />
              <feComposite in="ragged" in2="grain" operator="in" />
            </filter>
          </defs>
          <g filter="url(#graphite)">
            {PASSES.map((pass, index) => (
              <path
                key={pass.phase}
                ref={(node) => (strokeRefs.current[index] = node)}
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
      ) : null}
      {/* Only the resting pencil can be picked up; while it writes it is out of reach and unfocusable. */}
      <button
        ref={penRef}
        type="button"
        tabIndex={resting ? 0 : -1}
        aria-hidden={!resting}
        aria-label="Back to top"
        title="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`scroll-pencil-pen absolute left-0 top-0 ${resting ? "is-resting pointer-events-auto cursor-pointer" : ""}`}
      >
        <Pencil />
      </button>
    </div>
  );
}
