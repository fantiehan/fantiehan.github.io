/** Pencil geometry in its own 16×44 box: graphite tip, eraser end, and the pivot it turns about. */
export const TIP = { x: 8.1, y: 43 };
export const ERASER = { x: 8, y: 1.3 };
export const PIVOT = { x: 8, y: 22 };

/** Rotate a pencil-local point about the pivot by `deg` degrees (screen coordinates, y down). */
export function turn(point: { x: number; y: number }, deg: number) {
  const r = (deg * Math.PI) / 180;
  const dx = point.x - PIVOT.x;
  const dy = point.y - PIVOT.y;
  return { x: PIVOT.x + dx * Math.cos(r) - dy * Math.sin(r), y: PIVOT.y + dx * Math.sin(r) + dy * Math.cos(r) };
}

/** Catmull-Rom through the points, written as cubic Béziers. */
export function smoothPath(points: [number, number][]) {
  let d = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [p0, p1, p2, p3] = [points[i - 1] ?? points[i], points[i], points[i + 1], points[i + 2] ?? points[i + 1]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(2)} ${c1[1].toFixed(2)}, ${c2[0].toFixed(2)} ${c2[1].toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return d;
}
