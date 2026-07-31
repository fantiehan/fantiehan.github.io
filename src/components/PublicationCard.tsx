import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Button from "@/components/Button";
import { placeholderImageUrl } from "@/utils/images";
import type { Publication, PublicationPoster } from "@/content/types";
import { cn } from "@/lib/utils";

type Props = {
  item: Publication;
  className?: string;
};

function PosterMark({ poster }: { poster: PublicationPoster }) {
  if (poster.layout === "lifted-cell") {
    return (
      <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-1.5">
        {Array.from({ length: 9 }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "border border-[var(--line)] bg-[var(--paper)]",
              index === 4 && "-translate-y-2 bg-[var(--paper-accent)] shadow-paper",
            )}
          />
        ))}
      </div>
    );
  }

  if (poster.layout === "motion-thread") {
    return (
      <div className="relative h-full w-full">
        <span className="absolute left-0 top-[34%] h-px w-full bg-[var(--line-strong)]" />
        <span className="absolute left-[8%] top-[50%] h-px w-[84%] bg-[var(--line)]" />
        <span className="absolute left-[12%] top-[42%] h-3 w-[74%] -rotate-6 bg-[var(--paper-accent)]" />
        <span className="absolute right-[8%] top-[30%] h-8 w-8 border border-[var(--line-strong)] bg-[var(--paper)]" />
      </div>
    );
  }

  if (poster.layout === "dataset-grid") {
    return (
      <div className="grid h-full w-full grid-cols-4 grid-rows-5 gap-1">
        {Array.from({ length: 20 }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "border border-[var(--line)] bg-[var(--paper)]",
              [2, 7, 11, 16].includes(index) && "bg-[var(--paper-accent)]",
            )}
          />
        ))}
      </div>
    );
  }

  if (poster.layout === "resolution-window") {
    return (
      <div className="relative h-full w-full">
        <span className="absolute inset-x-[18%] top-[10%] h-[78%] border border-[var(--line-strong)] bg-[var(--paper)]" />
        <span className="absolute inset-x-[7%] top-[24%] h-[48%] bg-[var(--paper-accent)]" />
        <span className="absolute inset-x-[28%] top-[35%] h-[26%] border border-[var(--paper)]" />
      </div>
    );
  }

  if (poster.layout === "alignment-bridge") {
    return (
      <div className="relative h-full w-full">
        <span className="absolute left-[2%] top-[18%] h-[64%] w-[24%] border border-[var(--line-strong)] bg-[var(--paper)]" />
        <span className="absolute right-[2%] top-[18%] h-[64%] w-[24%] border border-[var(--line-strong)] bg-[var(--paper)]" />
        <span className="absolute left-[34%] top-[12%] h-[76%] w-[32%] border border-[var(--paper-accent)] bg-[var(--paper-accent)]" />
        <span className="absolute left-[22%] top-[34%] h-2 w-[56%] bg-[var(--line-strong)]" />
        <span className="absolute left-[22%] top-[58%] h-2 w-[56%] bg-[var(--paper)]" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <span className="absolute left-[8%] top-[12%] h-[76%] w-[72%] rotate-[-3deg] bg-[var(--paper-accent)]" />
      <span className="absolute right-[6%] top-[26%] h-[54%] w-[24%] rotate-[5deg] border border-[var(--line-strong)] bg-[var(--paper)]" />
      <span className="absolute bottom-[12%] left-[18%] h-px w-[62%] bg-[var(--ink)]" />
    </div>
  );
}

