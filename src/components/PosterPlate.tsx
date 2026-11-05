import { useRef, useState } from "react";
import type { Publication } from "@/content/types";
import { figureUrl } from "@/utils/publication";
import { cn } from "@/lib/utils";

type Props = {
  item: Publication;
  /** Whether a mouse is resting on the surrounding card; drives the hover swap. */
  hovered: boolean;
  compact?: boolean;
  className?: string;
};

const SWIPE_DISTANCE = 36;

/**
 * The paper's poster on a paper mat, with its main figure underneath.
 * Mouse: hovering the card reveals the figure. Touch: tap or swipe the plate to flip,
 * with two dots marking which side is showing. Keyboard: the plate is a toggle button.
 */
export default function PosterPlate({ item, hovered, compact = false, className }: Props) {
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
        "poster-plate relative block aspect-[4/5] w-full touch-pan-y overflow-hidden bg-[var(--paper-deep)] text-left",
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
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity duration-500",
          compact ? "p-2" : "p-5",
          showFigure && "opacity-0",
        )}
      >
        <img
          src={item.poster.imageUrl}
          alt={`${item.poster.shortTitle} poster`}
          className="max-h-full max-w-full object-contain shadow-plate"
          loading="lazy"
        />
      </span>
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-[var(--paper-soft)] transition-opacity duration-500",
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

      {/* Touch screens have no hover, so mark that the plate has a second side. */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 hidden justify-center [@media(hover:none)]:flex",
          compact ? "bottom-1 gap-1" : "bottom-2.5 gap-1.5",
        )}
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
