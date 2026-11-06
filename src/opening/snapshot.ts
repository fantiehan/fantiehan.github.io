import { profile } from "@/content/profile";

/** Where the screen sits on the sheet, in CSS pixels, and the device pixels per CSS pixel of its print. */
export type SheetFrame = { side: number; x: number; y: number; density: number };

const isClear = (colour: string) => colour === "transparent" || /^rgba\(.*[,/]\s*0\)$/.test(colour);
const urlsIn = (value: string) => [...value.matchAll(/url\("(.+?)"\)/g)].map((match) => match[1]);

function loadImage(src: string) {
  const image = new Image();
  image.src = src;
  return image.decode().then(() => image);
}

/**
 * The print's canvas. It sits in the document while it is drawn on, because a canvas takes its font
 * smoothing and optical sizing from where it is. A detached one sets the same type visibly heavier.
 */
function canvasFor(frame: SheetFrame, size: number, paper: string) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  canvas.setAttribute("style", "position:fixed;left:0;top:0;width:0;height:0;visibility:hidden");
  document.body.append(canvas);
  const context = canvas.getContext("2d")!;
  context.fillStyle = paper;
  context.fillRect(0, 0, size, size);
  const scale = size / frame.side;
  context.setTransform(scale, 0, 0, scale, frame.x * scale, frame.y * scale);
  context.textBaseline = "alphabetic";
  context.fontKerning = "normal";
  context.textRendering = "optimizeLegibility";
  return { canvas, context };
}

function wrap(context: CanvasRenderingContext2D, text: string, width: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    if (line && context.measureText(`${line} ${word}`).width > width) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  return line ? [...lines, line] : lines;
}

const SERIF = '"Newsreader Variable", Georgia, "Songti SC", serif';

/**
 * What the sheet carries before the site has loaded: the home page's words in the page's own type,
 * roughly where they will be. The true page fades in over it before the sheet opens.
 */
export function draftPage(frame: SheetFrame, size: number, paper: string, ink: string, soft: string) {
  const { canvas, context } = canvasFor(frame, size, paper);
  const width = document.documentElement.clientWidth;
  const left = Math.max(20, (width - 1080) / 2 + 32);
  const column = Math.min(width - left * 2, 560);
  let y = 250;
  context.font = `italic 22px ${SERIF}`;
  context.fillStyle = soft;
  context.fillText(profile.tagline, left, y);
  y += 56;
  context.font = `18px ${SERIF}`;
  context.fillStyle = ink;
  for (const paragraph of profile.intro) {
    for (const line of wrap(context, paragraph, column)) {
      context.fillText(line, left, y);
      y += 30.6;
    }
    y += 20;
  }
  canvas.remove();
  return canvas;
}

function fontOf(style: CSSStyleDeclaration) {
  return `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
}

const ascents = new Map<string, number>();

/** From the top of a line of text to its baseline, as the browser itself lays this font out. */
function ascentOf(style: CSSStyleDeclaration) {
  const font = fontOf(style);
  const known = ascents.get(font);
  if (known !== undefined) return known;
  const holder = document.createElement("span");
  holder.style.cssText = "position:absolute;left:0;top:0;visibility:hidden;white-space:nowrap";
  holder.style.font = font;
  const text = document.createTextNode("x");
  const mark = document.createElement("span");
  mark.style.cssText = "display:inline-block;width:0;height:0";
  holder.append(text, mark);
  document.body.append(holder);
  const range = document.createRange();
  range.selectNode(text);
  const ascent = mark.getBoundingClientRect().bottom - range.getBoundingClientRect().top;
  holder.remove();
  ascents.set(font, ascent);
  return ascent;
}

function drawText(context: CanvasRenderingContext2D, node: Text, from: number, to: number, style: CSSStyleDeclaration, density: number) {
  const range = document.createRange();
  range.setStart(node, from);
  range.setEnd(node, to);
  const rects = range.getClientRects();
  if (!rects.length) return;
  if (rects.length > 1 && to - from > 1) {
    // A word broken across two lines, at a hyphen: find the break and draw each part on its own.
    const top = rects[0].top;
    for (let split = from + 1; split < to; split++) {
      range.setEnd(node, split + 1);
      const parts = range.getClientRects();
      if (parts[parts.length - 1].top > top + 1) {
        drawText(context, node, from, split, style, density);
        drawText(context, node, split, to, style, density);
        return;
      }
    }
  }
  context.font = fontOf(style);
  context.fillStyle = style.color;
  context.letterSpacing = style.letterSpacing === "normal" ? "0px" : style.letterSpacing;
  // The browser sets baselines on whole device pixels, and the print has to land on the same ones.
  const baseline = Math.round((rects[0].top + ascentOf(style)) * density) / density;
  context.fillText(node.data.slice(from, to), rects[0].left, baseline);
}

function drawImage(context: CanvasRenderingContext2D, image: HTMLImageElement, rect: DOMRect, style: CSSStyleDeclaration) {
  if (!image.complete || !image.naturalWidth || !rect.width) return;
  const fit = style.objectFit;
  const scale =
    fit === "cover"
      ? Math.max(rect.width / image.naturalWidth, rect.height / image.naturalHeight)
      : fit === "contain"
        ? Math.min(rect.width / image.naturalWidth, rect.height / image.naturalHeight)
        : 0;
  context.filter = style.filter === "none" ? "none" : style.filter;
  if (fit === "cover") {
    const [sw, sh] = [rect.width / scale, rect.height / scale];
    context.drawImage(image, (image.naturalWidth - sw) / 2, (image.naturalHeight - sh) / 2, sw, sh, rect.left, rect.top, rect.width, rect.height);
  } else if (fit === "contain") {
    const [dw, dh] = [image.naturalWidth * scale, image.naturalHeight * scale];
    context.drawImage(image, rect.left + (rect.width - dw) / 2, rect.top + (rect.height - dh) / 2, dw, dh);
  } else {
    context.drawImage(image, rect.left, rect.top, rect.width, rect.height);
  }
  context.filter = "none";
}

async function rasterise(svg: SVGSVGElement) {
  const rect = svg.getBoundingClientRect();
  const style = getComputedStyle(svg);
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("width", `${rect.width}`);
  clone.setAttribute("height", `${rect.height}`);
  const root = getComputedStyle(document.documentElement);
  const variables = ["--paper", "--ink", "--accent"].map((name) => `${name}:${root.getPropertyValue(name)}`).join(";");
  clone.setAttribute("style", `color:${style.color};${variables}`);
  return loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`);
}

