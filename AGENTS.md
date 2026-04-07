# AGENTS

Short operational guide for this repo. See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the app structure.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
npm run serve

npm test
npm run test:watch
npm run test:coverage
npm run test:e2e
npm run test:e2e:ui
```

## What To Touch

- App bootstrap: `js/main.js`
- Algorithms and storage: `js/core/`
- Graph rendering and parsing: `js/graph/`
- UI behavior: `js/ui/`
- Shared helpers: `js/utils/`
- Styles: `css/`

## Verification

- Run `npm test` for unit coverage after logic changes.
- Run `npm run test:e2e` for user-flow changes when practical.
- Run `npm run build` before shipping doc or code changes that may affect bundling.
- For parser and algorithm changes, check `js/core/*.test.js` and `js/graph/sigma-controller.test.js`.
- For UI changes, verify both desktop and mobile layouts.
- Manual smoke test: load the app, enter `[a,b],[b,c],[c,a]`, run calculate, then confirm the results panel and graph canvas both update.

## Styling

- Edit the source CSS files in `css/`; regenerate `css/bundle.css` instead of editing it directly.
- The visual system uses orange accents, dark backgrounds, uppercase labels, and mostly square corners.
- Shared tokens such as spacing, sizes, transitions, z-indexes, and colors live in `css/base.css`.
