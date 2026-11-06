export type TableColours = { planks: string[]; grain: string; seam: string };
type Knot = { x: number; y: number; rx: number; ry: number };

function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A grain line's height at `x`: a long lazy wave, pushed aside wherever a knot is in its way. */
function grainY(x: number, start: number, phase: number, knots: Knot[]) {
  let y = start + 5 * Math.sin(x * 0.0042 + phase + start * 0.01) + 2.4 * Math.sin(x * 0.013 + phase * 2);
  for (const knot of knots) {
    const along = (x - knot.x) / knot.rx;
    const across = start - knot.y;
    y += (across < 0 ? -1 : 1) * knot.ry * 1.5 * Math.exp(-along * along) * Math.exp(-Math.abs(across) / (knot.ry * 2.4));
  }
  return y;
}

function drawKnot(context: CanvasRenderingContext2D, knot: Knot, random: () => number) {
  for (let ring = 0; ring < 4; ring++) {
    const size = 0.3 + ring * 0.24;
    const phase = random() * 6;
    context.lineWidth = ring ? 0.9 : 1.3;
    context.beginPath();
    for (let step = 0; step <= 30; step++) {
      const angle = (step / 30) * Math.PI * 2;
      const wobble = 1 + 0.09 * Math.sin(angle * 3 + phase) + 0.05 * Math.sin(angle * 7 + phase * 2);
      const x = knot.x + Math.cos(angle) * knot.rx * 0.34 * size * wobble;
      const y = knot.y + Math.sin(angle) * knot.ry * 1.25 * size * wobble;
      if (step) context.lineTo(x, y);
      else context.moveTo(x, y);
    }
    context.stroke();
  }
}

/**
 * The table the sheet is left on, drawn the way the site's other marks are: flat colour with loose ink
 * lines over it. Each plank's grain is one set of long wavering strokes, lifted now and then as a pen
 * is, that part around the knots. It is seeded, so it is the same table on every visit.
 */
export function drawTable(canvas: HTMLCanvasElement, width: number, height: number, density: number, colours: TableColours) {
  canvas.width = Math.round(width * density);
  canvas.height = Math.round(height * density);
  const context = canvas.getContext("2d");
  if (!context) return;
  context.scale(density, density);
  context.lineCap = "round";
  context.lineJoin = "round";
  context.strokeStyle = colours.grain;

  const random = seeded(19);
  const count = Math.max(3, Math.round(height / 215));
  const plank = height / count;
  for (let index = 0; index < count; index++) {
    const top = index * plank;
    context.save();
    context.beginPath();
    context.rect(0, top, width, plank);
    context.clip();
    context.fillStyle = colours.planks[index % colours.planks.length];
    context.fillRect(0, top, width, plank);

    // Knots keep to the sides, clear of the sheet and the note beside it.
    const side = index % 2 ? 0.76 + random() * 0.16 : 0.07 + random() * 0.17;
    const knots: Knot[] = [{ x: width * side, y: top + plank * (0.32 + random() * 0.36), rx: 62 + random() * 26, ry: 11 + random() * 6 }];
    const phase = random() * 6;
    for (let start = top - plank * 0.3; start < top + plank * 1.3; start += 5.5 + random() * 6.5) {
      const linePhase = phase + random() * 0.5;
      let x = -20 - random() * 200;
      while (x < width + 20) {
        const end = x + 100 + random() * 340;
        context.globalAlpha = 0.38 + random() * 0.62;
        context.lineWidth = 0.55 + random() * 0.8;
        context.beginPath();
        context.moveTo(x, grainY(x, start, linePhase, knots));
        for (let at = x + 14; at < end; at += 14) context.lineTo(at, grainY(at, start, linePhase, knots) + (random() - 0.5) * 0.7);
        context.stroke();
        x = end + random() * random() * 46;
      }
    }
    context.globalAlpha = 0.9;
    for (const knot of knots) drawKnot(context, knot, random);
    context.restore();

    if (index) {
      // The join between two planks, gone over twice.
      context.globalAlpha = 1;
      context.strokeStyle = colours.seam;
      for (const [offset, lineWidth] of [
        [0, 1.7],
        [1.2, 0.7],
      ]) {
        context.lineWidth = lineWidth;
        context.beginPath();
        for (let x = -10; x < width + 14; x += 16) {
          const y = top + offset + 0.9 * Math.sin(x * 0.011 + index * 2) + (random() - 0.5) * 0.7;
          if (x < 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.stroke();
      }
      context.strokeStyle = colours.grain;
    }
  }
}