export default function PublicationCard({ item, className }: Props) {
  const reduceMotion = useReducedMotion();
  const img = item.screenshotUrl
    ? item.screenshotUrl
    : placeholderImageUrl(
        `aged paper academic figure preview, ${item.screenshotPrompt}, quiet zine archive, matte scan texture`,
        "landscape_16_9",
      );
  const accentStyle = { "--paper-accent": item.poster.accent } as CSSProperties;
  const scholarHref = item.scholarUrl ?? `https://scholar.google.com/scholar?q=${encodeURIComponent(item.title)}`;

  return (
    <motion.article
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.46, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "publication-art-card surface-hairline group relative aspect-[3/5] overflow-hidden border border-[var(--line)] bg-[var(--paper-deep)] text-[var(--ink)] shadow-paper-soft transition duration-300 hover:border-[var(--line-strong)] hover:shadow-paper focus-within:border-[var(--line-strong)]",
        className,
      )}
      style={accentStyle}
    >
      <div className="poster-art-panel paper-grain absolute inset-0 flex flex-col transition duration-700 ease-out group-hover:opacity-0 group-focus-within:opacity-0">
        <div className="relative min-h-0 flex-1 p-4">
          {item.poster.imageUrl ? (
            <img
              src={item.poster.imageUrl}
              alt={`${item.poster.shortTitle} art poster`}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full flex-col">
              <div className="flex justify-between gap-3 font-mono text-[10px] tracking-[0.12em] text-[var(--ink-soft)]">
                <span>{item.poster.archive}</span>
                <span>{item.venue}</span>
              </div>

              <div className="mx-auto my-auto h-[34%] w-[48%]">
                <PosterMark poster={item.poster} />
              </div>

              <div>
                <h3 className="text-[25px] font-semibold leading-[1.02] tracking-[0.01em] text-[var(--ink)]">
                  {item.poster.shortTitle}
                </h3>
                <p className="mt-2 font-mono text-[10px] leading-5 tracking-[0.08em] text-[var(--ink-soft)]">
                  {item.poster.concept}
                </p>
                <p className="mt-3 font-mono text-[10px] leading-5 text-[var(--ink-soft)]">
                  {item.poster.meta}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="poster-catalog-caption border-t border-[var(--line)] bg-[var(--paper-deep)] px-4 py-3">
          <div className="text-[20px] font-semibold leading-6 text-[var(--ink)]">{item.poster.shortTitle}</div>
          <div className="mt-1 text-[12px] leading-5 text-[var(--ink-soft)]">{item.poster.caption}</div>
          <div className="mt-2 font-mono text-[10px] leading-4 tracking-[0.1em] text-[var(--ink-soft)]">
            <span className="text-[var(--paper-accent)]">{item.venue} {item.year}</span>
            <span> / {item.contributionTag || item.type}</span>
          </div>
        </div>
      </div>

      <div className="info-preview-panel absolute inset-0 flex flex-col bg-[var(--paper-deep)] opacity-0 transition duration-700 ease-out group-hover:opacity-100 group-focus-within:opacity-100">
        <div className="paper-preview-panel border-b border-[var(--line)] bg-[var(--paper-soft)] p-3">
          <div className="flex aspect-[16/10] items-center justify-center bg-[var(--paper)] p-2">
            <img
              src={img}
              alt={`${item.title} figure preview`}
              className="max-h-full max-w-full object-contain xerox-soft"
              loading="lazy"
            />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col p-5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] leading-5 tracking-[0.1em] text-[var(--ink-soft)]">
            <span className="text-[var(--paper-accent)]">{item.venue} {item.year}</span>
            <span>{item.contributionTag || item.type}</span>
          </div>

          <h3 className="mt-3 line-clamp-4 text-[18px] font-semibold leading-6 text-[var(--ink)]">
            {item.title}
          </h3>

          <p className="mt-3 line-clamp-4 text-[13px] leading-5 text-[var(--ink-soft)]">{item.authors}</p>

          <div className="mt-auto flex flex-wrap gap-2 pt-4">
            {item.paperUrl ? (
              <Button variant="secondary" size="sm" href={item.paperUrl} target="_blank" rel="noreferrer">
                Paper
              </Button>
            ) : null}
            <Button
              variant={item.paperUrl ? "ghost" : "secondary"}
              size="sm"
              href={scholarHref}
              target="_blank"
              rel="noreferrer"
            >
              Scholar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              href="#"
              onClick={(event) => {
                event.preventDefault();
                navigator.clipboard?.writeText(item.title).catch(() => {});
              }}
            >
              Copy title
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
