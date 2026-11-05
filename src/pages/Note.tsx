import { Link, Navigate, useParams } from "react-router-dom";
import Container from "@/components/Container";
import { notes } from "@/content/notes";
import { publications } from "@/content/publications";
import type { NoteBlock } from "@/content/types";
import { figureUrl, formatDate } from "@/utils/publication";

function paperById(id: string) {
  return publications.find((paper) => paper.id === id);
}

function Block({ block }: { block: NoteBlock }) {
  if (block.kind === "h") {
    return <h2 className="mt-10 text-[27px] font-medium leading-[1.25] text-[var(--ink)]">{block.text}</h2>;
  }

  if (block.kind === "table") {
    return (
      <figure className="my-8">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-[16px] leading-[1.4]">
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
        <figcaption className="mt-2.5 text-[15px] leading-[1.5] text-[var(--ink-soft)]">{block.caption}</figcaption>
      </figure>
    );
  }

  if (block.kind === "figure") {
    const paper = paperById(block.publicationId);
    if (!paper) return null;
    return (
      <figure className="my-8">
        <img src={figureUrl(paper)} alt={block.caption} className="w-full xerox-soft" loading="lazy" />
        <figcaption className="mt-2.5 text-[15px] leading-[1.5] text-[var(--ink-soft)]">{block.caption}</figcaption>
      </figure>
    );
  }

  if (block.kind === "plates") {
    return (
      <div className="my-8 grid gap-6">
        {block.items.map((item) => {
          const paper = paperById(item.publicationId);
          if (!paper) return null;
          return (
            <div key={item.publicationId} className="grid grid-cols-[84px_minmax(0,1fr)] items-start gap-5 sm:grid-cols-[108px_minmax(0,1fr)]">
              <img src={paper.poster.imageUrl} alt={`${paper.poster.shortTitle} poster`} className="w-full shadow-print" loading="lazy" />
              <p className="text-[17px] leading-[1.55] text-[var(--ink)]">{item.text}</p>
            </div>
          );
        })}
      </div>
    );
  }

  return <p className="mt-5 text-pretty text-[18px] leading-[1.7] text-[var(--ink)]">{block.text}</p>;
}

export default function Note() {
  const { slug } = useParams();
  const note = notes.find((entry) => entry.slug === slug);
  if (!note) return <Navigate to="/notes" replace />;

  return (
    <Container>
      <article className="max-w-[680px] pb-8 pt-14 sm:pt-20">
        <h1 className="text-balance text-[clamp(38px,6vw,56px)] font-medium leading-[1.08] tracking-[-0.01em] text-[var(--ink)]">
          {note.title}
        </h1>
        <p className="mt-4 font-type text-[14px] leading-5 text-[var(--ink-soft)]">{formatDate(note.date)}</p>

        <div className="mt-6">
          {note.blocks.map((block, index) => (
            <Block key={index} block={block} />
          ))}
        </div>

        <footer className="mt-12 border-t border-[var(--line)] pt-5 text-[17px]">
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {note.sources.map((source) => (
              <li key={source.href}>
                <a className="ink-link" href={source.href} target="_blank" rel="noreferrer">
                  {source.label}
                </a>
              </li>
            ))}
            <li>
              <Link className="ink-link" to="/notes">
                All notes
              </Link>
            </li>
          </ul>
        </footer>
      </article>
    </Container>
  );
}
