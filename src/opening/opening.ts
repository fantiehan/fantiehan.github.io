import newsreaderItalic from "@fontsource-variable/newsreader/files/newsreader-latin-opsz-italic.woff2?url";
import newsreaderNormal from "@fontsource-variable/newsreader/files/newsreader-latin-opsz-normal.woff2?url";
import { HINT_ARROW, HINT_ARROW_SKETCH, HINT_HEIGHT, HINT_LETTERS, HINT_TIP, HINT_WIDTH } from "@/opening/hintArt";
import { PAPER_COLS, PAPER_MESH, PAPER_ROWS } from "@/opening/paperMesh";
import { draftPage, printPage, type SheetFrame } from "@/opening/snapshot";
import { finishOpening } from "@/opening/state";
import { drawTable } from "@/opening/table";

/*
 * The opening: the page itself, screwed up into a ball on a wooden table, with a pencilled arrow
 * asking to be opened.
 * Pressed, it opens out and grows until the print on it lands exactly on the real page, and the sheet
 * then gives way to what is underneath. It lives in the entry chunk so it runs while the site's own
 * code is still downloading. The folding and shading follow LeiBox's Crumpled Paper
 * component (https://leibox.pantoria.cn/docs/animations/crumpled-paper, design reference by Matt:
 * https://x.com/insporadesign/status/2113586239110828465/video/1).
 */

const SEEN_KEY = "opening-seen";
/** How long the ball takes to open, and the final handover, in seconds. */
const UNFOLD = 1.3;
const HANDOVER = 0.2;
/** How long the true page takes to come up over the draft, and the most the type may delay the start. */
const SWAP = 0.3;
const TYPE_WAIT = 700;
/** When the hint starts to draw, and how long the arrow and the lettering each take, in seconds. */
const HINT_START = 0.55;
const HINT_ARROW_TIME = 0.5;
const HINT_LETTERS_TIME = 0.45;
/** A second press speeds the rest of the opening up by this much. */
const SKIP_SPEED = 3.5;
/** The sheet's side at full size, against the screen's long side. */
const COVER = 1.04;
/** The filtered print the small sheet is read from, a power of two because it needs mipmaps. */
const FILTERED_SIZE = 2048;
/** The page's type, fetched here because the page's own stylesheet is still on its way. */
const LATIN = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";

/*
 * Everything is a shade of the page's own paper: `paper` is --paper exactly, and creases only ever
 * move towards a warm shadow or a warm highlight, so the sheet can never read as a different material.
 * In the dark theme the ball starts a little lighter than the page, to be seen at all.
 */
const COLOURS = {
  light: { lift: [0, 0, 0], paper: [244, 236, 216], ink: "#29231d", soft: "#5e5548", shade: [0.69, 0.61, 0.45], bright: [1, 0.98, 0.925], cast: [0.2, 0.12, 0.05], shadow: 0.42, table: { planks: ["#cdac7c", "#c8a674", "#d1b183"], grain: "#7d5a33", seam: "#5e4024" } },
  dark: { lift: [0.24, 0.215, 0.18], paper: [25, 22, 18], ink: "#ece3d0", soft: "#b3a88f", shade: [0.035, 0.03, 0.024], bright: [0.34, 0.3, 0.25], cast: [0, 0, 0], shadow: 0.7, table: { planks: ["#3a2a1e", "#35261b", "#3e2d21"], grain: "#150d08", seam: "#0e0805" } },
};

