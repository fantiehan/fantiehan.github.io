import { useMemo, useState } from "react";
import Container from "@/components/Container";
import Section from "@/components/Section";
import PublicationRow from "@/components/PublicationRow";
import { publications } from "@/content/publications";
import type { PublicationType } from "@/content/types";
import { cn } from "@/lib/utils";

type TypeFilter = "all" | PublicationType;

const typeOptions: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "conference", label: "Conference" },
  { value: "journal", label: "Journal" },
  { value: "preprint", label: "Preprint" },
];

const groups: { type: PublicationType; title: string }[] = [
  { type: "preprint", title: "Preprints" },
  { type: "conference", title: "Conference papers" },
  { type: "journal", title: "Journal articles" },
];

export default function Publications() {
  const [type, setType] = useState<TypeFilter>("all");
  const [query, setQuery] = useState<string>("");

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return publications
      .filter((paper) => (type === "all" ? true : paper.type === type))
      .filter((paper) =>
        normalizedQuery
          ? `${paper.title} ${paper.authors} ${paper.venue} ${paper.year}`.toLowerCase().includes(normalizedQuery)
          : true,
      )
      .sort((a, b) => b.year - a.year);
  }, [type, query]);

  const visibleGroups = groups
    .map((group) => ({ ...group, items: filtered.filter((paper) => paper.type === group.type) }))
    .filter((group) => group.items.length);

  return (
    <Container>
      <header className="pb-4 pt-14 sm:pt-20">
        <h1 className="text-[clamp(44px,7vw,68px)] font-medium leading-[1.05] tracking-[-0.01em] text-[var(--ink)]">
          Publications
        </h1>
        <p className="mt-4 max-w-[60ch] text-[19px] leading-[1.6] text-[var(--ink-soft)]">
          Papers on multimodal LLMs, video generation, datasets, and earlier machine learning work for materials. Each
          paper has a hand-drawn poster beside it.
        </p>

        <div className="mt-8 flex flex-col gap-4 border-y border-[var(--line)] py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by type">
            {typeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={type === option.value}
                onClick={() => setType(option.value)}
                className={cn(
                  "rounded-full border px-3.5 py-1 text-[16px] transition-colors",
                  type === option.value
                    ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                    : "border-[var(--line)] text-[var(--ink-soft)] hover:border-[var(--ink)] hover:text-[var(--ink)]",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-3 text-[16px] text-[var(--ink-soft)]">
            <span className="sr-only">Search publications</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, author, venue"
              className="h-10 w-full rounded-[3px] border border-[var(--line)] bg-[var(--paper-soft)] px-3 text-[16px] text-[var(--ink)] outline-none placeholder:text-[var(--ink-soft)] focus:border-[var(--accent)] sm:w-72"
            />
          </label>
        </div>
      </header>

      {visibleGroups.length ? (
        visibleGroups.map((group) => (
          <Section key={group.type} title={group.title}>
            <div>
              {group.items.map((paper) => (
                <PublicationRow key={paper.id} item={paper} />
              ))}
            </div>
          </Section>
        ))
      ) : (
        <p className="py-16 text-[18px] text-[var(--ink-soft)]">
          No publications match “{query}”.{" "}
          <button
            type="button"
            className="ink-link"
            onClick={() => {
              setQuery("");
              setType("all");
            }}
          >
            Clear filters
          </button>
        </p>
      )}
    </Container>
  );
}
