import { useEffect, useRef } from "react";
import { BODY, LEFT_ANTENNA, LEFT_VEIN, LEFT_WING, RIGHT_ANTENNA, RIGHT_VEIN, RIGHT_WING } from "@/lib/butterfly";
import { useMasthead } from "@/store/masthead";

const SIZE = 32;
const DURATION = 2800;
const smoothstep = (from: number, to: number, value: number) => {
  const t = Math.min(1, Math.max(0, (value - from) / (to - from)));
  return t * t * (3 - 2 * t);
};

/**
 * The butterfly the pencil drew at the foot of the page, flying home to the mark in the nav. `from`
 * is where it was drawn, in viewport coordinates. The mark is left empty while it is away.
 */
export default function ButterflyFlight({ from, onDone }: { from: { x: number; y: number }; onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const leftRef = useRef<SVGGElement>(null);
  const rightRef = useRef<SVGGElement>(null);
  const setButterflyAway = useMasthead((state) => state.setButterflyAway);

  useEffect(() => {
    const node = ref.current;
    const left = leftRef.current;
    const right = rightRef.current;
    const home = document.querySelector("[data-butterfly-home]")?.getBoundingClientRect();
    if (!node || !left || !right || !home) {
      onDone();
      return;
    }
    setButterflyAway(true);

    const start = { x: from.x + SIZE / 2, y: from.y + SIZE / 2 };
    const end = { x: home.left + home.width / 2, y: home.top + home.height / 2 };
    const scaleEnd = home.width / SIZE;
    // Up off the line first, then a long drift in to the mark from below and to the right.
    const c1 = { x: start.x - 70, y: start.y - 260 };
    const c2 = { x: end.x + 300, y: end.y + 190 };
    const bezier = (t: number, a: number, b: number, c: number, d: number) => {
      const u = 1 - t;
      return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
    };
    const position = (t: number) => ({ x: bezier(t, start.x, c1.x, c2.x, end.x), y: bezier(t, start.y, c1.y, c2.y, end.y) });

    let frame = 0;
    let begun = 0;
    let last = 0;
    let beat = 0;
    const tick = (now: number) => {
      if (!begun) begun = last = now;
      const elapsed = now - begun;
      const raw = Math.min(1, elapsed / DURATION);
      // Ease out of the take-off and into the landing, sine-shaped.
      const t = 0.5 - 0.5 * Math.cos(Math.PI * raw);
      const air = Math.sin(Math.PI * raw);
      const point = position(t);
      const ahead = position(Math.min(1, t + 0.01));
      // Never a straight line: it wanders off the curve and bobs with each beat of its wings.
      const wander = 34 * air * Math.sin(raw * Math.PI * 3.4);
      const length = Math.hypot(ahead.x - point.x, ahead.y - point.y) || 1;
      const normal = { x: -(ahead.y - point.y) / length, y: (ahead.x - point.x) / length };
      // The wings beat fast in the air and slow to a stop as it settles.
      beat += ((now - last) / 1000) * (19 - 12 * smoothstep(0.7, 1, raw));
      last = now;
      const bob = 3.5 * air * Math.sin(beat);
      const x = point.x + normal.x * wander;
      const y = point.y + normal.y * wander + bob;
      const flap = 0.3 + 0.7 * Math.abs(Math.cos(beat));
      const wings = flap + (1 - flap) * smoothstep(0.88, 1, raw);
      const heading = (Math.atan2(ahead.x - point.x, point.y - ahead.y) * 180) / Math.PI;
      const tilt = Math.max(-55, Math.min(55, heading)) * Math.min(1, air * 2.2);
      const scale = 1 + (scaleEnd - 1) * raw;
      node.style.transform = `translate(${(x - SIZE / 2).toFixed(2)}px, ${(y - SIZE / 2).toFixed(2)}px) rotate(${tilt.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      left.style.transform = right.style.transform = `scaleX(${wings.toFixed(3)})`;
      if (raw < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }
      setButterflyAway(false);
      onDone();
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      setButterflyAway(false);
    };
    // A flight runs once from where it started; a change of page does not disturb it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-50 text-[var(--ink)]"
      style={{ width: SIZE, height: SIZE, transform: `translate(${from.x}px, ${from.y}px)` }}
    >
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="block overflow-visible">
        <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <g ref={leftRef} style={{ transformOrigin: "16px 16px" }}>
            <path fill="var(--paper)" strokeWidth={1.6} d={LEFT_WING} />
            <path fill="none" stroke="var(--accent)" strokeWidth={1.3} d={LEFT_VEIN} />
          </g>
          <g ref={rightRef} style={{ transformOrigin: "16px 16px" }}>
            <path fill="var(--paper)" strokeWidth={1.6} d={RIGHT_WING} />
            <path fill="none" stroke="var(--accent)" strokeWidth={1.3} d={RIGHT_VEIN} />
          </g>
          <path fill="none" strokeWidth={2} d={BODY} />
          <path fill="none" strokeWidth={1.1} d={`${LEFT_ANTENNA} ${RIGHT_ANTENNA}`} />
        </g>
      </svg>
    </div>
  );
}
