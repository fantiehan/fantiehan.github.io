import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { placeholderImageUrl } from "@/utils/images";
import type { Publication } from "@/content/types";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  item: Publication;
  className?: string;
};

export default function PublicationCard({ item, className }: Props) {
  const img = item.screenshotUrl
    ? item.screenshotUrl
    : placeholderImageUrl(
        `academic paper screenshot placeholder, ${item.screenshotPrompt}, ultra clean, minimal, high-end, apple-like, soft lighting, 16:9`,
        "landscape_16_9",
      );

  return (
    <div
      className={cn(
        "group overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm transition hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:bg-white/10",
        className,
      )}
    >
      <div className="relative">
        <img
          src={img}
          alt={`${item.title} screenshot placeholder`}
          className="h-44 w-full object-cover opacity-95 transition duration-300 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent dark:from-[#0B0D12]/40" />
      </div>
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="accent">{item.venue} {item.year}</Badge>
          {item.type === "journal" ? <Badge>Journal</Badge> : <Badge>Conference</Badge>}
          {item.contributionTag ? <Badge variant="accent">{item.contributionTag}</Badge> : null}
        </div>

        <div className="mt-3 text-sm font-semibold leading-6 text-slate-900 dark:text-white">{item.title}</div>
        <div className="mt-2 text-sm leading-6 text-slate-500 dark:text-zinc-400">{item.authors}</div>

        <div className="mt-4 flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(item.title).catch(() => {});
            }}
          >
            Copy Title
          </Button>
          <Button
            variant="ghost"
            size="sm"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              const q = encodeURIComponent(item.title);
              window.open(`https://scholar.google.com/scholar?q=${q}`, "_blank", "noreferrer");
            }}
          >
            Search
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
