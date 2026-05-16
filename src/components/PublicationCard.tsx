import { motion } from "framer-motion";
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
        `academic paper screenshot placeholder, ${item.screenshotPrompt}, clean white Apple-style editorial card, crisp typography, 16:9`,
        "landscape_16_9",
      );

  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "surface-hairline group relative overflow-hidden rounded-[1.65rem] border border-[#d2d2d7]/80 bg-[#f5f5f7] shadow-[0_10px_34px_rgba(0,0,0,0.05)] transition-colors duration-300 hover:border-[#a1a1a6] hover:bg-white dark:border-white/10 dark:bg-white/[0.075] dark:shadow-refined-dark dark:hover:border-white/18 dark:hover:bg-white/[0.1]",
        className,
      )}
    >
      <div className="relative overflow-hidden bg-white dark:bg-black">
        <img
          src={img}
          alt={`${item.title} screenshot placeholder`}
          className="h-48 w-full object-cover opacity-[0.94] saturate-[0.96] transition duration-700 ease-out group-hover:scale-[1.035] group-hover:opacity-100 group-hover:saturate-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f5f5f7] via-[#f5f5f7]/10 to-transparent dark:from-[#111111] dark:via-[#111111]/18" />
        <div className="absolute left-4 top-4 rounded-full bg-white/72 px-3 py-1 text-[11px] font-semibold tracking-[-0.01em] text-[#1d1d1f] shadow-[0_4px_16px_rgba(0,0,0,0.12)] backdrop-blur-md dark:bg-black/62 dark:text-[#f5f5f7]">
          {item.venue} · {item.year}
        </div>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          {item.type === "journal" ? <Badge>Journal</Badge> : <Badge>Conference</Badge>}
          {item.contributionTag ? <Badge variant="accent">{item.contributionTag}</Badge> : null}
        </div>

        <h3 className="mt-4 text-[15px] font-semibold leading-6 tracking-[-0.012em] text-[#1d1d1f] dark:text-[#f5f5f7]">
          {item.title}
        </h3>
        <div className="mt-2 line-clamp-3 text-sm leading-6 text-[#6e6e73] dark:text-[#a1a1a6]">{item.authors}</div>

        <div className="mt-5 flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard?.writeText(item.title).catch(() => {});
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
    </motion.article>
  );
}
