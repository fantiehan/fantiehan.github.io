import { useState } from "react";
import PosterPlate from "@/components/PosterPlate";
import { scholarUrl } from "@/utils/publication";
import type { Publication } from "@/content/types";
import { cn } from "@/lib/utils";

type Props = {
  item: Publication;
  className?: string;
};

const SELF = "Tiehan Fan";

/** Author list with the site owner's name set in full ink. */
export function Authors({ authors, className }: { authors: string; className?: string }) {
  const parts = authors.split(SELF);
  return (
    <p className={cn("text-[var(--ink-soft)]", className)}>
      {parts.map((part, index) => (
        <span key={index}>
          {part}
          {index < parts.length - 1 ? <span className="font-semibold text-[var(--ink)]">{SELF}</span> : null}
        </span>
      ))}
    </p>
  );
}

/** Venue line: a swatch of the poster's ink, then venue, year and role. */
export function VenueLine({ item, className }: { item: Publication; className?: string }) {
  return (
    <p className={cn("flex items-center gap-2 font-type text-[14px] leading-5 text-[var(--ink-soft)]", className)}>
      <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: item.poster.accent }} />
      <span>
        {item.venue} {item.year}
        {item.contributionTag ? <span className="text-[var(--ink)]">, {item.contributionTag.toLowerCase()}</span> : null}
      </span>
    </p>
  );
}

/**
 * A print on the shelf with a caption that is always visible. The card spans two rows of the
 * parent grid (print, caption) so every print in a row stands on the same line.
 * Hovering anywhere on the card, or tapping the plate on touch screens, reveals the main figure.
 */
export default function PublicationCard({ item, className }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className={cn("publication-plate row-span-2 grid grid-rows-subgrid gap-y-0", className)}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <PosterPlate item={item} hovered={hovered} ledge className="self-end" />

      <div className="flex flex-1 flex-col pt-4">
        <VenueLine item={item} />
        <h3 className="mt-2 text-pretty text-[19px] font-medium leading-[1.3] text-[var(--ink)]">{item.title}</h3>
        <Authors authors={item.authors} className="mt-2 text-[15px] leading-[1.5]" />

        <div className="link-list mt-auto flex flex-wrap items-center gap-x-5 gap-y-1 pt-3 text-[16px]">
          {item.paperUrl ? (
            <a className="ink-link" href={item.paperUrl} target="_blank" rel="noreferrer">
              Paper
            </a>
          ) : null}
          <a className="ink-link" href={scholarUrl(item)} target="_blank" rel="noreferrer">
            Scholar
          </a>
        </div>
        {/* The plate note reads last and carries no link, so it never competes with the citation. */}
        <p className="mt-3 text-[15px] italic leading-[1.45] text-[var(--ink-soft)] sm:min-h-[2.9em]">{item.poster.concept}</p>
      </div>
    </article>
  );
}
