import { Link } from "react-router-dom";
import { notes } from "@/content/notes";
import { formatDate } from "@/utils/publication";

/** Titles with a one-line summary, ruled like the News ledger. */
export default function NotesList({ limit }: { limit?: number }) {
  return (
    <ol>
      {notes.slice(0, limit).map((note) => (
        <li key={note.slug} className="border-t border-[var(--line)] py-4 first:border-t-0 first:pt-0">
          <h3 className="text-[21px] font-medium leading-[1.3]">
            <Link className="ink-link" to={`/notes/${note.slug}`}>
              {note.title}
            </Link>
          </h3>
          <p className="mt-1.5 max-w-[66ch] text-[17px] leading-[1.55] text-[var(--ink-soft)]">{note.summary}</p>
          <p className="mt-1.5 font-type text-[14px] leading-5 text-[var(--ink-soft)]">{formatDate(note.date)}</p>
        </li>
      ))}
    </ol>
  );
}