const VERTEX = `precision highp float;
attribute vec3 a_closed;
attribute vec3 a_sheet;
uniform vec2 u_size, u_center, u_flat, u_tilt;
uniform float u_open, u_zoom, u_ball, u_relief, u_pass, u_turn, u_flatten;
varying vec3 v_position;
varying vec2 v_uv;
void main() {
  v_uv = a_sheet.xy;
  vec3 c = a_closed * u_ball;
  c = vec3(c.x * cos(u_tilt.x) + c.z * sin(u_tilt.x), c.y, c.z * cos(u_tilt.x) - c.x * sin(u_tilt.x));
  c = vec3(c.x, c.y * cos(u_tilt.y) - c.z * sin(u_tilt.y), c.z * cos(u_tilt.y) + c.y * sin(u_tilt.y));
  // The edges waver and the creases stand up until the sheet has been smoothed flat.
  vec2 edge = vec2(sin(a_sheet.y * 33.0), sin(a_sheet.x * 35.0)) * 0.004 * (1.0 - u_flatten);
  vec3 f = vec3((a_sheet.xy - 0.5 + edge) * u_flat, a_sheet.z * u_relief * (1.0 - u_flatten));
  vec3 p = mix(c, f, u_open);
  p.z += sin(u_open * 3.14159265) * sin(a_sheet.x * 8.0 + a_sheet.y * 11.0) * 13.0;
  p.xy = vec2(p.x * cos(u_turn) - p.y * sin(u_turn), p.x * sin(u_turn) + p.y * cos(u_turn));
  v_position = p;
  vec2 xy = p.xy;
  if (u_pass > 0.5) xy += vec2(0.23, 0.30) * max(0.0, p.z + mix(80.0, 9.0, u_open));
  float camera = u_pass > 0.5 ? 1.0 : 1000.0 / (1000.0 - p.z);
  vec2 screen = xy * camera * u_zoom + u_center;
  gl_Position = vec4(screen.x / u_size.x * 2.0 - 1.0, 1.0 - screen.y / u_size.y * 2.0, -p.z / 500.0, 1.0);
}`;

const FRAGMENT = `#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform sampler2D u_draft, u_print, u_fine;
uniform float u_swap, u_sharp;
uniform vec3 u_shade, u_bright, u_lift, u_blank, u_cast;
uniform float u_open, u_pass;
varying vec3 v_position;
varying vec2 v_uv;
void main() {
  if (u_pass > 0.5) {
    gl_FragColor = vec4(u_cast, 1.0);
    return;
  }
  vec3 n = normalize(cross(dFdx(v_position), dFdy(v_position)));
  if (n.z < 0.0) n = -n;
  vec3 light = normalize(vec3(-0.30, -0.48, 0.82));
  float key = max(0.0, dot(n, light));
  // How far this facet is from plain paper. A flat sheet facing the viewer has a tone of exactly zero.
  float tone = mix((key - 0.62) * 1.25, (key - light.z) * 0.5, u_open);
  float amount = clamp(abs(tone) * (tone < 0.0 ? 1.15 : 1.3), 0.0, 1.0);
  // The page is printed on one side; where a fold shows the back, it is bare paper.
  // Small, the sheet is read from a filtered print. At full size every texel of the fine print falls on
  // one device pixel, which is what makes it indistinguishable from the page.
  vec3 far = mix(texture2D(u_draft, v_uv).rgb, texture2D(u_print, v_uv).rgb, u_swap);
  vec3 printed = gl_FrontFacing ? mix(far, texture2D(u_fine, v_uv).rgb, u_sharp) : u_blank;
  printed += u_lift * (1.0 - u_open);
  gl_FragColor = vec4(mix(printed, tone < 0.0 ? u_shade : u_bright, amount), 1.0);
}`;

const smooth = (value: number) => {
  const t = Math.min(1, Math.max(0, value));
  return t * t * (3 - 2 * t);
};
const zoomProgress = (u: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, (u - 0.1) / 0.9)));

function shouldPlay() {
  if (document.hidden) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    if (sessionStorage.getItem(SEEN_KEY)) return false;
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    return false;
  }
  return true;
}

function decodeMesh() {
  const bytes = Uint8Array.from(atob(PAPER_MESH), (char) => char.charCodeAt(0));
  const raw = new Int16Array(bytes.buffer);
  const vertices = new Float32Array(raw.length);
  for (let i = 0; i < raw.length; i += 6) {
    vertices[i] = raw[i] / 100;
    vertices[i + 1] = raw[i + 1] / 100;
    vertices[i + 2] = raw[i + 2] / 100;
    vertices[i + 3] = raw[i + 3] / 32767;
    vertices[i + 4] = raw[i + 4] / 32767;
    vertices[i + 5] = raw[i + 5] / 32767;
  }
  const indices: number[] = [];
  for (let y = 0; y < PAPER_ROWS; y++) {
    for (let x = 0; x < PAPER_COLS; x++) {
      const a = y * (PAPER_COLS + 1) + x;
      const [b, c, d] = [a + 1, a + PAPER_COLS + 1, a + PAPER_COLS + 2];
      indices.push(...((x + y) % 2 ? [a, b, d, a, d, c] : [a, b, c, b, d, c]));
    }
  }
  return { vertices, indices: new Uint16Array(indices) };
}

