# devtoyz

A pocket workbench of client-side developer utilities. Everything runs in the
browser — no backend, nothing leaves the page. Built with Vue 3 + Vite and
deployed as a static site to GitHub Pages.

Live: https://cemdrk.github.io/devtoyz/

## Tools included

Base64 · JSON format/minify · UUID v4 · SHA hashes · URL encode/decode · Unix timestamp

## Local development

```bash
npm install
npm run dev
```

Open the printed localhost URL. During dev the base path is handled for you.

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

## Deploy

Deployment is automatic. Every push to `main` triggers the workflow in
`.github/workflows/deploy.yml`, which builds the site and publishes `dist/`
to GitHub Pages.

One-time setup in the repo: **Settings → Pages → Build and deployment →
Source: GitHub Actions.**

### Important: base path

The site lives at `cemdrk.github.io/devtoyz`, so `vite.config.js` sets
`base: '/devtoyz/'`. If you rename the repo or move to a custom domain
(e.g. `devtoyz.dev`), change `base` to `'/new-name/'` or `'/'` accordingly.

### Why hash routing

Routes use `createWebHashHistory` (URLs look like `/#/base64`). On a static
host, normal history-mode deep links 404 on refresh because the server has no
file at that path. Hash mode avoids that with zero extra config.

## Adding a tool

1. Create `src/views/MyTool.vue` (copy an existing one as a template — they
   all use the shared `ToolLayout` and `CopyButton` components).
2. Register it in `src/tools.js`.

That single registry drives the home grid, the router, and the header nav —
nothing else to wire up.
