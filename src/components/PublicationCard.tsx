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
 * A mounted plate: the paper's poster on a paper mat with a caption that is always visible.
 * Hovering anywhere on the card, or tapping the plate on touch screens, reveals the main figure.
 */
export default function PublicationCard({ item, className }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className={cn("publication-plate flex flex-col", className)}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <PosterPlate item={item} hovered={hovered} />

      <div className="flex flex-1 flex-col pt-4">
        <VenueLine item={item} />
        <h3 className="mt-2 text-pretty text-[19px] font-medium leading-[1.3] text-[var(--ink)]">{item.title}</h3>
        <Authors authors={item.authors} className="mt-2 text-[15px] leading-[1.5]" />

        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-1 pt-3 text-[16px]">
          {item.paperUrl ? (
            <a className="ink-link" href={item.paperUrl} target="_blank" rel="noreferrer">
              Paper
            </a>
          ) : null}
          <a className="ink-link" href={scholarUrl(item)} target="_blank" rel="noreferrer">
            Scholar
          </a>
        </div>
      </div>
    </article>
  );
}