function compile(gl: WebGLRenderingContext) {
  const program = gl.createProgram();
  if (!program) return null;
  for (const [type, source] of [
    [gl.VERTEX_SHADER, VERTEX],
    [gl.FRAGMENT_SHADER, FRAGMENT],
  ] as const) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
    gl.deleteShader(shader);
  }
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

/** The hint's drawing, with everything rough about it coming from one small displacement. */
function hintMarkup(ink: string, paper: string) {
  return `<svg viewBox="0 0 ${HINT_WIDTH} ${HINT_HEIGHT}" width="${HINT_WIDTH}" height="${HINT_HEIGHT}" style="display:block;overflow:visible">
    <defs>
      <filter id="hint-rough" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="6" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.6" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <clipPath id="hint-writing"><rect data-writing x="0" y="88" width="0" height="${HINT_HEIGHT}"/></clipPath>
    </defs>
    <g filter="url(#hint-rough)">
      <g data-arrow fill="none" stroke="${ink}" stroke-linecap="round" stroke-linejoin="round">
        <path data-stroke d="${HINT_ARROW}" pathLength="1" fill="${paper}" stroke-width="2.5" stroke-dasharray="1 1" stroke-dashoffset="1"/>
        <path data-stroke d="${HINT_ARROW_SKETCH}" pathLength="1" stroke-width="1.1" opacity="0.5" stroke-dasharray="1 1" stroke-dashoffset="1"/>
      </g>
      <path d="${HINT_LETTERS}" fill="${ink}" clip-path="url(#hint-writing)"/>
    </g>
  </svg>`;
}

const layer = <T extends HTMLElement>(element: T) => {
  element.setAttribute("style", "position:absolute;inset:0;width:100%;height:100%;display:block");
  return element;
};

