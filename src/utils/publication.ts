import { placeholderImageUrl } from "@/utils/images";
import type { Publication } from "@/content/types";

export function figureUrl(item: Publication) {
  return item.screenshotUrl
    ? item.screenshotUrl
    : placeholderImageUrl(
        `aged paper academic figure preview, ${item.screenshotPrompt}, quiet zine archive, matte scan texture`,
        "landscape_16_9",
      );
}

export function scholarUrl(item: Publication) {
  return item.scholarUrl ?? `https://scholar.google.com/scholar?q=${encodeURIComponent(item.title)}`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Formats "YYYY-MM-DD" or "YYYY-MM" for display. */
export function formatDate(date: string) {
  const [year, month, day] = date.split("-");
  return day ? `${MONTHS[Number(month) - 1]} ${Number(day)}, ${year}` : `${MONTHS[Number(month) - 1]} ${year}`;
}
