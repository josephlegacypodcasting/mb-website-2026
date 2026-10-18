# Execution plan

## Sequencing decision: local review → deploy → domains last

**Build and review locally first. Deploy only after local approval. No DNS work until
after that.** (Joseph, 2026-10-16.)

Rationale: the original plan coupled two independent risks — "does Mike like the site?"
and "did the cutover break mail/SEO?" Splitting them means the prototype can iterate
freely on a throwaway URL, and the DNS change becomes a single, well-rehearsed step
against content that's already signed off. It also means a rejected design costs nothing,
instead of forcing a rollback on a live domain.

Trade-off: `marketbetter.xyz` keeps showing the Show to prospects in the meantime, so the
brand-confusion problem Mike flagged stays unsolved a bit longer. Worth flagging to him
explicitly — if the confusion is actively costing deals, the fallback is to ship a holding
version to the domain early and keep iterating behind it.

**Everything from Phase 4 onward is parked until the site is approved and deployed.** The
findings and risks are preserved so we don't have to re-audit when we come back to it.

## Decision: the Show URL — parked until the cutover

Not blocking while we're running locally, but it needs an answer before cutover.

Mike asked for `marketbetter.xyz/show`. The obstacle: the new site and the Show are on
different platforms (the Show is Webflow), and a domain root can only point at one origin.
Serving the main site at `/` and Webflow at `/show` means something must sit in front and
split traffic by path.

| Option | How | Effort | Trade-off |
|---|---|---|---|
| **A. Subdomain** — `show.marketbetter.xyz` | CNAME → Webflow, set as custom domain in Webflow | ~1h | Not literally what Mike asked. Needs the dangling Contrast CNAME reclaimed first. Clean, zero fragility. |
| **B. Vercel rewrite** — keeps `/show` | `vercel.json` rewrite: `/show/:path*` → Webflow origin | ~2-4h | **Much cheaper now that we're hosting on Vercel.** No Cloudflare Worker, no nameserver move, no touching the zone with live MX. Caveat: Webflow serves absolute asset/CSS paths, which may break under a path prefix — needs testing before committing. |
| **C. Rebuild the Show on the new stack** | Port the episode archive | Days–weeks | Abandons JetBoost search, episode CMS, existing SEO. Out of scope. |

**Recommendation: test B during the prototype phase; fall back to A if Webflow's asset
paths misbehave.**

The move to Vercel materially changes this call. Previously `/show` meant standing up a
Cloudflare Worker in front of a zone carrying live Google Workspace mail — a day of work
plus real risk. On Vercel it's a few lines in `vercel.json`, and we can test it on a
preview URL at zero risk before any DNS change. If the proxy turns out to mangle Webflow's
assets, option A still works and we add a `/show` → `show.marketbetter.xyz` redirect so
Mike's preferred URL resolves either way.

## Phase 1 — Local rebuild (BUILT, awaiting review)

Goal: a locally reviewable site. No deploy, no DNS, no production domains.
Run instructions and verification status: [local dev](06-local-dev.md).

**Decided (Joseph, 2026-10-16):** rebuild from scratch — do *not* export Lovable. The
Lovable site is a content/copy reference only. The **visual theme must match the Show site**
(`marketbetter.xyz`); tokens extracted in [design system](05-design-system.md).

- [x] **Scaffold** Next.js 16 + Tailwind 4 + TypeScript, running locally.
- [x] **Design tokens** from [05-design-system.md](05-design-system.md): Archivo via
      `next/font/google`, heading scale with its negative tracking, `.btn` geometry.
- [x] **Colour palette re-pointed to `mbgrowth.marketbetter.xyz`** (Joseph, 2026-10-16) —
      colours only; typography and layout untouched.
- [x] **Logo wired** into header and footer, with the cream variant on dark surfaces.
- [x] **Padding fixes** — tinted band on How It Works had `pt-0`, the CTA form collapsed to
      184px instead of 448px, and the two pricing cards sat 1px out of alignment.
- [x] **Content ported** from Lovable v1 — Home, How It Works, Pricing, ROI (incl. the
      calculator), "Let's Talk" form. Copy transcribed verbatim.
- [x] **Show link as top-right nav button**, pointing at the live Show. Centralized as
      `SHOW_URL` in `lib/site.ts` so the cutover is a one-line change.
- [x] **Second version** (Joseph, 2026-10-16) — Mike's Lovable design rebuilt alongside
      the in-house one so both could be reviewed side by side. That comparison happened
      in `mb_official_website`; this repo is the winner, extracted and flattened to the
      root.
- [x] **Local review and approval — direction picked (2026-10-18).** Joseph approved
      **Mike's version** — the Lovable design: sand background, Poppins, `#ff4124`
      accent, purple footer. The in-house rebuild at `/` (mbgrowth colours + the Show's
      Archivo) is not shipping; it stays in git history as the record of the other
      direction. The approved design already sits at the root of the `mb-website-2026`
      repo, which is therefore what Phase 3 deploys.
