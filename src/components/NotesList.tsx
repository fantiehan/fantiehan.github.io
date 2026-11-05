import { Link } from "react-router-dom";
import { notes } from "@/content/notes";
import { formatDate } from "@/utils/publication";

/** Date, title and one-line summary, after Craig Mod's essay index, with a small crop of the headpiece. */
export default function NotesList({ limit }: { limit?: number }) {
  return (
    <ol>
      {notes.slice(0, limit).map((note) => (
        <li key={note.slug} className="border-t border-[var(--line)] py-5 first:border-t-0 first:pt-0">
          <Link to={`/notes/${note.slug}`} className="group grid gap-x-6 gap-y-3 sm:grid-cols-[minmax(0,1fr)_168px] sm:items-center">
            <div>
              <p className="font-type text-[14px] leading-5 text-[var(--ink-soft)]">{formatDate(note.date)}</p>
              <h3 className="mt-1.5 text-[22px] font-medium leading-[1.3] text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]">
                {note.title}
              </h3>
              <p className="mt-1.5 max-w-[62ch] text-[17px] leading-[1.55] text-[var(--ink-soft)]">{note.summary}</p>
            </div>
            <img src={note.banner} alt="" className="headpiece order-first aspect-[3/1] w-full object-cover sm:order-none" loading="lazy" />
          </Link>
        </li>
      ))}
    </ol>
  );
}
