import { useMemo, useState } from "react";
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

  return (
    <Container>
      <div className="py-14">
        <div className="mb-10">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Publications</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-zinc-300">
            Quick filters and a clean reading experience.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="accent">Total: {filtered.length}</Badge>
              <Badge>Default: newest first</Badge>
            </div>

            <div className="grid w-full gap-3 md:max-w-[640px] md:grid-cols-3">
              <label className="grid gap-1">
                <span className="text-xs text-slate-500 dark:text-zinc-400">Type</span>
                <select
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400/40 dark:border-white/10 dark:bg-[#0B0D12]/60 dark:text-zinc-200"
                  value={type}
                  onChange={(e) => setType(e.target.value as TypeFilter)}
                >
                  <option value="all">All</option>
                  <option value="conference">Conference</option>
                  <option value="journal">Journal</option>
                </select>
              </label>

              <label className="grid gap-1">
                <span className="text-xs text-slate-500 dark:text-zinc-400">Year</span>
                <select
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400/40 dark:border-white/10 dark:bg-[#0B0D12]/60 dark:text-zinc-200"
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

              <label className="grid gap-1">
                <span className="text-xs text-slate-500 dark:text-zinc-400">Search</span>
                <input
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400/40 dark:border-white/10 dark:bg-[#0B0D12]/60 dark:text-zinc-200 dark:placeholder:text-zinc-500"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="keyword in title"
                />
              </label>
            </div>
          </div>
        </div>

        <Section title="Conference Proceedings">
          {grouped.conf.length ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {grouped.conf.map((p) => (
                <PublicationCard key={p.id} item={p} />
              ))}
            </div>
          ) : (
            <div className="text-sm text-slate-500 dark:text-zinc-400">No conference papers match the current filters.</div>
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
            <div className="text-sm text-slate-500 dark:text-zinc-400">No journal papers match the current filters.</div>
          )}
        </Section>
      </div>
    </Container>
  );
}
