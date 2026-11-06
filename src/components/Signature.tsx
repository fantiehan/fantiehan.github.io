import { forwardRef, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Pencil from "@/components/Pencil";
import { PIVOT, TIP, smoothPath, turn } from "@/lib/pencil";
import signature from "@/assets/brand/signature.png";
import { useMasthead } from "@/store/masthead";

/** The signature image is 1120×244; strokes below are in its pixels, in the order they were written. */
const VIEW = { width: 1120, height: 244 };
const STROKES: [number, number][][] = [
  // T: crossbar, then stem
  [[23, 69], [60, 60], [100, 49], [160, 33], [200, 26], [240, 22], [262, 21], [258, 27]],
  [[160, 34], [134, 74], [120, 100], [100, 143], [83, 177], [69, 206], [61, 226]],
  // iehan, in one movement
  [
    [111, 207], [129, 200], [160, 177], [183, 151], [176, 168], [171, 190], [178, 200], [200, 197], [226, 186],
    [251, 166], [260, 147], [250, 140], [236, 146], [228, 162], [229, 183], [240, 196], [258, 197], [280, 189],
    [300, 177], [320, 160], [336, 124], [346, 96], [360, 60], [376, 30], [390, 13], [400, 13], [402, 30],
    [396, 50], [380, 80], [360, 110], [340, 136], [320, 166], [306, 196], [316, 176], [340, 154], [366, 142],
    [372, 152], [370, 170], [376, 184], [390, 186], [404, 178], [420, 166], [440, 150], [458, 134], [466, 138],
    [460, 156], [440, 176], [418, 190], [412, 180], [420, 164], [446, 146], [466, 142], [460, 166], [460, 184],
    [480, 178], [500, 166], [526, 143], [531, 149], [524, 170], [517, 184], [537, 166], [566, 143], [573, 154],
    [577, 171], [594, 183], [617, 175], [641, 156],
  ],
  // the dot on the i, once the word is done
  [[208, 108], [209, 109]],
  // F: stem, top bar, crossbar
  [[820, 37], [800, 74], [786, 100], [769, 137], [749, 177], [731, 200], [723, 217]],
  [[754, 69], [800, 54], [843, 37], [886, 23], [911, 21], [913, 27]],
  [[743, 139], [790, 132], [830, 127], [863, 123]],
  // an
  [
    [897, 123], [871, 137], [851, 166], [854, 186], [871, 183], [900, 160], [917, 134], [906, 160], [903, 180],
    [923, 177], [951, 160], [974, 134], [960, 163], [957, 177], [986, 151], [1009, 137], [1017, 149], [1023, 166],
    [1043, 174], [1071, 169], [1109, 151],
  ],
];

const PATHS = STROKES.map(smoothPath);
/** Signature pixels per second while the pencil is on the paper, and seconds per pen lift. */
const SPEED = 1500;
const LIFT = 0.16;
const LEAN = 28;
const PENCIL_SCALE = 1.25;

// Written once per visit: coming back to Home later shows the signature as it was left.
let written = false;

/**
 * The name as a signature, written by the margin pencil when the site first opens on Home. The ink
 * is the signature image itself; a thick reveal stroke follows the order the name was written in,
 * and the CSS mask on the span keeps only the real ink under it.
 */
const Signature = forwardRef<HTMLSpanElement>(function Signature(_, ref) {
  const reduceMotion = useReducedMotion();
  const [writing, setWriting] = useState(() => !written && !reduceMotion);
  const setSigning = useMasthead((state) => state.setSigning);
  const boxRef = useRef<HTMLSpanElement | null>(null);
  const strokeRefs = useRef<(SVGPathElement | null)[]>([]);
  const penRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!writing) return;
    written = true;
    const strokes = strokeRefs.current;
    const pen = penRef.current;
    const box = boxRef.current;
    if (strokes.some((stroke) => !stroke) || !pen || !box) return;
    setSigning(true);

    const lengths = strokes.map((stroke) => stroke!.getTotalLength());
    strokes.forEach((stroke, index) => {
      stroke!.style.strokeDasharray = `${lengths[index]} ${lengths[index] + 60}`;
      stroke!.style.strokeDashoffset = `${lengths[index]}`;
    });

    // The timeline: each stroke is a lift to its start (longer the further the pen travels), then the
    // stroke itself at a steady hand's pace.
    const steps = lengths.map((length, stroke) => {
      const to = STROKES[stroke][0];
      const from = STROKES[stroke - 1]?.at(-1);
      const travel = from ? Math.hypot(to[0] - from[0], to[1] - from[1]) : 0;
      return { stroke, lift: from ? LIFT + travel / 3000 : 0.5, draw: Math.max(0.08, length / SPEED) };
    });
    const settle = 0.6;
    const delay = 0.45;
    const total = steps.reduce((sum, step) => sum + step.lift + step.draw, 0) + settle;

    // The pen turns and scales about its pivot, so the offset to its tip is the pivot plus the scaled,
    // turned arm from pivot to tip.
    const place = (x: number, y: number, raise: number, opacity: number, wobble: number) => {
      const scale = box.clientWidth / VIEW.width;
      const angle = LEAN + wobble;
      const tip = turn(TIP, angle);
      const tx = x * scale - PIVOT.x - (tip.x - PIVOT.x) * PENCIL_SCALE;
      const ty = y * scale - PIVOT.y - (tip.y - PIVOT.y) * PENCIL_SCALE - raise;
      pen.style.opacity = `${opacity}`;
      pen.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${PENCIL_SCALE}) rotate(${angle.toFixed(2)}deg)`;
    };
    pen.style.transformOrigin = `${PIVOT.x}px ${PIVOT.y}px`;
    const ease = (t: number) => t * t * (3 - 2 * t);

    let frame = 0;
    let begun = 0;
    const tick = (now: number) => {
      if (!begun) begun = now;
      let t = (now - begun) / 1000 - delay;
      if (t < 0) {
        frame = requestAnimationFrame(tick);
        return;
      }
      const wobble = 2.2 * Math.sin(t * 7.3) + 1.2 * Math.sin(t * 13.1);
      for (const step of steps) {
        const to = STROKES[step.stroke][0];
        if (t < step.lift) {
          // Pen in the air, travelling to the next stroke's start; the first lift brings it in.
          const from = step.stroke === 0 ? [to[0] + 90, to[1] - 120] : STROKES[step.stroke - 1].at(-1)!;
          const k = ease(t / step.lift);
          const x = from[0] + (to[0] - from[0]) * k;
          const y = from[1] + (to[1] - from[1]) * k;
          place(x, y, Math.sin(Math.PI * k) * 10, step.stroke === 0 ? k : 1, wobble);
          frame = requestAnimationFrame(tick);
          return;
        }
        t -= step.lift;
        const path = strokes[step.stroke]!;
        const length = lengths[step.stroke];
        if (t < step.draw) {
          // A touch slower into and out of each stroke, as a hand is.
          const k = 0.75 * (t / step.draw) + 0.25 * ease(t / step.draw);
          const drawn = k * length;
          path.style.strokeDashoffset = `${length - drawn}`;
          path.style.visibility = "visible";
          const point = path.getPointAtLength(drawn);
          place(point.x, point.y, 0, 1, wobble);
          frame = requestAnimationFrame(tick);
          return;
        }
        path.style.strokeDashoffset = "0";
        path.style.visibility = "visible";
        t -= step.draw;
      }
      if (t < settle) {
        // Done: the pencil lifts off the page and fades.
        const last = STROKES.at(-1)!.at(-1)!;
        const k = ease(t / settle);
        place(last[0] + 40 * k, last[1] - 60 * k, 14 * k, 1 - k, wobble);
        frame = requestAnimationFrame(tick);
        return;
      }
      setWriting(false);
    };
    frame = requestAnimationFrame(tick);
    // Hold a safety net in case frames stop (a hidden tab), so the name is never left half written.
    const fallback = window.setTimeout(() => setWriting(false), (total + delay + 4) * 1000);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(fallback);
      setSigning(false);
    };
  }, [writing, setSigning]);

  return (
    <span className="relative block w-[min(100%,280px)] sm:w-[360px]">
      <span
        ref={(node) => {
          boxRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        aria-hidden
        className={`signature-ink relative -ml-1 block aspect-[1120/244] ${writing ? "is-writing" : ""}`}
        style={{ WebkitMaskImage: `url(${signature})`, maskImage: `url(${signature})` }}
      >
        {writing ? (
          <svg viewBox={`0 0 ${VIEW.width} ${VIEW.height}`} className="absolute inset-0 h-full w-full overflow-visible">
            {PATHS.map((d, index) => (
              <path
                key={index}
                ref={(node) => (strokeRefs.current[index] = node)}
                d={d}
                fill="none"
                stroke="var(--ink)"
                strokeWidth={32}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ visibility: "hidden" }}
              />
            ))}
          </svg>
        ) : null}
      </span>
      {writing ? (
        <span ref={penRef} aria-hidden className="pointer-events-none absolute left-0 top-0 -ml-1 opacity-0">
          <Pencil />
        </span>
      ) : null}
    </span>
  );
});

export default Signature;
