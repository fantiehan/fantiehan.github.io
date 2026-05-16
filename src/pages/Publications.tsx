import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Container from "@/components/Container";
import Section from "@/components/Section";
import PublicationCard from "@/components/PublicationCard";
import Badge from "@/components/Badge";
import { publications } from "@/content/publications";
import type { PublicationType } from "@/content/types";

type TypeFilter = "all" | PublicationType;

function uniqueYears() {
  const years = Array.from(new Set(publications.map((p) => p.year))).sort((a, b) => b - a);
  return years;
}

export default function Publications() {
  const years = useMemo(() => uniqueYears(), []);
  const [type, setType] = useState<TypeFilter>("all");
  const [year, setYear] = useState<number | "all">("all");
  const [query, setQuery] = useState<string>("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return publications
      .filter((p) => (type === "all" ? true : p.type === type))
      .filter((p) => (year === "all" ? true : p.year === year))
      .filter((p) => (q ? p.title.toLowerCase().includes(q) : true))
      .sort((a, b) => b.year - a.year);
  }, [type, year, query]);

  const grouped = useMemo(() => {
    const conf = filtered.filter((p) => p.type === "conference");
    const journal = filtered.filter((p) => p.type === "journal");
    return { conf, journal };
  }, [filtered]);

  const fieldClass =
    "h-10 rounded-2xl border border-[#d2d2d7] bg-white px-3 text-sm text-[#1d1d1f] outline-none transition placeholder:text-[#86868b] focus:border-[#0071e3]/55 focus:ring-2 focus:ring-[#0071e3]/10 dark:border-white/12 dark:bg-white/[0.075] dark:text-[#f5f5f7] dark:placeholder:text-[#86868b] dark:focus:border-[#2997ff]/45 dark:focus:bg-white/[0.1]";

  return (
    <Container>
      <div className="py-16 sm:py-24">
        <div className="mb-12">
          <Badge variant="accent">Research Output</Badge>
          <h1 className="font-display mt-5 text-5xl font-semibold tracking-[-0.055em] text-[#1d1d1f] dark:text-[#f5f5f7] sm:text-6xl">
            Publications
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-8 text-[#515154] dark:text-[#a1a1a6]">
            A curated overview of papers across multimodal LLMs, visual generation, datasets, and earlier work in machine learning for materials.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
          className="surface-hairline rounded-[1.65rem] border border-[#d2d2d7]/80 bg-[#f5f5f7] p-5 shadow-[0_10px_34px_rgba(0,0,0,0.05)] dark:border-white/10 dark:bg-white/[0.075] dark:shadow-refined-dark"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="accent">Total: {filtered.length}</Badge>
              <Badge>Newest first</Badge>
              <Badge>{publications.length} records</Badge>
            </div>

            <div className="grid w-full gap-3 md:max-w-[680px] md:grid-cols-3">
              <label className="grid gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6e6e73] dark:text-[#a1a1a6]">Type</span>
                <select
                  className={fieldClass}
                  value={type}
                  onChange={(e) => setType(e.target.value as TypeFilter)}
                >
                  <option value="all">All</option>
                  <option value="conference">Conference</option>
                  <option value="journal">Journal</option>
                </select>
              </label>

              <label className="grid gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6e6e73] dark:text-[#a1a1a6]">Year</span>
                <select
                  className={fieldClass}
                  value={year}
                  onChange={(e) => {
                    const v = e.target.value;
                    setYear(v === "all" ? "all" : Number(v));
                  }}
                >
                  <option value="all">All</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6e6e73] dark:text-[#a1a1a6]">Search</span>
                <input
                  className={fieldClass}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="keyword in title"
                />
              </label>
            </div>
          </div>
        </motion.div>

        <Section title="Conference Proceedings">
          {grouped.conf.length ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {grouped.conf.map((p) => (
                <PublicationCard key={p.id} item={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#d2d2d7]/80 bg-[#f5f5f7] p-5 text-sm text-[#6e6e73] dark:border-white/10 dark:bg-white/[0.075] dark:text-[#a1a1a6]">
              No conference papers match the current filters.
            </div>
          )}
        </Section>

        <Section title="Journal Articles">
          {grouped.journal.length ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {grouped.journal.map((p) => (
                <PublicationCard key={p.id} item={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#d2d2d7]/80 bg-[#f5f5f7] p-5 text-sm text-[#6e6e73] dark:border-white/10 dark:bg-white/[0.075] dark:text-[#a1a1a6]">
              No journal papers match the current filters.
            </div>
          )}
        </Section>
      </div>
    </Container>
  );
}