/** One repeat of the paper's grain, as a bitmap at the print's own resolution. */
function grainTile(image: HTMLImageElement, density: number) {
  const tile = document.createElement("canvas");
  tile.width = Math.round(image.naturalWidth * density);
  tile.height = Math.round(image.naturalHeight * density);
  tile.getContext("2d")!.drawImage(image, 0, 0, tile.width, tile.height);
  return { tile, width: image.naturalWidth, height: image.naturalHeight };
}

/**
 * Prints the page as it is now laid out, so that at full size the sheet lands exactly on the page
 * beneath it: its text, images, inline drawings, fills, borders, inked rules and paper grain.
 */
export async function printPage(frame: SheetFrame, size: number, paper: string) {
  const root = document.getElementById("root")!;
  const bottom = frame.side - frame.y;
  const inView = (element: Element) => {
    const rect = element.getBoundingClientRect();
    return rect.width > 1 && rect.bottom > -frame.y && rect.top < bottom;
  };
  const skip = ".signature-ink, .scroll-pencil, .sr-only, [data-sheet-skip]";
  const ruled = '[class*="rule-"], .rule-rows tr';

  // Whatever the first screen shows should be on the sheet; the opening is what is covering the wait.
  const pictures = [...root.querySelectorAll("img")].filter((image) => inView(image) && image.getBoundingClientRect().top < window.innerHeight);
  await Promise.race([Promise.allSettled(pictures.map((image) => image.decode())), new Promise((resolve) => window.setTimeout(resolve, 900))]);
  const drawings = new Map<Element, HTMLImageElement>();
  await Promise.allSettled(
    [...root.querySelectorAll("svg")]
      .filter((svg) => inView(svg) && !svg.closest(skip))
      .map(async (svg) => drawings.set(svg, await rasterise(svg))),
  );

  // The grain, last layer first, as CSS stacks it.
  const grainSource = root.querySelector(".paper-grain");
  const grainImages = await Promise.allSettled((grainSource ? urlsIn(getComputedStyle(grainSource).backgroundImage) : []).reverse().map(loadImage));
  const grain = grainImages.flatMap((result) => (result.status === "fulfilled" ? [grainTile(result.value, frame.density)] : []));

  const pseudoLines = (element: Element) => ["::before", "::after"].map((pseudo) => getComputedStyle(element, pseudo)).filter((line) => line.content !== "none" && line.display !== "none");
  const maskUrl = (line: CSSStyleDeclaration) => urlsIn(line.maskImage || line.webkitMaskImage)[0];
  const masks = new Map<string, HTMLImageElement>();
  const maskUrls = new Set([...root.querySelectorAll(ruled)].filter(inView).flatMap((element) => pseudoLines(element).map(maskUrl)));
  await Promise.allSettled([...maskUrls].filter(Boolean).map(async (url) => masks.set(url, await loadImage(url))));

  const { canvas, context } = canvasFor(frame, size, paper);

  /** Tiles the grain from the screen's top left corner, over `area` in the page's coordinates. */
  const drawGrain = (area: { left: number; top: number; right: number; bottom: number }) => {
    for (const { tile, width, height } of grain) {
      for (let y = Math.floor(area.top / height) * height; y < area.bottom; y += height) {
        for (let x = Math.floor(area.left / width) * width; x < area.right; x += width) {
          context.drawImage(tile, x, y, width, height);
        }
      }
    }
  };
  drawGrain({ left: -frame.x, top: -frame.y, right: frame.side - frame.x, bottom });

  const tiles = new Map<string, HTMLCanvasElement>();
  /** A hand-inked rule: its mask repeated along it, in its own colour, flipped if it is flipped. */
  const drawRule = (rect: DOMRect, line: CSSStyleDeclaration) => {
    const mask = masks.get(maskUrl(line));
    const [x, y, w, h] = [line.left, line.top, line.width, line.height].map(parseFloat);
    if (!mask || !w || !h) return;
    const [left, top] = [rect.left + x, rect.top + y];
    const [tileW, tileH] = (line.maskSize || line.webkitMaskSize).split(" ").map(parseFloat);
    const [offsetX, offsetY] = (line.maskPosition || line.webkitMaskPosition).split(" ").map(parseFloat);
    const key = `${mask.src}|${line.backgroundColor}|${tileW}`;
    let tile = tiles.get(key);
    if (!tile) {
      tile = document.createElement("canvas");
      tile.width = Math.round(tileW * frame.density);
      tile.height = Math.round(tileH * frame.density);
      const paint = tile.getContext("2d")!;
      paint.fillStyle = line.backgroundColor;
      paint.fillRect(0, 0, tile.width, tile.height);
      paint.globalCompositeOperation = "destination-in";
      paint.drawImage(mask, 0, 0, tile.width, tile.height);
      tiles.set(key, tile);
    }
    context.save();
    context.beginPath();
    context.rect(left, top, w, h);
    context.clip();
    if (line.transform !== "none") {
      const matrix = new DOMMatrix(line.transform);
      context.translate(left + w / 2, top + h / 2);
      context.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
      context.translate(-left - w / 2, -top - h / 2);
    }
    const along = w >= h;
    const start = along ? left + (((offsetX || 0) % tileW) - tileW) : top + (((offsetY || 0) % tileH) - tileH);
    const end = along ? left + w : top + h;
    for (let at = start; at < end; at += along ? tileW : tileH) {
      if (along) context.drawImage(tile, at, top + (offsetY || 0), tileW, tileH);
      else context.drawImage(tile, left + (offsetX || 0), at, tileW, tileH);
    }
    context.restore();
  };

  const paint = (element: Element, opacity: number) => {
    if (element.matches(skip)) return;
    const style = getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden") return;
    const alpha = opacity * parseFloat(style.opacity);
    if (alpha < 0.01) return;
    const rect = element.getBoundingClientRect();
    if (rect.top > bottom) return;
    context.globalAlpha = alpha;

    if (element instanceof HTMLImageElement) {
      drawImage(context, element, rect, style);
      return;
    }
    if (element instanceof SVGSVGElement) {
      const image = drawings.get(element);
      if (image) context.drawImage(image, rect.left, rect.top, rect.width, rect.height);
      return;
    }

    const radius = parseFloat(style.borderTopLeftRadius) || 0;
    if (!isClear(style.backgroundColor) && rect.width) {
      context.fillStyle = style.backgroundColor;
      context.beginPath();
      context.roundRect(rect.left, rect.top, rect.width, rect.height, radius);
      context.fill();
    }
    if (element.classList.contains("paper-grain")) {
      context.save();
      context.beginPath();
      context.rect(rect.left, rect.top, rect.width, rect.height);
      context.clip();
      drawGrain(rect);
      context.restore();
    }
    const border = parseFloat(style.borderTopWidth);
    if (border > 0 && style.borderBottomWidth === style.borderTopWidth && !isClear(style.borderTopColor)) {
      context.strokeStyle = style.borderTopColor;
      context.lineWidth = border;
      context.beginPath();
      context.roundRect(rect.left + border / 2, rect.top + border / 2, rect.width - border, rect.height - border, radius);
      context.stroke();
    }
    if (element.matches(ruled)) for (const line of pseudoLines(element)) drawRule(rect, line);

    let firstText = true;
    for (const child of element.childNodes) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        paint(child as Element, alpha);
        context.globalAlpha = alpha;
      } else if (child.nodeType === Node.TEXT_NODE) {
        const node = child as Text;
        for (const match of node.data.matchAll(/\S+/g)) {
          let start = match.index;
          const end = start + match[0].length;
          if (firstText && start === 0 && element.classList.contains("drop-cap")) {
            drawText(context, node, 0, 1, getComputedStyle(element, "::first-letter"), frame.density);
            start = 1;
          }
          if (start < end) drawText(context, node, start, end, style, frame.density);
          firstText = false;
        }
      }
    }

    // The small arrow on a link that leaves the site.
    const arrow = element.matches('.ink-link[target="_blank"]') ? getComputedStyle(element, "::after") : null;
    if (arrow && arrow.content !== "none") {
      const rects = element.getClientRects();
      const end = rects[rects.length - 1];
      const size = parseFloat(arrow.fontSize);
      context.font = fontOf(arrow);
      context.fillStyle = arrow.color;
      context.textAlign = "right";
      context.fillText("↗", end.right, end.top + parseFloat(style.fontSize) * 0.98 - size * 0.46);
      context.textAlign = "left";
    }
  };
  paint(root, 1);
  canvas.remove();
  return canvas;
}