- [x] **Wire the contact form** — posts to `/api/lead`, which forwards
      server-side to the LeadConnector webhook Joseph supplied. `source` distinguishes
      submissions by origin. Requires `LEAD_WEBHOOK_URL` in the Vercel environment at
      Phase 3. A prospect's ROI-calculator figures ride along when they touched it.
- [ ] **Test the `/show` rewrite** (option B) locally to find out whether Webflow proxies
      cleanly under a path prefix. Can be done before any deploy.

## Phase 2 — v2 content

Mike deferred these but said they could run "alongside." Safe to do during Phase 1 now
that we're not racing a 48h DNS deadline:

- Team page — check whether the Webflow Show's existing "The Team" page content is reusable.
- Remaining content gaps.
- Visual design pass.

## Phase 3 — Deploy to Vercel (after local approval)

1. Create the Git repo and Vercel project.
2. Deploy to a preview URL; verify the build in Vercel's environment matches local.
3. Share the preview URL with Mike for sign-off before any domain work.

## Phase 4 — Domain cutover (DEFERRED — not until the deploy is approved)

> **On hold per Joseph, 2026-10-16.** Do not execute any step below without explicit
> go-ahead. Preserved so the audit work isn't lost.

Why `.xyz` before `.io`: `.io` is bare — no cert, no mail, no DNS. Doing the swap and
standing up a brand-new domain at once stacks two risky changes. Cost of going via `.xyz`
is one extra redirect hop later, which is cheap.

Prereqs: GoDaddy DNS access, Webflow account access, Vercel project access, Mike's
decision on the Show URL. See [open questions](04-open-questions.md).

1. **Snapshot before touching anything.** Record current DNS zone for `marketbetter.xyz`
   (full export), pull the Show's top ~50 URLs and traffic from GA/GTM, note Webflow's
   current custom-domain config. This is the rollback kit.
2. **Reclaim `show.marketbetter.xyz`** — remove the dangling Contrast CNAME. Confirm with
   Alej/Anna that no active Contrast integration depends on it first.
3. **Point the Show at its new home.** Add `show.marketbetter.xyz` as a custom domain in
   Webflow, publish, verify SSL issues correctly.
4. **Repoint the apex to Vercel.** Add `marketbetter.xyz` + `www` as custom domains in the
   Vercel project, update GoDaddy A/CNAME records per Vercel's instructions.
   **Do not modify MX, SPF, DKIM, or DMARC.**
5. **Redirects.** `marketbetter.xyz/show` → the Show (or the rewrite, if option B holds).
   Per-URL 301s from old Show paths (`/studio`, `/the-team`, episode URLs) to their new
   equivalents.
6. **Nav wiring.** Main site: "Market Better Show" as top-right button → new Show URL.
   Webflow Show site: link back to the main site.
7. **Verify.** SSL on both hosts, apex + www both resolve, `/show` redirect works, forms
   submit, **send and receive a test email on `@marketbetter.xyz`**, GTM/Pixel still firing.

Rollback: revert the DNS records from the step-1 snapshot. TTL-bound, so lower TTLs to
300s a few hours before the change.

## Phase 5 — move to `marketbetter.io` (DEFERRED)

1. Stand up `.io` in GoDaddy DNS; set up Google Workspace on it (MX, SPF, DKIM, DMARC).
2. Add `marketbetter.io` to Vercel; add `show.marketbetter.io` to Webflow. Verify certs.
3. 301 everything on `.xyz` → `.io` equivalents, preserving paths. Keep `.xyz` registered
   and redirecting indefinitely — do not let it lapse.
4. Update Google Search Console (change of address), GTM, Pixel, social profiles, email
   signatures, sales collateral, canonical URLs.
5. Only after mail is confirmed working on `.io`: migrate mailboxes. Coordinate with the
   email-migration project so LM users land on `.io` once, not twice.

## Risks

Phases 4-5 only — the local build and Vercel deploy carry none of these, which is the point of
sequencing it first.

| Risk | Mitigation |
|---|---|
| Breaking live Google Workspace mail on `.xyz` | Never touch MX/SPF/DKIM/DMARC. Test send+receive after every DNS change. |
| Losing Show SEO | Per-URL 301 map, not a blanket redirect. Search Console change-of-address. |
| Subdomain takeover via dangling Contrast CNAME | Remove it during cutover. Worth doing sooner — it's a standing risk regardless of this project. |
| SSL provisioning lag on cutover | Pre-add domains in both platforms so certs issue ahead of the DNS flip. |
| Contact form silently dropping leads after the move | Verify the form's destination during Phase 1, re-verify after cutover. |
| Client-facing breakage | Mike's hard constraint. Nothing in Phases 1-3 touches client assets, but verify before Phase 5 mail work. |
| Prospects still seeing the wrong site while we prototype | Accepted trade-off of this sequencing. Flag to Mike; fallback is an early holding deploy. |
