# EULER

EULER is a browser-based graph theory explorer for building graphs, visualizing them with Sigma.js, and calculating Euler paths, Euler circuits, and Chinese Postman tours for weighted graphs.

It is built around the classic Euler path problem and the broader idea of making graph behavior easier to see, test, and understand in the browser.

Live site: https://aannoo.github.io/euler-path-explorer/

## Quick Start

```bash
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:8888`.

## Commands

```bash
npm run dev            # local development
npm run build          # production build into dist/
npm run preview        # preview the production build
npm run serve          # simple static server on port 8000

npm test               # Vitest unit tests
npm run test:watch     # Vitest in watch mode
npm run test:coverage  # Vitest coverage run
npm run test:e2e       # Playwright end-to-end tests
npm run test:e2e:ui    # Playwright UI runner
```

## What The App Does

- Accepts graph input as edge lists in text mode
- Supports a visual editing mode backed by the same graph state
- Renders graphs with Sigma.js and Graphology
- Detects Euler paths and Euler circuits with Hierholzer's algorithm
- Uses a Chinese Postman pass for weighted graphs
- Saves user graphs in `localStorage` and ships built-in examples
- Provides separate desktop and mobile interaction models

## Project Structure

```text
.
├── index.html
├── js/
│   ├── main.js
│   ├── core/
│   ├── graph/
│   ├── ui/
│   └── utils/
├── css/
├── docs/
└── tests/
    └── e2e/
```

## Docs

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): technical architecture
