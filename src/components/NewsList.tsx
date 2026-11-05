import { useState } from "react";
import type { NewsItem, NewsKind, Publication } from "@/content/types";
import { publications } from "@/content/publications";
import { formatDate, scholarUrl } from "@/utils/publication";

function verb(kind: NewsKind, paper: Publication) {
  if (kind === "preprint") return <>released on arXiv</>;
  if (kind === "published") return <>published in {paper.venue.replace(/\s*\(.*\)/, "")}</>;
  return <>accepted to {paper.venue} {paper.year}</>;
}

type Props = {
  items: NewsItem[];
  /** How many entries to show before the "earlier news" toggle. */
  initial?: number;
};

/** A dated ledger of acceptances and releases, newest first. */
export default function NewsList({ items, initial = 5 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const entries = [...items]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((item) => ({ item, paper: publications.find((paper) => paper.id === item.publicationId) }))
    .filter((entry): entry is { item: NewsItem; paper: Publication } => Boolean(entry.paper));
  const visible = expanded ? entries : entries.slice(0, initial);

  return (
    <div>
      <ol className="news-ledger link-list">
        {visible.map(({ item, paper }) => (
          <li
            key={`${item.date}-${item.publicationId}-${item.kind}`}
            className="grid grid-cols-[104px_minmax(0,1fr)] gap-x-5 border-t border-[var(--line)] py-3.5 first:border-t-0 sm:grid-cols-[120px_minmax(0,1fr)]"
          >
            <time dateTime={item.date} className="pt-[3px] font-type text-[14px] leading-6 text-[var(--ink-soft)]">
              {formatDate(item.date)}
            </time>
            <p className="text-[18px] leading-[1.5] text-[var(--ink)]">
              <span
                aria-hidden
                className="mr-2.5 inline-block h-2.5 w-2.5 rounded-full align-[0.08em]"
                style={{ background: paper.poster.accent }}
              />
              <a className="ink-link font-medium" href={paper.paperUrl ?? scholarUrl(paper)} target="_blank" rel="noreferrer">
                {paper.poster.shortTitle}
              </a>{" "}
              {verb(item.kind, paper)}.
            </p>
          </li>
        ))}
      </ol>
      {entries.length > initial ? (
        <button type="button" className="ink-link mt-3 text-[16px]" onClick={() => setExpanded((value) => !value)}>
          {expanded ? "Show recent news only" : `Earlier news (${entries.length - initial})`}
        </button>
      ) : null}
    </div>
  );
}