/** Plays the opening if it should, and finishes once `appReady` has settled and the sheet has opened. */
export function playOpening(appReady: Promise<unknown>) {
  const report = appReady.catch((error) => console.error(error));
  if (!shouldPlay()) {
    finishOpening();
    return;
  }

  const faces = [
    new FontFace("Newsreader Variable", `url(${newsreaderNormal}) format("woff2-variations")`, { style: "normal", weight: "200 800", unicodeRange: LATIN }),
    new FontFace("Newsreader Variable", `url(${newsreaderItalic}) format("woff2-variations")`, { style: "italic", weight: "200 800", unicodeRange: LATIN }),
  ];
  // These stay for good: the page's text is using them by now, and taking them away would send it back
  // to the stylesheet's copies, with a flash of fallback type while those load.
  for (const face of faces) document.fonts.add(face);

  const canvas = layer(document.createElement("canvas"));
  const shadow = layer(document.createElement("canvas"));
  const gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: true });
  const program = gl && gl.getExtension("OES_standard_derivatives") ? compile(gl) : null;
  const shadowContext = shadow.getContext("2d");
  if (!gl || !program || !shadowContext) {
    finishOpening();
    return;
  }

  const palette = document.documentElement.classList.contains("dark") ? COLOURS.dark : COLOURS.light;
  const paperCss = `rgb(${palette.paper.join(",")})`;
  // One big button, so the sheet is something a keyboard or screen reader can open as well.
  const cover = document.createElement("button");
  cover.type = "button";
  cover.setAttribute("aria-label", "Open the page");
  cover.setAttribute("style", `position:fixed;inset:0;z-index:100;width:100%;height:100%;margin:0;padding:0;border:0;outline:none;cursor:pointer;background-color:${paperCss}`);
  // The page's own grain on the bare paper around the sheet, as soon as its stylesheet arrives. The
  // sheet carries the same grain in its print.
  const table = layer(document.createElement("canvas"));
  table.style.opacity = "0";
  table.style.transition = "opacity 0.25s ease";
  const grain = layer(document.createElement("div"));
  grain.className = "paper-grain";
  grain.style.pointerEvents = "none";
  shadow.style.filter = "blur(6px)";
  shadow.style.opacity = "0";
  canvas.style.opacity = "0";
  const hint = document.createElement("div");
  hint.setAttribute("aria-hidden", "true");
  hint.setAttribute("style", `position:absolute;left:0;top:0;width:${HINT_WIDTH}px;height:${HINT_HEIGHT}px;transform-origin:${HINT_TIP.x}px ${HINT_TIP.y}px;pointer-events:none`);
  hint.innerHTML = hintMarkup(palette.ink, paperCss);
  const hintStrokes = [...hint.querySelectorAll("[data-stroke]")];
  const hintArrow = hint.querySelector("[data-arrow]")!;
  const hintWriting = hint.querySelector("[data-writing]")!;
  cover.append(table, grain, shadow, canvas, hint);
  document.body.append(cover);
  // Until it is opened the sheet is all there is, for the keyboard and for screen readers too.
  const site = document.getElementById("root");
  if (site) site.inert = true;
  cover.focus({ preventScroll: true });

  gl.useProgram(program);
  const uniform = (name: string) => gl.getUniformLocation(program, name);
  const u = {
    size: uniform("u_size"),
    center: uniform("u_center"),
    flat: uniform("u_flat"),
    tilt: uniform("u_tilt"),
    open: uniform("u_open"),
    zoom: uniform("u_zoom"),
    ball: uniform("u_ball"),
    relief: uniform("u_relief"),
    pass: uniform("u_pass"),
    turn: uniform("u_turn"),
    flatten: uniform("u_flatten"),
    swap: uniform("u_swap"),
    sharp: uniform("u_sharp"),
  };
  gl.uniform1i(uniform("u_draft"), 0);
  gl.uniform1i(uniform("u_print"), 1);
  gl.uniform1i(uniform("u_fine"), 2);
  gl.uniform3fv(uniform("u_shade"), palette.shade);
  gl.uniform3fv(uniform("u_bright"), palette.bright);
  gl.uniform3fv(uniform("u_lift"), palette.lift);
  gl.uniform3fv(uniform("u_cast"), palette.cast);
  gl.uniform3fv(uniform("u_blank"), palette.paper.map((value) => value / 255));

  const { vertices, indices } = decodeMesh();
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  for (const [name, offset] of [
    ["a_closed", 0],
    ["a_sheet", 12],
  ] as const) {
    const location = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 24, offset);
  }
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.frontFace(gl.CW);
  gl.clearColor(0, 0, 0, 0);

  const textures = [gl.createTexture(), gl.createTexture(), gl.createTexture()];
  const upload = (unit: number, source: HTMLCanvasElement, filtered: boolean) => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, textures[unit]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source);
    if (filtered) gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filtered ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  };
  // Until a print is up, all three show something rather than nothing.
  const blank = document.createElement("canvas");
  blank.width = blank.height = 2;
  const blankContext = blank.getContext("2d")!;
  blankContext.fillStyle = paperCss;
  blankContext.fillRect(0, 0, 2, 2);
  for (const unit of [0, 1, 2]) upload(unit, blank, false);

  const uploadPrint = (page: HTMLCanvasElement) => {
    upload(2, page, false);
    const small = document.createElement("canvas");
    small.width = small.height = FILTERED_SIZE;
    const paint = small.getContext("2d")!;
    paint.imageSmoothingQuality = "high";
    paint.drawImage(page, 0, 0, FILTERED_SIZE, FILTERED_SIZE);
    upload(1, small, true);
    page.width = page.height = small.width = small.height = 0;
    printed = true;
  };

  let width = 0;
  let height = 0;
  let ballScale = 1;
  let scaleUp = 1;
  let frame: SheetFrame = { side: 1, x: 0, y: 0, density: 1 };
  let printed = false;
  let tableSize = "";
  const resize = () => {
    // The covered area, which leaves out a scrollbar where the system shows one.
    width = cover.clientWidth;
    height = cover.clientHeight;
    const density = Math.min(3, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * density);
    canvas.height = Math.round(height * density);
    shadow.width = Math.round(width / 3);
    shadow.height = Math.round(height / 3);
    if (tableSize !== `${width}x${height}`) {
      tableSize = `${width}x${height}`;
      drawTable(table, width, height, density, palette.table);
    }
    ballScale = Math.max(0.72, Math.min(1, Math.min(width / 1200, height / 800))) * 1.12;
    const limit = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    const printDensity = Math.min(density, limit / (Math.max(width, height) * COVER));
    // A whole number of device pixels across, and offsets on whole device pixels, so that at full size
    // the fine print maps straight onto the screen with nothing resampled.
    const side = Math.ceil(Math.max(width, height) * COVER * printDensity) / printDensity;
    scaleUp = side / (340 * ballScale);
    // The screen sits at the top of the sheet, as the top of a page does, with a margin above it no
    // wider than the ones beside it.
    const onPixel = (value: number) => Math.round(value * printDensity) / printDensity;
    frame = { side, x: onPixel((side - width) / 2), y: onPixel(Math.min((side - width) / 2, (side - height) / 2)), density: printDensity };
    // Off the ball's lower right, pointing in at it, and narrower on a phone so the words stay on screen.
    const reach = 96 * ballScale * 0.8;
    const [tipX, tipY] = [width / 2 + reach, height / 2 + reach];
    const hintScale = Math.min(1, (width - 10 - tipX) / (HINT_WIDTH - HINT_TIP.x));
    hint.style.transform = `translate(${(tipX - HINT_TIP.x).toFixed(1)}px, ${(tipY - HINT_TIP.y).toFixed(1)}px) scale(${hintScale.toFixed(3)})`;
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  resize();
  // Comes up gently, since the bare paper colour may have been on screen for a while on a slow line.
  requestAnimationFrame(() => {
    table.style.opacity = "1";
  });

  // A scrollbar can appear once the page has content, and it changes the width without a resize event.
  const reprint = () => {
    resize();
    return printPage(frame, Math.round(frame.side * frame.density), paperCss).then(uploadPrint);
  };
  let ready = false;
  const onResize = () => {
    if (ready) void reprint();
    else resize();
  };
  window.addEventListener("resize", onResize);

  let opened = false;
  let skipped = false;
  let finished = false;
  let progress = 0;
  let handover = 0;
  let swap = 0;
  let hintLeft = 1;
  let unfolding = false;
  let animation = 0;
  let safety = 0;
  let begun = 0;
  let last = 0;

  // Frames stop in a tab that has gone to the background; once asked for, the page must still appear.
  const keepPromise = () => {
    if (opened && ready && !safety) safety = window.setTimeout(finish, 6000);
  };
  const open = () => {
    opened = true;
    keepPromise();
  };
  /** The first press opens the sheet and a second hurries it along. */
  const press = () => {
    if (opened) skipped = true;
    open();
  };
  // Scrolling means the visitor wants in. The page has to stay where it was printed from, though, so
  // it opens the sheet instead of moving anything.
  const hold = (event: Event) => {
    event.preventDefault();
    open();
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
    event.preventDefault();
    press();
  };
  window.addEventListener("pointerdown", press);
  window.addEventListener("wheel", hold, { passive: false });
  window.addEventListener("touchmove", hold, { passive: false });
  window.addEventListener("keydown", onKey);

  const finish = () => {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(animation);
    window.clearTimeout(safety);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("pointerdown", press);
    window.removeEventListener("wheel", hold);
    window.removeEventListener("touchmove", hold);
    window.removeEventListener("keydown", onKey);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    cover.remove();
    if (site) site.inert = false;
    finishOpening();
  };

  // The ball is not shown until it can carry the page's own type, so that the type never changes on it.
  const typeLoaded = Promise.race([Promise.allSettled(faces.map((face) => face.load())), new Promise((resolve) => window.setTimeout(resolve, TYPE_WAIT))]);
  void typeLoaded.then(() => {
    if (finished) return;
    upload(0, draftPage(frame, FILTERED_SIZE, paperCss, palette.ink, palette.soft), true);
    begun = last = performance.now();
    animation = requestAnimationFrame(tick);
    void report
      .then(reprint)
      .catch((error) => console.error(error))
      .then(() => {
        ready = true;
        keepPromise();
        // Pictures can finish arriving while the sheet waits; if they do, print them on it as well.
        if (document.readyState !== "complete") {
          window.addEventListener("load", () => {
            if (!unfolding && !finished) void reprint();
          }, { once: true });
        }
      });
  });

  const draw = (now: number) => {
    const age = (now - begun) / 1000;
    const open = smooth(progress / 0.58);
    const zoomed = zoomProgress(progress);
    const arrive = 1 - Math.pow(1 - Math.min(1, age / 0.35), 3);
    const appear = Math.min(1, age / 0.16);
    canvas.style.opacity = `${appear}`;

    const restingY = height / 2 - 10 * (1 - arrive);
    const landedX = frame.side / 2 - frame.x;
    const landedY = frame.side / 2 - frame.y;
    gl.uniform2f(u.size, width, height);
    gl.uniform2f(u.center, width / 2 + (landedX - width / 2) * zoomed, restingY + (landedY - restingY) * zoomed);
    const flatSide = frame.side / scaleUp;
    gl.uniform2f(u.flat, flatSide, flatSide);
    gl.uniform2f(u.tilt, Math.sin(age * 0.9) * 0.16 * (1 - open), Math.sin(age * 0.6 + 1) * 0.1 * (1 - open));
    gl.uniform1f(u.open, open);
    gl.uniform1f(u.zoom, Math.pow(scaleUp, zoomed));
    gl.uniform1f(u.ball, ballScale);
    gl.uniform1f(u.relief, (flatSide / PAPER_COLS) * 0.16);
    gl.uniform1f(u.turn, -0.1 * (1 - open));
    gl.uniform1f(u.flatten, smooth((zoomed - 0.35) / 0.65));
    gl.uniform1f(u.swap, smooth(swap));
    gl.uniform1f(u.sharp, smooth((Math.pow(scaleUp, zoomed - 1) - 0.55) / 0.3));

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(u.pass, 1);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    shadowContext.clearRect(0, 0, shadow.width, shadow.height);
    shadowContext.drawImage(canvas, 0, 0, shadow.width, shadow.height);
    shadow.style.opacity = `${palette.shadow * appear * (1 - zoomed * zoomed * 0.5)}`;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(u.pass, 0);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
  };

  const drawHint = (age: number, dt: number) => {
    if (!hintLeft) return;
    const since = age - HINT_START;
    const stroke = smooth(since / HINT_ARROW_TIME);
    for (const path of hintStrokes) path.setAttribute("stroke-dashoffset", `${1 - stroke}`);
    hintWriting.setAttribute("width", `${HINT_WIDTH * smooth((since - HINT_ARROW_TIME * 0.7) / HINT_LETTERS_TIME)}`);
    // Once drawn, the arrow leans in towards the ball every few seconds.
    const lean = since > 1.6 ? 3.5 * Math.pow(Math.max(0, Math.sin((since - 1.6) * 1.9)), 4) : 0;
    hintArrow.setAttribute("transform", `translate(${(-lean * 0.7).toFixed(2)} ${(-lean * 0.7).toFixed(2)})`);
    if (opened) {
      hintLeft = Math.max(0, hintLeft - dt / 0.16);
      hint.style.opacity = `${hintLeft}`;
      if (!hintLeft) hint.remove();
    }
  };

  const tick = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const speed = skipped ? SKIP_SPEED : 1;
    if (printed) swap = Math.min(1, swap + (dt / SWAP) * speed);
    if (!unfolding && opened && ready && (!printed || swap >= 1)) unfolding = true;
    if (unfolding) progress = Math.min(1, progress + (dt / UNFOLD) * speed);
    draw(now);
    drawHint((now - begun) / 1000, dt);
    if (progress >= 1) {
      // Flat and in register with the page, so the sheet can simply give way to it.
      handover = Math.min(1, handover + (dt / HANDOVER) * speed);
      cover.style.pointerEvents = "none";
      cover.style.opacity = `${1 - smooth(handover)}`;
      if (handover >= 1) {
        finish();
        return;
      }
    }
    animation = requestAnimationFrame(tick);
  };
}
