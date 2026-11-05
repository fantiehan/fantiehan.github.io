import { useId } from "react";

/**
 * The pencil, drawn the way the rest of the site's marks are: loose, slightly uneven ink outlines
 * with flat fills, roughened by a small displacement so no edge is ruler-straight.
 */
export default function Pencil() {
  // Each pencil needs its own filter id; two can be on screen at once.
  const id = `pencil-rough${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 16 44" width={16} height={44} className="block overflow-visible">
      <defs>
        <filter id={id} x="-20%" y="-10%" width="140%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={1.1} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter={`url(#${id})`} stroke="var(--ink)" strokeWidth={1.35} strokeLinecap="round" strokeLinejoin="round">
        {/* Eraser */}
        <path d="M4.6 5.3 C4.3 3.3 5.1 1.5 8.1 1.3 C11.1 1.4 11.7 3.3 11.4 5.2 Z" fill="#dba292" />
        {/* Ferrule, with two crimp lines */}
        <path d="M4.4 5.3 C6.8 5.1 9.2 5.3 11.5 5.1 L11.7 8.5 C9.3 8.7 6.8 8.4 4.3 8.7 Z" fill="var(--paper)" />
        <path d="M4.6 6.9 C7 6.7 9.1 7 11.4 6.8" fill="none" strokeWidth={0.8} />
        {/* Body: one flat ochre fill, a facet line a little off centre */}
        <path d="M4.3 8.7 C4.6 15.2 4.1 24 4.5 31.3 L11.8 31 C11.4 24.1 11.9 15.3 11.7 8.5 Z" fill="#e3c879" />
        <path d="M8.6 9.4 C8.3 16.2 8.9 23.4 8.4 30.4" fill="none" strokeWidth={0.75} opacity={0.7} />
        {/* Sharpened wood with its scalloped edge */}
        <path d="M4.5 31.3 C5.7 33.9 6.6 36.5 7.3 38.7 L8.9 38.6 C9.7 36.4 10.7 33.8 11.8 31 Z" fill="#f1e2bf" />
        <path d="M4.5 31.3 C5.6 32.3 6.7 31.4 8 32.2 C9.3 31.4 10.5 32.3 11.8 31" fill="none" strokeWidth={0.9} />
        {/* Graphite */}
        <path d="M7.3 38.7 C7.6 40.2 7.8 41.7 8.1 43 C8.4 41.6 8.6 40.1 8.9 38.6 Z" fill="var(--ink)" />
      </g>
    </svg>
  );
}
