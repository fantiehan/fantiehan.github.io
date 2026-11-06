import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";
import ButterflyFlight from "@/components/ButterflyFlight";
import Pencil from "@/components/Pencil";
import { BODY, LEFT_ANTENNA, LEFT_VEIN, LEFT_WING, RIGHT_ANTENNA, RIGHT_VEIN, RIGHT_WING } from "@/lib/butterfly";
import { ERASER, PIVOT, TIP, smoothPath, turn } from "@/lib/pencil";
import { useMasthead } from "@/store/masthead";

const WIDTH = 24;
const LEAN = 24;
/** How far left of the line's end the butterfly is drawn, to leave room for the pencil between them. */
const BUTTERFLY_GAP = 72;
/** Pencil speed on the butterfly in its own units a second, and seconds per lift between strokes. */
const SKETCH_SPEED = 130;
const SKETCH_LIFT = 0.1;

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
  return smoothPath(points);
}

/** Graphite passes: the main stroke, a second pass that wanders off it, and a faint hairline. */
const PASSES = [
  { phase: 0, width: 2.6, opacity: 0.78 },
  { phase: 0.55, width: 1.5, opacity: 0.42 },
  { phase: -0.4, width: 0.8, opacity: 0.3 },
];

/** The butterfly as the pencil draws it: wings, body, antennae, and last the blue of the veins. */
const SKETCH = [
  { d: LEFT_WING, fill: "var(--paper)", width: 1.6 },
  { d: RIGHT_WING, fill: "var(--paper)", width: 1.6 },
  { d: BODY, width: 2 },
  { d: LEFT_ANTENNA, width: 1.1 },
  { d: RIGHT_ANTENNA, width: 1.1 },
  { d: LEFT_VEIN, width: 1.3, stroke: "var(--accent)" },
  { d: RIGHT_VEIN, width: 1.3, stroke: "var(--accent)" },
];

// The butterfly flies once per visit; after that the pencil simply finishes its line and lies down.
let flown = false;

/**
 * Reading progress as a pencil line in the right margin. Scrolling down, the pencil draws a rough
 * graphite line; scrolling up, it turns over and the eraser rubs the line back out. The line's length
 * is scaled so that it reaches the footer rule exactly at the end of the page, and so follows the
 * scroll the whole way. There the pencil draws the site's butterfly on the rule and lies down, and
 * the butterfly flies up to its place in the nav. Wide screens only, where the margin has room;
 * hidden on pages too short to scroll.
 */
