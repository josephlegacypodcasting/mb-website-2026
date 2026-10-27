# Market Better — corporate site

**This is the approved site.** Joseph signed off on this design on 2026-10-18, choosing
it over an in-house alternative, so this repo is what gets deployed and worked on from
here. The alternative and the full comparison live in `mb_official_website`, which is
now a historical record.

Next.js rebuild of the design Mike put together at
[market-better.lovable.app](https://market-better.lovable.app/).

It is a **rebuild, not a Lovable export**. The palette was lifted from the original's
`:root` (stored there as HSL triplets, converted to hex here) and the copy, spacing,
clip-path funnel and ROI formula were taken from the original rather than eyeballed, so
this matches it rather than approximating it.

## Project status

The site is the time-pressing half of a two-part request from Mike McGrath (Slack,
2026-10-15); the other half, the Legacy Media → Market Better email migration, is
tracked separately but shares the domain decisions made here.

**Local review first, then deploy, domains last** — so that "is the site right?", "does
it deploy?" and "is the cutover safe?" never have to be debugged at the same time.

| Phase | Goal | State |
|---|---|---|
| 1 | Rebuild locally, pick a direction | **Done — this design approved 2026-10-18** |
| 2 | v2 content (team page, design polish) | Team page shipped; design polish still backlog |
| 3 | Deploy to Vercel | **Live** — <https://marketbetter.io> (form needs `LEAD_WEBHOOK_URL`) |
| 4 | Domain cutover: site → `marketbetter.xyz`, Show relocated | Deferred |
| 5 | Consolidate onto `marketbetter.io` | Deferred |
| 6 | Email migration LM → MB on `.io` | Separate project, depends on Phase 5 |

Before Phase 3, `LEAD_WEBHOOK_URL` must be set in the Vercel project — see
[Contact form](#contact-form).

## Docs

- [Brief](docs/01-brief.md) — Mike's request verbatim, plus interpreted scope
- [Current state audit](docs/02-current-state.md) — DNS, hosting, what is actually live today
- [Execution plan](docs/03-plan.md) — phased steps, with the `/show` URL decision called out
- [Open questions](docs/04-open-questions.md) — what is still needed from Mike / Alej / Anna
- [Design system](docs/05-design-system.md) — the shipping tokens, and the brand research behind them
- [Local dev](docs/06-local-dev.md) — how to run it, what is verified, what is still missing

## Run it

```bash
npm install
npm run dev -- -p 3200
```

<http://localhost:3200> — port 3200 by convention, so it never clashes with
`mb_official_website` on 3100.

## Routes

| Route | Page |
|---|---|
| `/` | One system. Marketing + Sales. |
| `/how-it-works` | One funnel. Four steps. |
| `/pricing` | One engine, two ways to pay |
| `/roi-calculator` | Pipeline / ROI model |
| `/team` | One engine. One team behind it |

## Team page

`/team` renders [`lib/team.ts`](lib/team.ts) — eighteen people, one 4:5 portrait each in
`public/team`, picked so every frame is a neutral-background studio shot rather than a
mix of square avatars on coloured ones.

Everyone has a role. Mike's and Anna's come from the Show's existing "The Team" page on
`marketbetter.xyz`; the other sixteen come from Joseph's internal role table
(2026-10-27). That table assigns people to roles rather than the other way round, so
titles repeat — four A/V Editors, three Content Strategists, two of most of the rest —
and they are spelled as it spells them, not as its shorter companion list does.

Two conflicts in those sources are resolved in `lib/team.ts` and flagged to Joseph:
Carol-Lynne is a Content Strategist in the role table but a Producer in the companion
list (the table wins, being the one that defines the roles), and Anna is an Account
Manager in that same table but Director of Marketing on the published Show page (the
Show page wins). A role left blank would render as name-only rather than as a guess, so
that remains the way to handle anyone whose title is unsettled.

People in the role table with no headshot, and so not on this page: Grant, Mari and
Osmond, Louis (Anfloy), and an unnamed Social Media Manager. The Show's team page
additionally lists Logan Lyles (Lead Host) and Eric West (Director of Sales).

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

## Favicon

`app/icon.png` — Next picks this up by convention and injects the `<link rel="icon">`.

The full stacked wordmark, ink on the brand sand, matching the header. Margins are
tight (6%) so the mark fills as much of the square as it can.

The sand ground is not decoration: `public/mb-logo.png` is transparent, so without it
the near-black wordmark would disappear against a dark tab strip.

Known limit, accepted deliberately: a two-line wordmark reads cleanly at 32px (retina
tabs, bookmarks, history) but blurs at 16px, which is what a tab renders on a 1x
display. An `m`-over-`b` monogram cut from the same letterforms stays sharp at both and
is the fallback if the blur ever becomes annoying.

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

### ROI figures ride along

If a visitor moves anything in the ROI calculator, what they modelled is attached to the
contact form they submit afterwards. The calculator and the form live in different parts
of the tree, so a `RoiProvider` in the root layout carries the snapshot between them —
through React state across client navigation, and through `sessionStorage` across a full
reload. It is per-tab and never leaves the browser except on an actual submission.

Only a *touched* calculator is reported: a lead with `roi_used: false` means the visitor
did not engage with it, not that they modelled all zeroes.

Fields arrive flattened (`roi_acv`, `roi_multiple`, `roi_summary`, …) because
GoHighLevel maps inbound webhook fields one at a time and nested paths are awkward
there. `roi_summary` is one human-readable line for whoever picks the lead up. The block
is client-supplied, so the server coerces every field and drops the whole snapshot if
any of it is missing or malformed — a half-populated model would read as a real one.

`roi_cost_basis_months` is included because this build reproduces the original's
cost basis: it divides 24 months of revenue by **12** months of cost while still
labelling the result "24-month projected ROI". That is the original's behaviour, kept
deliberately, but it means the multiple is not comparable to a differently-based one.

Verified end-to-end against a local echo server rather than the live CRM, so no test
leads were written: valid submissions return 200 with the expected payload, missing or
malformed fields return 400, over-long fields are truncated to 300 characters, and an
unreachable webhook returns 502 — the form then shows an error and keeps what the user
typed instead of clearing it.

## Verified

Production build is clean — all five pages prerender as static, with `/api/lead` served
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
