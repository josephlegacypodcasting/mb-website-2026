# Local development

**This is deployed and public** (2026-10-18). The design was approved that day, and the
Vercel project `legacy-medias-projects/mb-website-2026` was already connected to the
GitHub repo, so every push to `main` deploys automatically — no CLI step, nothing to run
by hand.

Live at **<https://marketbetter.io>** and **<https://mb-website-2026.vercel.app>**. The
custom domain was attached outside this project's records; Vercel lists three more
domains on the Production environment that have not been audited yet.

`LEAD_WEBHOOK_URL` is set on the Production environment as a **Secret** type, added
with `vercel env add` rather than through the dashboard — see the gap notes below for
why the dashboard route was a dead end.

## Run it

```bash
npm install
npm run dev -- -p 3200
```

Then open <http://localhost:3200>.

| Route | Page |
|---|---|
| `/` | One system. Marketing + Sales. |
| `/how-it-works` | One funnel. Four steps. |
| `/pricing` | One engine, two ways to pay |
| `/roi-calculator` | Pipeline / ROI model |

The contact form needs `LEAD_WEBHOOK_URL` — see [Contact forms](#contact-forms) below, or
it will error on submit.

Production build check: `npm run build`.

## This repo lives on the internal disk, deliberately

Unlike `mb_official_website`, which sits on the TOSHIBA EXT drive, this one is at
`~/mb-website-2026`. That matters more than it sounds: the external drive is NTFS through
a third-party driver, where writing 300 small files took **2.67s vs 0.035s** internally —
roughly 76x slower. A Next.js `node_modules` is ~30k files, so installs and dev-server
file watching there are painfully slow, and that driver is also a known source of
spurious file-watching failures.

The other repo works around this with a `node_modules` symlink to `~/.mb-node-modules`.
**This repo needs no such workaround** — `node_modules` is a plain directory. Keep the
repo on the internal disk and that stays true.


## Stack

- Next.js 16.4.2 (App Router), React 19, TypeScript
- Tailwind CSS 4 (CSS-first config in `app/globals.css`, no `tailwind.config.ts`)
- Poppins via `next/font/google`

**On versions:** the initial scaffold pinned Next 15.5.4 + Tailwind 3, which `npm audit`
flagged with a **critical RCE in the React flight protocol** plus a high-severity DoS in
Tailwind 3's `braces` dependency chain. Upgrading to Next 16.4.2 and Tailwind 4 clears both
— `npm audit` now reports **0 vulnerabilities**. Keep it that way; don't downgrade to Tailwind 3
for the sake of the old JS config format.

## Verified locally

All figures below were read off the running page or measured programmatically, not
assumed from the source.

- `npm run build` — compiles clean; the five pages prerender static, `/api/lead` is
  served on demand
- All routes return HTTP 200 on the dev server, no console errors

| Checked | Expected (Lovable) | Measured |
|---|---|---|
| Page background | `#efeadc` | `rgb(239, 234, 220)` ✓ |
| Body text | `#161519` | `rgb(22, 21, 25)` ✓ |
| Footer / contact band | `#432ead` | `rgb(67, 46, 173)` ✓ |
| Body typeface | Poppins | `Poppins` ✓ |
| h1 size / weight / tracking | `text-9xl` / 600 / none | `128px` / `600` / `normal` ✓ |
| Headers rendered | 1 | 1 ✓ |

**Responsive.** Checked at 375px and 768px on every route by sweeping the DOM and
comparing each element's `getBoundingClientRect().right` against `clientWidth`: zero
overflowing elements, `scrollWidth === clientWidth`. The logo renders 63×36 at 375px and
70×40 at 768px.

One defect inherited from the Lovable original was fixed in the process: the three pills
in the "judged by meetings booked" row were forced onto a single line at every width,
measuring 452px inside a 375px viewport. Because the section clips overflow, the third
pill was silently cut off rather than scrollable — a screenshot would not have shown it.
They now wrap below `lg`.

**ROI model**, cross-checked arithmetically against the original rather than read off the
screen: ACV $325,000, 15 appointments/month, 40% close, $3 retainer, $40/appointment, 55%
renewal → 6.0 deals/mo, 72 deals year 1, $23,400,000 year 1, 39.6 renewals, $12,870,000
year 2, $7,236 invested, **5012.4x** ✓ — matching Mike's design exactly, inflated cost
basis and all (see the gap below).


## Contact forms

Both versions post to `/api/lead`, which forwards server-side to the LeadConnector
webhook. It runs on the server for two reasons: the webhook URL is an unauthenticated
capability and both repos are public, and a browser POST with a JSON content type
triggers a CORS preflight the webhook does not answer.

Set it up locally by copying `.env.example` to `.env.local` and filling in:

```
LEAD_WEBHOOK_URL=https://services.leadconnectorhq.com/hooks/…
```

`.env.local` is gitignored. Do **not** rename the variable to `NEXT_PUBLIC_*` — that
inlines it into the public client bundle.

### What the ROI calculator contributes

If a prospect moves anything in the ROI calculator, what they modelled rides along with
the contact form they submit afterwards. The calculator sits on its own page and the
form lives in the footer, so a `RoiProvider` in the root layout carries the snapshot
between them
(`components/roi-context.tsx`). It survives client-side navigation through React
state and a full reload through `sessionStorage`, which is per-tab and never leaves the
browser except on an actual submission.

**Only a touched calculator is reported**, which is what makes `roi_used: false` mean
"did not engage with it" rather than "modelled all zeroes". Keep that guard if non-zero
defaults are ever introduced.

**A submission consumes the snapshot.** `clearRoi()` runs on success, so the figures are
attached to exactly one lead. Without it the snapshot outlived the enquiry that produced
it and the *next* submission from the same tab silently inherited those numbers — a lead
would arrive looking like it had modelled figures it never touched, which is worse than
sending nothing. Found in production use on 2026-10-18 and fixed.

The trade-off: if a visitor submits twice from one tab with the calculator still filled
in on screen, the second lead carries no figures. That is the safe direction to fail —
`roi_used: false` is honest, whereas stale numbers actively mislead whoever picks the
lead up.

Fields are flattened to prefixed top-level keys (`roi_acv`, `roi_multiple`,
`roi_summary`, …) because GoHighLevel maps inbound webhook fields one at a time and
nested paths are awkward to wire up there. `roi_summary` is a single human-readable line
so whoever picks the lead up sees the context without expanding fifteen custom fields.

`roi_cost_basis_months` travels with the numbers because **this build divides 24 months
of revenue by only 12 months of cost** while still labelling the result "24-month
projected ROI" — reproduced from Lovable. The multiple is therefore not comparable to a
correctly-based one, and roughly double what it would otherwise be. See the gap below.

### Verification

Run against a local echo server rather than the live CRM, so no test leads reached
Mike's pipeline:

| Case | Result |
|---|---|
| Submit on any page | 200, payload `source: "mike"` ✓ |
| Missing name / phone, blank-after-trim, bad email shape | 400 `invalid_fields` ✓ |
| Malformed JSON body | 400 `invalid_json` ✓ |
| 500-char field | truncated to 300 before forwarding ✓ |
| Webhook unreachable | 502, form shows an error and **keeps** what was typed ✓ |
| Submit twice from one tab, touching the calculator only before the first | first carries the figures, second `roi_used: false` ✓ |
| Submit with calculator untouched | `roi_used: false`, zero `roi_*` fields ✓ |
| Submit after touching it, same page | full ROI block, matches the on-screen figures ✓ |
| Model on `/roi-calculator`, submit on `/pricing` | snapshot survives client nav ✓ |
| Same, after a full page load | snapshot survives via `sessionStorage` ✓ |
| ROI block partial, `NaN`, a string, or an array | dropped whole, `roi_used: false`; the lead still goes through ✓ |

Arithmetic was cross-checked independently rather than read off the screen. Mike's
version with ACV $325,000 / 15 appts / 40% close / $4,900 retainer… reproduces the
figures in the design exactly: 6.0 deals/mo, $23,400,000 year 1, $12,870,000 year 2,
$7,236 invested, 5012.4x.

Grepped both production builds: the URL appears in no build artifact, client or server —
it is read from the environment at runtime.

## Known gaps before this is shippable

1. **The ROI multiple is inflated by its own label.** The panel says "24-month
   projected ROI" but divides 24 months of revenue by only 12 months of cost, so the
   figure is roughly double what the label implies. This reproduces Lovable faithfully
   and was kept deliberately — but it is prospect-facing and now flows into the CRM too,
   so it needs a deliberate answer rather than inheritance: correct the cost basis to 24
   months, or relabel the panel. → **Joseph / Mike.**
2. **`LEAD_WEBHOOK_URL` — resolved 2026-10-18, but read this before touching it again.**
   It is set on Production as a Secret, which means it cannot be read back from Vercel
   or pulled with `vercel env pull`. The only remaining copies are this machine's
   gitignored `.env.local` and GoHighLevel itself. If both are lost, the webhook has to
   be regenerated in GHL and re-mapped.

   The command that worked, after the dashboard did not:

   ```bash
   vercel link && vercel env add LEAD_WEBHOOK_URL production
   ```

   Three traps cost real time here, all worth recording:

   - On the current dashboard, environment variables are **not** a top-level settings
     page. They live inside each environment: *Settings → Environments → click the
     `Production` row*. The "Create Environment" button on that same page creates custom
     pre-production environments, which **is** a Pro feature — easy to mistake for
     variables being paywalled. They are not; Vercel's docs state the 64 KB variable
     allowance applies to "developers on all plans".
   - **Variables do not apply to existing deployments.** After adding one you must
     redeploy, or push a commit, before it takes effect. A deployment created before the
     variable existed keeps returning 500 no matter how correctly the variable is set.
   - `npx` fails with `ENOENT: uv_cwd` when the shell's working directory no longer
     exists — it looks like an npm or Vercel fault but is neither. `cd` somewhere real
     first.
3. **Two team titles are contested.** `/team` now carries a role for all eighteen, but
   Carol-Lynne's and Anna's come from sources that disagree with each other — see the
   note at the top of `lib/team.ts`. Both are flagged to Joseph; neither blocks anything.
4. **Show link points at `marketbetter.xyz`** (the live Show). Centralized in `lib/site.ts`
   as `SHOW_URL` so the cutover is a one-line change.
5. **Testimonials have no photos/logos** — text only. The Lovable v1 had a logo wall
   ("TRUSTED BY LEADERS AT") that needs assets to reproduce.
