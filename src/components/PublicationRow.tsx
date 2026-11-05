import { useState } from "react";
import type { Publication } from "@/content/types";
import { Authors, VenueLine } from "@/components/PublicationCard";
import PosterPlate from "@/components/PosterPlate";
import { scholarUrl } from "@/utils/publication";

/** Catalogue entry for the full archive: a small plate beside the citation; hover the row to see the main figure. */
export default function PublicationRow({ item }: { item: Publication }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className="publication-row grid grid-cols-[72px_minmax(0,1fr)] gap-5 border-t border-[var(--line)] py-6 first:border-t-0 first:pt-0 sm:grid-cols-[104px_minmax(0,1fr)] sm:gap-7">
      <PosterPlate item={item} hovered={hovered} compact className="self-start" />
      <div className="min-w-0">
        <VenueLine item={item} />
        <h3 className="mt-2 max-w-[60ch] text-pretty text-[20px] font-medium leading-[1.3] text-[var(--ink)]">
          {item.title}
        </h3>
        <Authors authors={item.authors} className="mt-2 max-w-[70ch] text-[16px] leading-[1.55]" />
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[16px]">
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
