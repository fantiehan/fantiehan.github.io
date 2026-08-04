import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/Container";
import Section from "@/components/Section";
import PublicationCard from "@/components/PublicationCard";
import Badge from "@/components/Badge";
import { publications } from "@/content/publications";
import type { PublicationType } from "@/content/types";

type TypeFilter = "all" | PublicationType;

function uniqueYears() {
  return Array.from(new Set(publications.map((paper) => paper.year))).sort((a, b) => b - a);
}

export default function Publications() {
  const reduceMotion = useReducedMotion();
  const years = useMemo(() => uniqueYears(), []);
  const [type, setType] = useState<TypeFilter>("all");
  const [year, setYear] = useState<number | "all">("all");
  const [query, setQuery] = useState<string>("");

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return publications
      .filter((paper) => (type === "all" ? true : paper.type === type))
      .filter((paper) => (year === "all" ? true : paper.year === year))
      .filter((paper) => (normalizedQuery ? paper.title.toLowerCase().includes(normalizedQuery) : true))
      .sort((a, b) => b.year - a.year);
  }, [type, year, query]);

  const grouped = useMemo(() => {
    const preprint = filtered.filter((paper) => paper.type === "preprint");
    const conf = filtered.filter((paper) => paper.type === "conference");
    const journal = filtered.filter((paper) => paper.type === "journal");
    return { preprint, conf, journal };
  }, [filtered]);

  const fieldClass =
    "h-10 border border-[var(--line)] bg-[var(--paper)] px-3 font-mono text-[12px] text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-soft)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]";

  return (
    <Container>
      <div className="py-10 sm:py-14">
        <header className="border-b-2 border-[var(--line-strong)] pb-8">
          <Badge variant="accent">Research archive</Badge>
          <h1 className="mt-5 font-display text-[clamp(42px,8vw,76px)] font-semibold leading-none text-[var(--ink)]">
            Publications
          </h1>
          <p className="mt-4 max-w-2xl text-[18px] leading-8 text-[var(--ink-soft)]">
            A curated overview of papers across multimodal LLMs, visual generation, datasets, and earlier machine learning work for materials.
          </p>
        </header>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 border border-[var(--line)] bg-[var(--paper-deep)] p-5 shadow-paper-soft"
        >
          <div className="grid w-full gap-3 lg:ml-auto lg:max-w-[680px] lg:grid-cols-3">
            <label className="grid gap-1.5">
              <span className="font-mono text-[11px] tracking-[0.12em] text-[var(--ink-soft)]">Type</span>
              <select
                className={fieldClass}
                value={type}
                onChange={(event) => setType(event.target.value as TypeFilter)}
              >
                <option value="all">All</option>
                <option value="conference">Conference</option>
                <option value="journal">Journal</option>
                <option value="preprint">Preprint</option>
              </select>
            </label>

            <label className="grid gap-1.5">
              <span className="font-mono text-[11px] tracking-[0.12em] text-[var(--ink-soft)]">Year</span>
              <select
                className={fieldClass}
                value={year}
                onChange={(event) => {
                  const value = event.target.value;
                  setYear(value === "all" ? "all" : Number(value));
                }}
              >
                <option value="all">All</option>
                {years.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1.5">
              <span className="font-mono text-[11px] tracking-[0.12em] text-[var(--ink-soft)]">Search</span>
              <input
                className={fieldClass}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="keyword in title"
              />
            </label>
          </div>
        </motion.div>

        <Section title="Preprints">
          {grouped.preprint.length ? (
            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {grouped.preprint.map((paper) => (
                <PublicationCard key={paper.id} item={paper} />
              ))}
            </div>
          ) : (
            <div className="border border-[var(--line)] bg-[var(--paper-deep)] p-5 text-[15px] text-[var(--ink-soft)]">
              No preprints match the current filters.
            </div>
          )}
        </Section>

        <Section title="Conference papers">
          {grouped.conf.length ? (
            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {grouped.conf.map((paper) => (
                <PublicationCard key={paper.id} item={paper} />
              ))}
            </div>
          ) : (
            <div className="border border-[var(--line)] bg-[var(--paper-deep)] p-5 text-[15px] text-[var(--ink-soft)]">
              No conference papers match the current filters.
            </div>
          )}
        </Section>

        <Section title="Journal articles">
          {grouped.journal.length ? (
            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {grouped.journal.map((paper) => (
                <PublicationCard key={paper.id} item={paper} />
              ))}
            </div>
          ) : (
            <div className="border border-[var(--line)] bg-[var(--paper-deep)] p-5 text-[15px] text-[var(--ink-soft)]">
              No journal papers match the current filters.
            </div>
          )}
        </Section>

        <p className="border-t border-[var(--line)] pt-5 font-mono text-[10px] leading-5 tracking-[0.1em] text-[var(--ink-soft)]">
          <a
            href="https://github.com/fantiehan/paper2humanist-poster"
            target="_blank"
            rel="noreferrer"
            className="border-b border-transparent transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Posters made with paper2humanist-poster.
          </a>
        </p>
      </div>
    </Container>
  );
}
