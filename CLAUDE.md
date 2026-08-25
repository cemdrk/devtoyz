# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

devtoyz — a pocket workbench of client-side developer utilities (Base64, JSON
format/minify, UUID v4, SHA hashes, URL encode/decode, Unix timestamp).
Everything runs in the browser: no backend, no API calls, nothing leaves the
page. Built with Vue 3 (`<script setup>` SFCs) + Vite, deployed as a static
site to GitHub Pages at https://cemdrk.github.io/devtoyz/.

## Commands

```bash
npm install
npm run dev        # local dev server
npm run build       # outputs to dist/
npm run preview     # serve the production build locally
```

There is no lint, format, or test tooling configured in this repo — don't
assume `npm run lint`/`npm test` exist.

## Architecture

**Single registry drives everything.** `src/tools.js` exports a `tools`
array (slug, name, tag, blurb, view component). `src/router.js` maps over it
to generate routes, and `App.vue`'s header nav and `Home.vue`'s card grid
both render straight from the same array. To add a tool: create
`src/views/MyTool.vue`, import it in `tools.js`, add one entry — nothing
else needs wiring.

**Each tool view is self-contained**: local `ref`/`computed` state, no
shared store (no Vuex/Pinia — none is needed since each tool is
independent and stateless across navigation). Views wrap their content in
the shared `ToolLayout` component (breadcrumb + heading + description slot)
and use `CopyButton` for clipboard actions. Follow the pattern in
`src/views/Base64.vue` when adding a new one: a mode toggle (if relevant),
an input `field`, an output `field` with a `CopyButton`, and an `error` ref
surfaced inline rather than thrown.

**Hash-based routing is deliberate.** `router.js` uses
`createWebHashHistory`, producing URLs like `/#/base64`. This is required
because GitHub Pages is a static host with no server-side rewrites — normal
history-mode deep links 404 on refresh. Don't switch to
`createWebHistory` without re-solving that problem.

**Base path is coupled to the repo name.** `vite.config.js` sets
`base: '/devtoyz/'` to match `cemdrk.github.io/devtoyz`. If the repo is
renamed or moved to a custom domain, this must change alongside the deploy
workflow's expectations.

**Styling** is a single global stylesheet (`src/style.css`) using CSS
custom properties for the palette/spacing (`--bg`, `--text`, `--amber`,
`--cyan`, `--radius`, `--maxw`, etc.) — no CSS-in-JS, no per-component
scoped styles beyond what's already in the SFCs. Reuse the existing tokens
rather than hardcoding new colors.

## Deployment

`.github/workflows/deploy.yml` triggers on every push to `main`: it
installs deps, runs `npm run build`, and publishes `dist/` to GitHub Pages
via `actions/deploy-pages`. Notable quirk: if `package-lock.json` is
missing, the workflow runs `npm install` and commits the generated lock
file back to `main` with `[skip ci]` before continuing — so `npm ci` is
the steady-state path, `npm install` is the bootstrap fallback.
