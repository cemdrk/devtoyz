# HTTP Client tool — design

## Purpose

Add a new devtoyz tool (like a minimal firecamp.dev) that lets the user send
a GET request from the browser and inspect the response — URL, query
params, headers, status, response headers, and body. Client-side only, no
backend/proxy, consistent with the rest of the app.

## Scope

- GET requests only. No other HTTP methods, no request history/collections,
  no auth helpers, no request body editor.
- Requests run directly from the user's browser via `fetch()`. There is no
  server-side proxy, so requests are subject to standard browser CORS
  restrictions — this is a known, accepted limitation, not a bug to work
  around.

## Components

### `src/views/HttpClient.vue`

New view registered in `src/tools.js`:
- slug: `http`
- name: `HTTP Client`
- tag: `network`
- blurb: short description of sending GET requests and inspecting the
  response from the browser

Follows the existing pattern used by `Base64.vue` etc.: wrapped in
`ToolLayout`, local `ref`/`computed` state, no shared store, errors
surfaced inline via an `error` ref rather than thrown.

Layout (single page, stacked sections, no tabs — consistent with the rest
of the app):

1. **URL row** — a static `GET` badge (method is fixed, no dropdown), a URL
   text input, and a **Send** button.
2. **Query Params** section — dynamic key/value row editor (add/remove
   rows). Rows with an empty key are ignored when building the request.
3. **Headers** section — same dynamic key/value row editor as Params.
4. A computed **final URL preview** shown above Send, combining the URL
   field's own query string (if any) with the Params rows via
   `URLSearchParams`, so the user sees exactly what will be requested.
5. **Response** section (shown after a request completes):
   - Status line: e.g. `200 OK · 143ms`
   - Collapsible response headers list
   - Body panel with `CopyButton`; auto-pretty-printed via
     `JSON.stringify(parsed, null, 2)` if the body parses as JSON,
     otherwise shown raw
   - Inline `error` div (same convention as other tools) if the request
     fails

### `src/components/KeyValueEditor.vue`

New shared component used by both the Params and Headers sections, to
avoid duplicating the dynamic row-list UI twice. Takes a `v-model` array of
`{ key, value }` rows; renders inputs, a remove button per row, and an
add-row affordance. Plain Vue 3 (`ref`/`reactive`), no new dependencies.

## Request/response flow

**Building the request:**
- Query params: non-empty-key rows from the Params editor are appended to
  the URL via `URLSearchParams`. The URL field itself may already contain
  a query string — both merge into the final URL.
- Headers: non-empty-key rows from the Headers editor become the `fetch`
  `headers` object.

**Sending:**
- `Send` calls `fetch(finalUrl, { method: 'GET', headers })`, timed with
  `performance.now()`.
- A `loading` ref disables the Send button and shows a "Sending…" state
  while in flight.
- On success: read `response.status`, `response.statusText`, iterate
  `response.headers`, and read the body as text. If it parses as JSON,
  pretty-print it; otherwise show as-is.
- On failure (network error, CORS block, invalid URL — `fetch` rejects
  indistinguishably for all of these): catch and set `error` to the raw
  error message plus a static explanatory note:

  > This usually means the target server doesn't allow cross-origin
  > requests from the browser (CORS), or the URL/network is unreachable.
  > This tool makes requests directly from your browser — there's no
  > server-side proxy.

## Out of scope

- Non-GET methods, request body editing, auth helpers
- Request history, saved collections, environments/variables
- Special CORS detection/bypass logic beyond the static explanatory note
- New dependencies — implemented with plain Vue 3 + native `fetch`/`URL`/
  `URLSearchParams`
