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
