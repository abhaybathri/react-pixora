# Pixora — Free Photo Gallery

A production-ready photo gallery built with React + Vite + Tailwind CSS v4.

## Features

- Browse ~300 free photos from [Lorem Picsum](https://picsum.photos)
- Dark / light mode (respects system preference, persists to localStorage)
- Masonry grid layout with skeleton loading
- Lightbox modal with keyboard navigation (← → Esc)
- Browse and filter by author (all authors loaded globally)
- Search across all photos by author name
- Real file download (blob fetch, not just open-in-tab)
- Error boundary — app never goes fully blank
- Fully paginated local navigation

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS v4 (Vite plugin)

## Getting Started

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build      # outputs to /dist
npm run preview    # preview production build locally
```

### Vercel (recommended)

Push to GitHub and import the repo in [vercel.com](https://vercel.com). Zero config needed — `vercel.json` handles SPA routing and security headers.

### Netlify

`public/_redirects` handles SPA routing automatically.

## Environment

No required environment variables. The app uses the public [Picsum Photos API](https://picsum.photos/v2/list).
