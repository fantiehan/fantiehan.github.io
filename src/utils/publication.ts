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
