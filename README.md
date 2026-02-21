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

## Attribution

If you like this homepage, feel free to fork and reuse it with attribution.
Please add a short credit line that links back to this site or the repository.
