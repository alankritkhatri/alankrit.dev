# Personal Site

This project is a minimal, data-driven personal site built with **React + TypeScript + Vite + Tailwind**. All editable content lives in a single JSON file: `src/data/content.json`.

## Edit Content

Open `src/data/content.json` and change any values. Key fields:

- `navLinks`: top navigation.
- `profile`: hero copy + banner metadata.
- `listening`: small status in the nav bar.
- `blogPosts`: entries with `labels` + optional `flag` badge.
- `oss`, `projects`, `work`: cards/lists rendered verbatim.
- `social`: drives the left rail initials.
- `contact.email`: powers the vertical mail link.

You can remove or add any array items; components adapt automatically.

## Run

```bash
npm install
npm run dev
```

## Customization

- Tailwind classes live inline in `App.tsx` for simplicity.
- Replace the banner placeholder by adding an image at `public/banner.jpg`.
- Extend styling via `tailwind.config.cjs`.

## License

No explicit license; treat as personal proprietary code unless you add one.