export default function ScrollPencil() {
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();
  const boxRef = useRef<HTMLDivElement>(null);
  const strokeRefs = useRef<(SVGPathElement | null)[]>([]);
  const sketchRef = useRef<SVGGElement>(null);
  const sketchStrokeRefs = useRef<(SVGPathElement | null)[]>([]);
  const penRef = useRef<HTMLDivElement>(null);
  const signing = useMasthead((state) => state.signing);
  const [height, setHeight] = useState(0);
  const [scrollable, setScrollable] = useState(false);
  const [flight, setFlight] = useState<{ x: number; y: number } | null>(null);

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
    const sketchStrokes = sketchStrokeRefs.current.slice(0, SKETCH.length);
    const pen = penRef.current;
    const box = boxRef.current;
    const sketch = sketchRef.current;
    if (!paths.length || [...strokes, ...sketchStrokes].some((node) => !node) || !pen || !box || !sketch) return;

    const lengths = strokes.map((stroke) => stroke!.getTotalLength());
    const sketchLengths = sketchStrokes.map((stroke) => stroke!.getTotalLength());
    // A gap longer than the line, so nothing past the drawn part ever shows.
    strokes.forEach((stroke, index) => {
      stroke!.style.strokeDasharray = `${lengths[index]} ${lengths[index] + 40}`;
    });
    sketchStrokes.forEach((stroke, index) => {
      stroke!.style.strokeDasharray = `${sketchLengths[index]} ${sketchLengths[index] + 8}`;
    });
    pen.style.transformOrigin = `${PIVOT.x}px ${PIVOT.y}px`;

    // Length along the main stroke at a given height, so the line can end just short of the rule.
    const SAMPLE = 4;
    const samples: number[] = [];
    for (let at = 0; at <= lengths[0]; at += SAMPLE) samples.push(strokes[0]!.getPointAtLength(at).y);
    const lengthAtY = (y: number) => {
      const index = samples.findIndex((sampleY) => sampleY >= y);
      if (index < 0) return lengths[0];
      if (index === 0) return 0;
      return (index - 1 + (y - samples[index - 1]) / (samples[index] - samples[index - 1] || 1)) * SAMPLE;
    };

    let lastY = window.scrollY;
    let erasing = false;
    /** Where the line ends, in the column's coordinates. The butterfly sits on the rule left of it. */
    let lineEnd = { x: 0, y: 0 };
    const butterflyAt = () => ({ x: lineEnd.x - BUTTERFLY_GAP - 16, y: lineEnd.y - 25 });
    let ending: "idle" | "sketching" | "resting" = "idle";
    let frame = 0;
    let timer = 0;

    const putPen = (x: number, y: number, angle: number) => {
      const contact = turn(TIP, angle);
      pen.style.transform = `translate(${(x - contact.x).toFixed(2)}px, ${(y - contact.y).toFixed(2)}px) rotate(${angle.toFixed(2)}deg)`;
    };

    /** Lying on the rule beside the butterfly, tip towards it, a little askew. */
    const layDown = () => {
      box.dataset.rest = "down";
      pen.style.transform = `translate(${(lineEnd.x - BUTTERFLY_GAP + 42 - PIVOT.x).toFixed(2)}px, ${(lineEnd.y - 5 - PIVOT.y).toFixed(2)}px) rotate(86deg)`;
    };

    const stopEnding = () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      sketch.style.opacity = "0";
      ending = "idle";
    };

    /** Draws the butterfly beside the end of the line, on its own clock now that the scrolling is over. */
    const sketchButterfly = () => {
      ending = "sketching";
      sketchStrokes.forEach((stroke, index) => {
        stroke!.style.strokeDashoffset = `${sketchLengths[index]}`;
        stroke!.style.visibility = "hidden";
      });
      sketch.style.opacity = "1";
      const steps = sketchLengths.map((length, index) => ({ index, lift: index ? SKETCH_LIFT : 0.2, draw: Math.max(0.06, length / SKETCH_SPEED) }));
      let begun = 0;
      const tick = (now: number) => {
        if (!begun) begun = now;
        let t = (now - begun) / 1000;
        const at = butterflyAt();
        const wobble = 2 * Math.sin(t * 7.3) + 1.2 * Math.sin(t * 13.1);
        let previous = { x: lineEnd.x - at.x, y: lineEnd.y - at.y };
        for (const step of steps) {
          const stroke = sketchStrokes[step.index]!;
          const length = sketchLengths[step.index];
          if (t < step.lift) {
            const to = stroke.getPointAtLength(0);
            const k = t / step.lift;
            putPen(at.x + previous.x + (to.x - previous.x) * k, at.y + previous.y + (to.y - previous.y) * k - Math.sin(Math.PI * k) * 5, LEAN + wobble);
            frame = requestAnimationFrame(tick);
            return;
          }
          t -= step.lift;
          if (t < step.draw) {
            const drawn = (t / step.draw) * length;
            stroke.style.visibility = "visible";
            stroke.style.strokeDashoffset = `${length - drawn}`;
            const point = stroke.getPointAtLength(drawn);
            putPen(at.x + point.x, at.y + point.y, LEAN + wobble);
            frame = requestAnimationFrame(tick);
            return;
          }
          t -= step.draw;
          stroke.style.visibility = "visible";
          stroke.style.strokeDashoffset = "0";
          const end = stroke.getPointAtLength(length);
          previous = { x: end.x, y: end.y };
        }
        // Drawn. The pencil is put down, and a moment later the butterfly lifts off the page.
        ending = "resting";
        layDown();
        timer = window.setTimeout(() => {
          const rect = box.getBoundingClientRect();
          const from = butterflyAt();
          flown = true;
          setFlight({ x: rect.left + from.x, y: rect.top + from.y });
        }, 450);
      };
      // Starts once the line has eased down to the rule.
      timer = window.setTimeout(() => {
        box.dataset.rest = "drawing";
        frame = requestAnimationFrame(tick);
      }, 340);
    };

    const place = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = Math.min(window.scrollY, Math.max(max, 0));
      const progress = max > 0 ? Math.max(0, y / max) : 0;
      const delta = window.scrollY - lastY;
      if (Math.abs(delta) > 1) erasing = delta < 0 && progress > 0;
      if (progress === 0) erasing = false;
      lastY = window.scrollY;

      // Where the footer rule will cross the column once the page is at its end. The line's whole
      // length is what reaches it, so the two meet at the end of the page and not before.
      const footer = document.querySelector(".site-footer");
      const ruleAtEnd = footer ? footer.getBoundingClientRect().top - box.getBoundingClientRect().top - (max - y) : Infinity;
      const full = ruleAtEnd < Infinity ? lengthAtY(Math.max(0, ruleAtEnd - 1)) : lengths[0];
      const at = progress * full;

      const point = strokes[0]!.getPointAtLength(at);
      strokes.forEach((stroke, index) => {
        const drawn = (at / lengths[0]) * lengths[index];
        stroke!.style.strokeDashoffset = `${lengths[index] - drawn}`;
        stroke!.style.visibility = drawn < 1.5 ? "hidden" : "visible";
      });
      lineEnd = { x: point.x, y: point.y };
      const mark = butterflyAt();
      sketch.setAttribute("transform", `translate(${mark.x.toFixed(2)} ${mark.y.toFixed(2)})`);

      const atEnd = max > 0 && window.scrollY >= max - 1;
      if (!atEnd && ending !== "idle") stopEnding();
      if (atEnd && ending === "idle") {
        // Nothing to see on a page too short to show the pencil, or while it is still signing Home.
        if (flown || reduceMotion || max <= 240 || useMasthead.getState().signing) ending = "resting";
        else sketchButterfly();
      }
      if (ending === "resting") {
        layDown();
        return;
      }
      if (!atEnd) delete box.dataset.rest;
      if (box.dataset.rest === "drawing") return;

      const ahead = strokes[0]!.getPointAtLength(Math.min(lengths[0], at + 6));
      const slope = (Math.atan2(ahead.x - point.x, ahead.y - point.y) * 180) / Math.PI;
      // Drawing: graphite on the line end, body leaning up and away. Erasing: turned over, eraser on
      // the line end. The half turn between the two is the pencil being flipped in the hand.
      const angle = (erasing ? 180 + LEAN : LEAN) - slope * 0.6;
      const contact = turn(erasing ? ERASER : TIP, angle);
      pen.style.transform = `translate(${(point.x - contact.x).toFixed(2)}px, ${(point.y - contact.y).toFixed(2)}px) rotate(${angle.toFixed(2)}deg)`;
    };

    place();
    // Images loading in change where the footer is without any scrolling.
    const observer = new ResizeObserver(place);
    observer.observe(document.body);
    window.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", place);
      window.removeEventListener("resize", place);
      stopEnding();
      delete box.dataset.rest;
    };
  }, [paths, pathname, reduceMotion]);

  // The drawn butterfly and the flying one must not be seen together.
  useLayoutEffect(() => {
    if (flight && sketchRef.current) sketchRef.current.style.opacity = "0";
  }, [flight]);

  return (
    <>
      <div
        ref={boxRef}
        aria-hidden
        className="scroll-pencil pointer-events-none fixed bottom-7 right-[26px] top-[92px] z-30 hidden xl:block"
        style={{ width: WIDTH, opacity: scrollable && paths.length && !signing ? 1 : 0 }}
      >
        {paths.length ? (
          <svg width={WIDTH} height={height} viewBox={`0 0 ${WIDTH} ${height}`} className="absolute inset-0 overflow-visible">
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
            <g ref={sketchRef} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0 }}>
              {SKETCH.map((part, index) => (
                <path
                  key={part.d}
                  ref={(node) => (sketchStrokeRefs.current[index] = node)}
                  d={part.d}
                  fill={part.fill ?? "none"}
                  stroke={part.stroke ?? "var(--ink)"}
                  strokeWidth={part.width}
                />
              ))}
            </g>
          </svg>
        ) : null}
        <div ref={penRef} className="scroll-pencil-pen absolute left-0 top-0">
          <Pencil />
        </div>
      </div>
      {flight ? <ButterflyFlight from={flight} onDone={() => setFlight(null)} /> : null}
    </>
  );
}
