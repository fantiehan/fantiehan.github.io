export type PlaceholderImageSize =
  | "square_hd"
  | "square"
  | "portrait_4_3"
  | "portrait_16_9"
  | "landscape_4_3"
  | "landscape_16_9";

export function placeholderImageUrl(prompt: string, imageSize: PlaceholderImageSize) {
  const encoded = encodeURIComponent(prompt);
  return `https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=${encoded}&image_size=${imageSize}`;
}

