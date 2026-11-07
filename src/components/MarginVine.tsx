import { useEffect, useId, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { BODY, LEFT_ANTENNA, LEFT_VEIN, LEFT_WING, RIGHT_ANTENNA, RIGHT_VEIN, RIGHT_WING } from "@/lib/butterfly";

const SVG = "http://www.w3.org/2000/svg";
/** The text column's width (`.note-layout`); anything further right is a sidenote or a wide figure. */
const COLUMN = 640;
/** Where the stem runs, left of the text, and how far apart its nodes sit along it. */
const STEM_X = -17;
const NODE_GAP = 31;
const SAMPLE = 6;
/** Nodes fold this far ahead of a stem drawing back, so they close before it reaches them. */
const FOLD_AHEAD = 34;
/**
 * On narrow screens the margin is only 20px, so the plant is drawn smaller and closer in, and nothing
 * flies off it: on a phone a selection is usually for copying, with the system's own menu beside it.
 */
const COMPACT_SCALE = 0.56;
const COMPACT_X = -9;
/** How far past the selection a plant is laid out, so it can follow a growing selection without a new one. */
const AHEAD = 160;
/** Insects: how many may be in the air, and the least time between two taking off, in seconds. */
const MAX_INSECTS = 3;
const INSECT_GAP = 0.9;

type Bud = {
  group: SVGGElement;
  petals: SVGPathElement[];
  heart: SVGCircleElement;
  /** Where its head sits relative to the group, which is itself scaled open when it has a stalk. */
  head: { x: number; y: number };
};
type Node = {
  at: number;
  x: number;
  y: number;
  open: number;
  scale: number;
  group: SVGGElement;
  bud: Bud | null;
  flown: boolean;
};
type Plant = {
  group: SVGGElement;
  stem: SVGPathElement;
  fibre: SVGPathElement;
  samples: { x: number; y: number; length: number }[];
  origin: number;
  direction: 1 | -1;
  total: number;
  drawn: number;
  painted: number;
  target: number;
  nodes: Node[];
  tip: Bud;
  tipOpen: number;
  tipFlown: boolean;
  still: number;
  retiring: boolean;
  /** The plant's size against the page; its own drawing is always full size. */
  scale: number;
};
type Insect = {
  group: SVGGElement;
  wings: SVGGElement[];
  kind: "butterfly" | "bee";
  x: number;
  y: number;
  drift: number;
  rise: number;
  life: number;
  age: number;
  phase: number;
};

const hash = (value: number) => {
  const x = Math.sin(value * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};
/** Opens past full size and settles back, as a leaf or petal turning out would. */
const settle = (t: number) => {
  const a = t - 1;
  return 1 + 2.1 * a * a * a + 1.1 * a * a;
};
const wobble = (offset: number, seed: number) =>
  STEM_X + 1.5 * Math.sin(offset * 0.024 + seed) + 0.9 * Math.sin(offset * 0.061 + seed * 2.1);

function element<K extends keyof SVGElementTagNameMap>(name: K, attributes: Record<string, string> = {}, parent?: SVGElement) {
  const node = document.createElementNS(SVG, name);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
  parent?.append(node);
  return node;
}

/** A small leaf drawn from its stalk outwards, never quite the same shape twice. */
function leafPaths(side: number, direction: number, seed: number, size: number) {
  const length = (9 + hash(seed) * 3.5) * size;
  const tipX = side * length;
  const tipY = direction * length * (0.45 + hash(seed + 1) * 0.3);
  const lift = direction * length * 0.46;
  return {
    outline: `M 0 0 Q ${(tipX * 0.25).toFixed(2)} ${(tipY + lift * 0.45).toFixed(2)}, ${tipX.toFixed(2)} ${tipY.toFixed(2)} Q ${(tipX * 0.68).toFixed(2)} ${(tipY - lift).toFixed(2)}, 0 0 Z`,
    rib: `M 0 0 Q ${(tipX * 0.45).toFixed(2)} ${(tipY * 0.42).toFixed(2)}, ${(tipX * 0.82).toFixed(2)} ${(tipY * 0.84).toFixed(2)}`,
  };
}

/** A five-petalled flower of the kind drawn in a margin: one line round each petal and a round heart. */
function makeBud(parent: SVGElement, seed: number, radius: number, head: { x: number; y: number }): Bud {
  const group = element("g", {}, parent);
  const fill = `var(--petal-${Math.floor(hash(seed) * 4)})`;
  const turn = hash(seed + 2) * 72;
  const petals = Array.from({ length: 5 }, (_, index) => {
    const width = radius * (0.42 + hash(seed + index) * 0.1);
    const reach = radius * (0.94 + hash(seed + index + 9) * 0.16);
    const petal = element("path", { class: "margin-vine-petal", fill, d: `M 0 0 C ${(-width).toFixed(2)} ${(-reach * 0.35).toFixed(2)}, ${(-width).toFixed(2)} ${(-reach).toFixed(2)}, 0 ${(-reach).toFixed(2)} C ${width.toFixed(2)} ${(-reach).toFixed(2)}, ${width.toFixed(2)} ${(-reach * 0.35).toFixed(2)}, 0 0 Z` }, group);
    petal.dataset.angle = `${turn + index * 72 + (hash(seed + index + 4) - 0.5) * 9}`;
    return petal;
  });
  const heart = element("circle", { class: "margin-vine-heart", r: (radius * 0.27).toFixed(2) }, group);
  return { group, petals, heart, head };
}

function paintBud(bud: Bud, open: number) {
  bud.petals.forEach((petal, index) => {
    const size = settle(clamp01((open - index * 0.09) / 0.62));
    petal.setAttribute("transform", `translate(${bud.head.x} ${bud.head.y}) rotate(${petal.dataset.angle}) scale(${size.toFixed(3)})`);
  });
  bud.heart.setAttribute("transform", `translate(${bud.head.x} ${bud.head.y}) scale(${smooth(open * 2.2).toFixed(3)})`);
}

/**
 * The stem as a shape rather than a line: thick at the root, thin at the growing tip, and a little
 * swollen at each node. It is rebuilt from the centre line whenever its length changes.
 */
function paintStem(plant: Plant) {
  const { samples, drawn, nodes } = plant;
  if (drawn < 0.5) {
    plant.stem.setAttribute("d", "");
    plant.fibre.setAttribute("d", "");
    return;
  }
  const line: { x: number; y: number; length: number }[] = [];
  for (let i = 0; i < samples.length; i++) {
    if (samples[i].length < drawn) {
      line.push(samples[i]);
      continue;
    }
    const before = samples[i - 1] ?? samples[i];
    const k = (drawn - before.length) / (samples[i].length - before.length || 1);
    line.push({ x: before.x + (samples[i].x - before.x) * k, y: before.y + (samples[i].y - before.y) * k, length: drawn });
    break;
  }
  if (line.length < 2) return;
  const young = Math.min(1, drawn / 26);
  const left: string[] = [];
  const right: string[] = [];
  const fibre: string[] = [];
  line.forEach((point, index) => {
    const before = line[Math.max(0, index - 1)];
    const after = line[Math.min(line.length - 1, index + 1)];
    const size = Math.hypot(after.x - before.x, after.y - before.y) || 1;
    const nx = -(after.y - before.y) / size;
    const ny = (after.x - before.x) / size;
    const along = point.length / drawn;
    let half = (1.15 + 1.75 * Math.pow(1 - along, 0.8)) * young;
    for (const node of nodes) {
      const off = point.length - node.at;
      if (Math.abs(off) < 7) half += 0.7 * Math.exp(-(off * off) / 12) * young;
    }
    half *= Math.min(1, (drawn - point.length) / 5 + 0.3);
    left.push(`${(point.x + nx * half).toFixed(2)} ${(point.y + ny * half).toFixed(2)}`);
    right.push(`${(point.x - nx * half).toFixed(2)} ${(point.y - ny * half).toFixed(2)}`);
    fibre.push(`${(point.x + nx * half * 0.3).toFixed(2)} ${(point.y + ny * half * 0.3).toFixed(2)}`);
  });
  plant.stem.setAttribute("d", `M ${left.join(" L ")} L ${right.reverse().join(" L ")} Z`);
  plant.fibre.setAttribute("d", `M ${fibre.join(" L ")}`);
}

function makeInsect(parent: SVGElement, kind: Insect["kind"]) {
  const group = element("g", {}, parent);
  const wings: SVGGElement[] = [];
  if (kind === "butterfly") {
    const body = element("g", { transform: "scale(0.48) translate(-16 -16)" }, group);
    for (const [wing, vein] of [
      [LEFT_WING, LEFT_VEIN],
      [RIGHT_WING, RIGHT_VEIN],
    ]) {
      const holder = element("g", {}, body);
      element("path", { d: wing, fill: "var(--paper)", "stroke-width": "1.8" }, holder);
      element("path", { d: vein, fill: "none", style: "stroke:var(--accent)", "stroke-width": "1.5" }, holder);
      wings.push(holder);
    }
    element("path", { d: BODY, fill: "none", "stroke-width": "2.4" }, body);
    element("path", { d: `${LEFT_ANTENNA} ${RIGHT_ANTENNA}`, fill: "none", "stroke-width": "1.3" }, body);
  } else {
    // A bee side-on, flying left: two wings over a striped body.
    for (const [x, tilt] of [
      [1.2, -24],
      [-1.2, 18],
    ]) {
      const holder = element("g", {}, group);
      element("ellipse", { cx: `${x}`, cy: "-4.2", rx: "2.1", ry: "3.5", fill: "var(--paper)", "stroke-width": "0.75", transform: `rotate(${tilt} ${x} -1.5)` }, holder);
      wings.push(holder);
    }
    element("ellipse", { rx: "4.3", ry: "2.8", style: "fill:var(--petal-heart)", "stroke-width": "0.85" }, group);
    element("path", { d: "M -1.1 -2.7 Q -0.4 0 -1.1 2.7 M 1.3 -2.6 Q 2 0 1.3 2.6", fill: "none", "stroke-width": "1" }, group);
    element("circle", { cx: "-4.6", cy: "-0.4", r: "1.5", style: "fill:var(--ink)", "stroke-width": "0.5" }, group);
  }
  return { group, wings };
}

/**
 * A pencil vine in the left margin that follows a text selection in a note: one stem beside the
 * selected lines, with a leaf or a small flower at each line. On wide screens a butterfly or a bee
 * now and then leaves an open flower and is gone. When the selection goes the plant grows backwards, petals and leaves
 * folding and the stem drawing in. The way it follows the selection and un-grows comes from LeiBox's
 * Selection Flower (https://leibox.pantoria.cn/docs/animations/selection-flower, design reference by
 * Omerico: https://x.com/omer_assa/status/2083862523640496179/video/1); the drawing here is its own.
 */
export default function MarginVine() {
  const ref = useRef<SVGSVGElement>(null);
  const reduceMotion = useReducedMotion();
  const filterId = `vine-rough${useId().replace(/:/g, "")}`;

  useEffect(() => {
    const svg = ref.current;
    const host = svg?.parentElement;
    if (!svg || !host) return;
    const compact = window.matchMedia("(max-width: 1099px)");
    const plants: Plant[] = [];
    const insects: Insect[] = [];
    let current: Plant | null = null;
    let frame = 0;
    let pending = 0;
    let last = 0;
    let clock = 0;
    let lastFlight = -Infinity;
    let flights = 0;

    /** A plant is laid out only as far as it is needed, never the whole length of the page. */
    const plant = (origin: number, direction: 1 | -1, needed: number): Plant => {
      const scale = compact.matches ? COMPACT_SCALE : 1;
      const room = direction > 0 ? host.getBoundingClientRect().height - origin : origin;
      const reach = Math.min(room, needed + AHEAD) / scale;
      const seed = origin * 0.37;
      const samples: Plant["samples"] = [];
      let total = 0;
      for (let offset = 0; offset <= reach + SAMPLE; offset += SAMPLE) {
        const point = { x: wobble(offset, seed), y: origin + direction * offset };
        const previous = samples[samples.length - 1];
        if (previous) total += Math.hypot(point.x - previous.x, point.y - previous.y);
        samples.push({ ...point, length: total });
      }
      // The pencil roughness is only on wide screens; phones repaint filtered drawings too slowly.
      const group = element("g", scale === 1 ? { filter: `url(#${filterId})` } : {}, svg);
      group.dataset.plant = "";
      // Smaller about the point where it starts, so its root stays beside the first selected line.
      if (scale !== 1) group.setAttribute("transform", `translate(${COMPACT_X} ${origin}) scale(${scale}) translate(${-STEM_X} ${-origin})`);
      const nodesLayer = element("g", {}, group);
      const stem = element("path", { class: "margin-vine-stem" }, group);
      const fibre = element("path", { class: "margin-vine-fibre" }, group);

      const nodes: Node[] = [];
      for (let at = 15, index = 0; at < total; at += NODE_GAP, index++) {
        const sample = samples[Math.min(samples.length - 1, Math.round(at / SAMPLE))];
        const nodeSeed = seed + index * 7.3;
        const holder = element("g", { transform: `translate(${sample.x.toFixed(2)} ${sample.y.toFixed(2)}) scale(0)` }, nodesLayer);
        let bud: Bud | null = null;
        if (index % 3 === 2) {
          // Flowers always lean out into the margin, away from the text.
          const head = { x: -9 - hash(nodeSeed) * 2.5, y: -direction * (3 + hash(nodeSeed + 1) * 2.5) };
          element("path", { class: "margin-vine-stalk", d: `M 0 0 Q ${(head.x * 0.55).toFixed(2)} ${(head.y * 0.12).toFixed(2)}, ${head.x.toFixed(2)} ${head.y.toFixed(2)}` }, holder);
          bud = makeBud(holder, nodeSeed, 4.8 + hash(nodeSeed + 3) * 1.2, head);
        } else {
          const side = (index % 2 ? 1 : -1) * (hash(seed) > 0.5 ? 1 : -1);
          // There is less room on the side towards the text.
          const { outline, rib } = leafPaths(side, direction, nodeSeed, side > 0 ? 0.78 : 1);
          element("path", { class: "margin-vine-leaf", d: outline }, holder);
          element("path", { class: "margin-vine-rib", d: rib }, holder);
        }
        nodes.push({ at, x: sample.x, y: sample.y, open: 0, scale: -1, group: holder, bud, flown: false });
      }
      const tip = makeBud(group, seed + 40, 5.4, { x: 0, y: 0 });
      paintBud(tip, 0);
      const made: Plant = { group, stem, fibre, samples, origin, direction, total, drawn: 0, painted: -1, target: 0, nodes, tip, tipOpen: 0, tipFlown: false, still: 0, retiring: false, scale };
      plants.push(made);
      return made;
    };

    const retire = (target: Plant | null) => {
      if (target) target.retiring = true;
    };

    /** Every other flower to open sends something up, and never too many at once. */
    const release = (x: number, y: number) => {
      if (reduceMotion || compact.matches || insects.length >= MAX_INSECTS || clock - lastFlight < INSECT_GAP) return;
      flights++;
      if (flights % 2 === 0) return;
      lastFlight = clock;
      const kind = flights % 4 === 1 ? "butterfly" : "bee";
      const room = Math.max(0, host.getBoundingClientRect().left - 24);
      const { group, wings } = makeInsect(svg, kind);
      insects.push({
        group,
        wings,
        kind,
        x,
        y,
        drift: Math.min(room + x, 34 + Math.random() * 90),
        rise: 90 + Math.random() * 70,
        life: 1.7 + Math.random() * 0.7,
        age: 0,
        phase: Math.random() * 6,
      });
    };

    const flyInsects = (dt: number) => {
      for (const insect of [...insects]) {
        insect.age += dt;
        const k = insect.age / insect.life;
        if (k >= 1) {
          insect.group.remove();
          insects.splice(insects.indexOf(insect), 1);
          continue;
        }
        const beat = insect.age * (insect.kind === "bee" ? 44 : 17) + insect.phase;
        const wander = 11 * Math.sin(insect.age * 3.1 + insect.phase) * Math.min(1, k * 4);
        const bob = (insect.kind === "bee" ? 1.4 : 3.2) * Math.sin(beat * 0.5);
        const x = insect.x - insect.drift * smooth(k) + wander;
        const y = insect.y - insect.rise * (k * (0.55 + 0.45 * k)) + bob;
        const tilt = insect.kind === "bee" ? 8 * Math.sin(insect.age * 3.1 + insect.phase) : -16 + 12 * Math.sin(insect.age * 2.3 + insect.phase);
        insect.group.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${tilt.toFixed(1)})`);
        insect.group.setAttribute("opacity", `${(Math.min(1, k * 9) * (1 - smooth((k - 0.6) / 0.4))).toFixed(3)}`);
        const flap = 0.28 + 0.72 * Math.abs(Math.cos(beat));
        for (const wing of insect.wings) {
          wing.setAttribute(
            "transform",
            insect.kind === "bee" ? `translate(0 -1.5) scale(1 ${flap.toFixed(3)}) translate(0 1.5)` : `translate(16 0) scale(${flap.toFixed(3)} 1) translate(-16 0)`,
          );
        }
      }
    };

    const tick = (now: number) => {
      frame = 0;
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60);
      last = now;
      clock += dt;
      let moving = false;
      for (const item of [...plants]) {
        // Going away, the flower at the tip closes first and only then does the stem draw in.
        const target = item.retiring ? (item.tipOpen > 0.2 ? item.drawn : 0) : item.target;
        const gap = target - item.drawn;
        const pace = Math.max(item.retiring ? 240 : 300, Math.abs(gap) * 7) * dt;
        item.drawn = reduceMotion ? target : item.drawn + Math.sign(gap) * Math.min(Math.abs(gap), pace);
        item.still = item.drawn === target ? item.still + dt : 0;
        if (item.drawn !== item.painted) {
          paintStem(item);
          item.painted = item.drawn;
        }

        let folding = false;
        for (const node of item.nodes) {
          const wanted = item.drawn >= node.at + (item.retiring ? FOLD_AHEAD : 6);
          const speed = node.bud ? (wanted ? 2.7 : -5.5) : wanted ? 5 : -7.5;
          const open = reduceMotion ? (wanted ? 1 : 0) : clamp01(node.open + speed * dt);
          if (open !== (wanted ? 1 : 0)) folding = true;
          if (open !== node.open || node.scale < 0) {
            node.open = open;
            const scale = node.bud ? smooth(open * 2.4) : open && settle(open);
            node.scale = scale;
            node.group.setAttribute("transform", `translate(${node.x.toFixed(2)} ${node.y.toFixed(2)}) scale(${scale.toFixed(3)})`);
            if (node.bud) paintBud(node.bud, open);
          }
          if (node.bud && open === 1 && !node.flown) {
            node.flown = true;
            release(node.x + node.bud.head.x, node.y + node.bud.head.y);
          }
          if (!wanted) node.flown = false;
        }

        // The flower at the growing tip waits until the stem has stopped.
        const tipWanted = !item.retiring && item.drawn > 8 && item.still > 0.18;
        const tipSpeed = tipWanted ? 2.7 : -6.5;
        const tipOpen = reduceMotion ? (tipWanted ? 1 : 0) : clamp01(item.tipOpen + tipSpeed * dt);
        const end = item.samples[Math.min(item.samples.length - 1, Math.round(item.drawn / SAMPLE))];
        item.tip.group.setAttribute("transform", `translate(${end.x.toFixed(2)} ${end.y.toFixed(2)})`);
        if (tipOpen !== item.tipOpen) {
          item.tipOpen = tipOpen;
          paintBud(item.tip, tipOpen);
        }
        if (tipOpen === 1 && !item.tipFlown) {
          item.tipFlown = true;
          release(end.x, end.y);
        }
        if (tipOpen === 0) item.tipFlown = false;

        const settled = item.drawn === target && !folding && tipOpen === (tipWanted ? 1 : 0);
        if (item.retiring && item.drawn === 0 && settled) {
          item.group.remove();
          plants.splice(plants.indexOf(item), 1);
        } else if (!settled || item.still <= 0.18) {
          moving = true;
        }
      }
      flyInsects(dt);
      if (moving || insects.length) frame = requestAnimationFrame(tick);
      else last = 0;
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    /** The part of the current selection that lies in the text column, in the host's coordinates. */
    const measure = () => {
      const selection = document.getSelection();
      if (!selection?.rangeCount || selection.isCollapsed) return null;
      const range = selection.getRangeAt(0);
      if (!range.intersectsNode(host)) return null;
      const box = host.getBoundingClientRect();
      let top = Infinity;
      let bottom = -Infinity;
      for (const rect of range.getClientRects()) {
        if (!rect.width || !rect.height) continue;
        if (rect.left >= box.left + COLUMN - 1 || rect.right <= box.left) continue;
        if (rect.bottom <= box.top || rect.top >= box.bottom) continue;
        top = Math.min(top, Math.max(rect.top, box.top));
        bottom = Math.max(bottom, Math.min(rect.bottom, box.bottom));
      }
      if (top === Infinity) return null;
      const backward =
        selection.anchorNode === selection.focusNode
          ? selection.anchorOffset > selection.focusOffset
          : Boolean(selection.anchorNode && selection.focusNode && selection.anchorNode.compareDocumentPosition(selection.focusNode) & Node.DOCUMENT_POSITION_PRECEDING);
      return { top: top - box.top, bottom: bottom - box.top, backward };
    };

    const update = () => {
      pending = 0;
      const span = measure();
      if (!span) {
        retire(current);
        current = null;
        wake();
        return;
      }
      const direction = span.backward ? -1 : 1;
      const origin = span.backward ? span.bottom : span.top;
      const scale = compact.matches ? COMPACT_SCALE : 1;
      const needed = (span.bottom - span.top) * 1.01;
      if (
        !current ||
        current.direction !== direction ||
        current.scale !== scale ||
        Math.abs(current.origin - origin) > 3 ||
        needed / current.scale > current.total
      ) {
        retire(current);
        current = plant(origin, direction, needed);
      }
      current.target = Math.min(current.total, needed / current.scale);
      wake();
    };
    const schedule = () => {
      if (!pending) pending = requestAnimationFrame(update);
    };

    document.addEventListener("selectionchange", schedule);
    window.addEventListener("resize", schedule);
    return () => {
      document.removeEventListener("selectionchange", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pending);
      for (const item of plants) item.group.remove();
      for (const insect of insects) insect.group.remove();
    };
  }, [reduceMotion, filterId]);

  return (
    <svg ref={ref} aria-hidden className="margin-vine" width={1} height={1}>
      <defs>
        {/* The same slight unevenness as the pencil, so no outline is quite clean. */}
        <filter id={filterId} x="-60%" y="-10%" width="220%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves={2} seed={8} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={1} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}
