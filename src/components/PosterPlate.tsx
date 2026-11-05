import { useRef, useState } from "react";
import type { Publication } from "@/content/types";
import { figureUrl } from "@/utils/publication";
import { cn } from "@/lib/utils";

type Props = {
  item: Publication;
  /** Whether a mouse is resting on the surrounding card; drives the hover swap. */
  hovered: boolean;
  compact?: boolean;
  /** Stand the print on a hand-drawn shelf line that joins its neighbours across the row. */
  ledge?: boolean;
  className?: string;
};

const SWIPE_DISTANCE = 36;

/**
 * One segment of the picture ledge. It overhangs the card by half the grid gap on each side and
 * both ends sit at the same height, so neighbouring segments meet as one wobbly line. The shelf
 * container clips the outer overhang so the line ends flush with the content edges.
 */
function Ledge() {
  return (
    <svg aria-hidden viewBox="0 0 300 8" preserveAspectRatio="none" className="-mx-4 block h-2 w-[calc(100%+2rem)] text-[var(--ink)]">
      <path
        d="M0 3 C 40 2, 70 5.5, 110 4 S 190 1.5, 230 3.5 S 280 4.5, 300 3"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * The paper's poster as a bare print, optionally standing on a shared ledge, with its main figure on the back.
 * Mouse: hovering the card reveals the figure. Touch: tap or swipe the plate to flip,
 * with two dots marking which side is showing. Keyboard: the plate is a toggle button.
 */
export default function PosterPlate({ item, hovered, compact = false, ledge = false, className }: Props) {
  const [flipped, setFlipped] = useState(false);
  const pointerType = useRef<string>("mouse");
  const touchStartX = useRef<number | null>(null);
  const swiped = useRef(false);
  const showFigure = flipped || hovered;

  return (
    <button
      type="button"
      aria-pressed={showFigure}
      aria-label={showFigure ? `Show ${item.poster.shortTitle} poster` : `Show ${item.poster.shortTitle} main figure`}
      className={cn(
        "poster-plate flex w-full touch-pan-y flex-col text-left",
        hovered ? "cursor-default" : "cursor-pointer",
        className,
      )}
      onPointerDown={(event) => {
        pointerType.current = event.pointerType;
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0].clientX;
        swiped.current = false;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return;
        const dx = event.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(dx) > SWIPE_DISTANCE) {
          swiped.current = true;
          setFlipped(dx < 0);
        }
      }}
      onClick={() => {
        // Mouse users already see the figure while hovering, so a click there does nothing.
        if (pointerType.current === "mouse") return;
        if (swiped.current) {
          swiped.current = false;
          return;
        }
        setFlipped((value) => !value);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setFlipped((value) => !value);
        }
      }}
    >
      {/* Every print keeps its own proportions at the full column width. */}
      <span className="relative block w-full">
        <img
          src={item.poster.imageUrl}
          alt={`${item.poster.shortTitle} poster`}
          className={cn("block h-auto w-full shadow-print transition-opacity duration-500", showFigure && "opacity-0")}
          loading="lazy"
        />
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-[var(--paper-soft)] shadow-print transition-opacity duration-500",
            compact ? "p-1" : "p-3",
            showFigure ? "opacity-100" : "opacity-0",
          )}
        >
          <img
            src={figureUrl(item)}
            alt={`${item.title} main figure`}
            className="max-h-full max-w-full object-contain xerox-soft"
            loading="lazy"
          />
        </span>
      </span>

      {ledge ? <Ledge /> : null}

      {/* Touch screens have no hover, so mark that the plate has a second side. */}
      <span
        aria-hidden
        className={cn("hidden [@media(hover:none)]:flex", compact ? "mt-1.5 gap-1" : "mt-2.5 gap-1.5")}
      >
        {[false, true].map((side) => (
          <span
            key={String(side)}
            className={cn(
              "rounded-full transition-colors duration-300",
              compact ? "h-1 w-1" : "h-1.5 w-1.5",
              showFigure === side ? "bg-[var(--ink)]" : "bg-[var(--line)]",
            )}
          />
        ))}
      </span>
    </button>
  );
}
