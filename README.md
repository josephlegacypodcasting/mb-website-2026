# Market Better — website (Mike's design)

Next.js rebuild of the design Mike put together at
[market-better.lovable.app](https://market-better.lovable.app/).

It is a **rebuild, not a Lovable export**. The palette was lifted from the original's
`:root` (stored there as HSL triplets, converted to hex here) and the copy, spacing,
clip-path funnel and ROI formula were taken from the original rather than eyeballed, so
this matches it rather than approximating it.

## Run it

```bash
npm install
npm run dev
```

<http://localhost:3000>

## Routes

| Route | Page |
|---|---|
| `/` | One system. Marketing + Sales. |
| `/how-it-works` | One funnel. Four steps. |
| `/pricing` | One engine, two ways to pay |
| `/roi-calculator` | Pipeline / ROI model |

## Design tokens

Defined as a Tailwind 4 `@theme` block in [`app/globals.css`](app/globals.css) — there is
no `tailwind.config.ts`. The `mk-` prefix is a leftover from the project this was
extracted out of, where these tokens had to coexist with a second theme.

| Token | Hex | Role |
|---|---|---|
| `mk-bg` | `#efeadc` | Page background (sand) |
| `mk-fg` | `#161519` | Body text |
| `mk-accent` | `#ff4124` | Accent / CTAs |
| `mk-primary` | `#432ead` | Purple sections |
| `mk-secondary` | `#ada4d0` | Muted purple, slider track |
| `mk-card` | `#ffffff` | Cards |
| `mk-muted-fg` | `#605e68` | Secondary text |
| `mk-border` | `#b6b5c0` | Hairlines |
| `mk-panel-ink` | `#121212` | Featured pricing panel |
| `mk-peach` | `#ffd9cc` | Second pricing card border |

Typeface is **Poppins**, loaded via `next/font/google`. Headings carry no size of their
own — every one is sized with a utility class, which is how the original is built.

Two dependencies the original pulls in are deliberately not reproduced:

- **Radix slider** → a native `<input type="range">` with a `linear-gradient` track driven
  by an inline `--fill` custom property. Same look, no dependency.
- **lucide-react** → the three icons actually used are inlined in
  [`components/icons.tsx`](components/icons.tsx).

## Contact form

The form posts to `/api/lead`, a server route that forwards to a LeadConnector
(GoHighLevel) inbound webhook. Set the destination before running it:

```bash
cp .env.example .env.local   # then fill in LEAD_WEBHOOK_URL
```

`.env.local` is gitignored, and the variable is **not** `NEXT_PUBLIC_` prefixed, so the
URL never reaches the client bundle. The webhook is an unauthenticated capability —
anyone holding it can write leads into the CRM — and this repo is public, so it has to
stay in the environment. On Vercel, set it in the project's environment variables; if it
is missing the route returns a 500 and the form shows an error rather than pretending to
have sent something.

This is deliberately **not** what the Lovable original does. That writes the same fields
straight into a Supabase `lead_submissions` table using a publishable key baked into its
public bundle, which leaves the table open to anyone.

Verified end-to-end against a local echo server rather than the live CRM, so no test
leads were written: valid submissions return 200 with the expected payload, missing or
malformed fields return 400, over-long fields are truncated to 300 characters, and an
unreachable webhook returns 502 — the form then shows an error and keeps what the user
typed instead of clearing it.

## Verified

Production build is clean — all four pages prerender as static, with `/api/lead` served
on demand. Checked at 375px and
768px on every route by sweeping the DOM and comparing each element's
`getBoundingClientRect().right` against `clientWidth`: zero overflowing elements,
`scrollWidth === clientWidth`.

One defect inherited from the original was fixed: the three green pills in the "judged by
meetings booked" row were forced onto a single line at every width, measuring 452px inside
a 375px viewport. Because the section clips overflow, the third pill was silently cut off
rather than scrollable. They now wrap below `lg`.

ROI model cross-checked against the original: ACV $50,000, 20 appointments/month, 25%
close, $7,500 retainer, $600 per appointment, 50% renewal → $3,000,000 year one,
$1,500,000 year two, $234,000 invested, **19.2x**.

## Provenance

Extracted from the Market Better site-migration project, where this design lived at
`/mike` alongside a separate in-house rebuild. Routes were moved to the root here, and the
`.theme-mike` wrapper that kept the two themes apart was dropped — the theme now sits on
`body`. The other repo keeps both versions.
