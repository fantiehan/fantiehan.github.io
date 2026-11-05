import { Fragment, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Container from "@/components/Container";
import Headpiece from "@/components/Headpiece";
import { notes } from "@/content/notes";
import { publications } from "@/content/publications";
import type { NoteBlock } from "@/content/types";
import { figureUrl, formatDate } from "@/utils/publication";

function paperById(id: string) {
  return publications.find((paper) => paper.id === id);
}

/** Reading time at 230 words a minute, counting tables and sidenotes. */
function readingMinutes(blocks: NoteBlock[]) {
  const text = blocks
    .map((block) => {
      if (block.kind === "p") return [block.text, ...(block.notes ?? [])].join(" ");
      if (block.kind === "h") return block.text;
      if (block.kind === "table") return [block.caption, ...block.head, ...block.rows.flat()].join(" ");
      if (block.kind === "figure") return block.caption;
      return "";
    })
    .join(" ");
  return Math.max(1, Math.round(text.split(/\s+/).length / 230));
}

/**
 * A numbered sidenote in the Tufte manner. On wide screens it floats into the right margin beside
 * its line; on narrow screens the number becomes a toggle and the note opens inline.
 */
function Sidenote({ number, text }: { number: number; text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-label={`Note ${number}`}
        onClick={() => setOpen((value) => !value)}
        className="sidenote-ref font-type text-[0.7em] leading-none text-[var(--accent)] xl:pointer-events-none"
      >
        <sup>{number}</sup>
      </button>
      <span
        role="note"
        className={`sidenote text-[15px] leading-[1.5] text-[var(--ink-soft)] ${open ? "is-open" : ""}`}
      >
        <span className="font-type text-[13px] text-[var(--accent)]">{number}</span> {text}
      </span>
    </>
  );
}

/** Splits `{n}` markers out of a paragraph and puts the matching sidenote in their place. */
function withSidenotes(text: string, sidenotes: string[] | undefined, firstNumber: number) {
  if (!sidenotes?.length) return text;
  return text.split(/\{(\d+)\}/).map((part, index) => {
    if (index % 2 === 0) return <Fragment key={index}>{part}</Fragment>;
    const local = Number(part);
    const note = sidenotes[local - 1];
    if (!note) return null;
    return <Sidenote key={index} number={firstNumber + local - 1} text={note} />;
  });
}

function Block({ block, firstNote, first }: { block: NoteBlock; firstNote: number; first: boolean }) {
  if (block.kind === "h") {
    return <h2 className="mt-11 text-[27px] font-medium leading-[1.25] text-[var(--ink)]">{block.text}</h2>;
  }

  if (block.kind === "table") {
    return (
      <figure className="my-8 [clear:right]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-[16px] leading-[1.4] [font-variant-numeric:tabular-nums]">
            <thead>
              <tr className="border-b border-[var(--line-strong)]">
                {block.head.map((cell) => (
                  <th key={cell} scope="col" className="py-2 pr-4 align-bottom font-medium text-[var(--ink)]">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row[0]} className="border-b border-[var(--line)]">
                  {row.map((cell, index) => (
                    <td key={index} className="py-2 pr-4 align-top text-[var(--ink)]">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <figcaption className="mt-2.5 max-w-[60ch] text-[15px] leading-[1.5] text-[var(--ink-soft)]">{block.caption}</figcaption>
      </figure>
    );
  }

  if (block.kind === "figure") {
    const paper = paperById(block.publicationId);
    if (!paper) return null;
    return (
      <figure className="note-wide my-8 [clear:right]">
        <img src={figureUrl(paper)} alt={block.caption} className="w-full xerox-soft" loading="lazy" />
        <figcaption className="mt-2.5 max-w-[60ch] text-[15px] leading-[1.5] text-[var(--ink-soft)]">{block.caption}</figcaption>
      </figure>
    );
  }

  if (block.kind === "plates") {
    // A small collection in the manner of The Public Domain Review: prints at their own
    // proportions in columns, each with its theme, a catalogue line and how the image was derived.
    return (
      <div className="note-wide my-8 columns-1 gap-x-8 sm:columns-2 xl:columns-3">
        {block.publicationIds.map((id) => {
          const paper = paperById(id);
          if (!paper) return null;
          return (
            <figure key={id} className="mb-10 break-inside-avoid">
              <img src={paper.poster.imageUrl} alt={`${paper.poster.shortTitle} poster`} className="plate-print block w-full shadow-print" loading="lazy" />
              <figcaption className="pt-3.5">
                <p className="font-type text-[14px] leading-5 text-[var(--ink-soft)]">{paper.poster.theme}</p>
                <h3 className="mt-1 text-[20px] font-medium leading-[1.3] text-[var(--ink)]">
                  {paper.poster.shortTitle}{" "}
                  <span className="text-[var(--ink-soft)]">
                    ({paper.venue.replace(/\s*\(.*\)/, "")} {paper.year})
                  </span>
                </h3>
                <p className="mt-1.5 text-[16px] leading-[1.55] text-[var(--ink-soft)]">{paper.poster.derivation}</p>
              </figcaption>
            </figure>
          );
        })}
      </div>
    );
  }

  return (
    <p className={`mt-5 text-pretty text-[18px] leading-[1.7] text-[var(--ink)] ${first ? "drop-cap" : ""}`}>
      {withSidenotes(block.text, block.notes, firstNote)}
    </p>
  );
}

export default function Note() {
  const { slug } = useParams();
  const note = notes.find((entry) => entry.slug === slug);
  if (!note) return <Navigate to="/notes" replace />;

  const position = notes.indexOf(note);
  const previous = notes[position - 1];
  const next = notes[position + 1];

  // Sidenotes are numbered through the whole note.
  const firstNotes = note.blocks.reduce<number[]>((starts, block, index) => {
    const previous = index ? starts[index - 1] + (note.blocks[index - 1].kind === "p" ? ((note.blocks[index - 1] as { notes?: string[] }).notes?.length ?? 0) : 0) : 1;
    starts.push(previous);
    return starts;
  }, []);
  const firstParagraph = note.blocks.findIndex((block) => block.kind === "p");

  return (
    <article style={{ "--note-accent": note.accent } as React.CSSProperties}>
      <Headpiece src={note.banner} alt={note.bannerAlt} />

      <Container>
        <div className="note-layout pb-8 pt-6 sm:pt-8">
          <header>
            <h1 className="text-balance text-[clamp(38px,6vw,56px)] font-medium leading-[1.08] tracking-[-0.01em] text-[var(--ink)]">
              {note.title}
            </h1>
            <p className="mt-4 max-w-[58ch] text-[20px] italic leading-[1.5] text-[var(--ink-soft)]">{note.summary}</p>
            <p className="mt-4 font-type text-[14px] leading-5 text-[var(--ink-soft)]">
              {formatDate(note.date)}, {readingMinutes(note.blocks)} min read
            </p>
          </header>

          <div className="mt-8 border-t border-[var(--line)] pt-3">
            {note.blocks.map((block, index) => (
              <Block key={index} block={block} firstNote={firstNotes[index]} first={index === firstParagraph} />
            ))}
          </div>

          <footer className="mt-12 border-t border-[var(--line)] pt-5">
            <p className="text-[17px] leading-[1.6] text-[var(--ink-soft)]">
              Further reading:{" "}
              {note.sources.map((source, index) => (
                <Fragment key={source.href}>
                  {index ? ", " : null}
                  <a className="ink-link" href={source.href} target="_blank" rel="noreferrer">
                    {source.label}
                  </a>
                </Fragment>
              ))}
              .
            </p>
          </footer>

          {/* Turn the page: the neighbouring notes, each with a strip of its headpiece. */}
          <nav aria-label="More notes" className="mt-14 grid gap-6 sm:grid-cols-2">
            {[previous, next].map((entry, index) =>
              entry ? (
                <Link key={entry.slug} to={`/notes/${entry.slug}`} className={`group block ${index ? "sm:text-right" : ""}`}>
                  <img src={entry.banner} alt="" className="headpiece aspect-[3/1] w-full object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-100" loading="lazy" />
                  <span className="mt-3 block font-type text-[14px] text-[var(--ink-soft)]">{index ? "Next note" : "Previous note"}</span>
                  <span className="mt-1 block text-[20px] font-medium leading-[1.3] text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]">
                    {entry.title}
                  </span>
                </Link>
              ) : (
                <span key={index} />
              ),
            )}
          </nav>
        </div>
      </Container>
    </article>
  );
}
