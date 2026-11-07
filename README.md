# Academic Personal Website

A three-page academic website (Home / Publications / CV) with a minimal, premium UI and smooth animations.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Content Editing

- Profile: `src/content/profile.ts`
- CV (education/intern/skills): `src/content/cv.ts`
- Publications: `src/content/publications.ts`

The publication screenshots are placeholders generated from prompts. You can later replace them with real figures.

## GitHub Pages

Recommended setup:

1. Create a repository named `username.github.io` (replace `username` with your GitHub username).
2. Push this project to the repository's `main` branch.
3. In GitHub repository settings: `Settings` → `Pages` → set source to `GitHub Actions`.

Notes:
- This project uses `HashRouter` so routing works on GitHub Pages without extra 404 rewrites.
- `vite.config.ts` sets `base: './'` to ensure assets load correctly under static hosting.

## Credits

- Type: [Newsreader](https://fonts.google.com/specimen/Newsreader) and [Courier Prime](https://fonts.google.com/specimen/Courier+Prime). The note on the opening sheet is outlined from [Covered By Your Grace](https://fonts.google.com/specimen/Covered+By+Your+Grace) by Kimberly Geswein (SIL Open Font License 1.1).
- The opening sheet (`src/opening/`) is adapted from LeiBox's [Crumpled Paper](https://leibox.pantoria.cn/docs/animations/crumpled-paper), design reference by Matt: https://x.com/insporadesign/status/2113586239110828465/video/1
- The vine beside selected text (`src/components/MarginVine.tsx`) follows the selection logic of LeiBox's [Selection Flower](https://leibox.pantoria.cn/docs/animations/selection-flower), design reference by Omerico: https://x.com/omer_assa/status/2083862523640496179/video/1
- Posters are made with [paper2humanist-poster](https://github.com/fantiehan/paper2humanist-poster).

## Attribution

If you like this homepage, feel free to fork and reuse it with attribution.
Please add a short credit line that links back to this site or the repository.
