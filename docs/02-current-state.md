# Current state audit

Probed 2026-10-15 via `dig` + `curl`. Re-verify before executing any DNS change.

## Properties

### 1. New corporate site — `market-better.lovable.app`
- **Platform:** Lovable (no-code). "Edit with Lovable" badge present in footer.
- **Status:** live, HTTP 200.
- **Nav:** Home · How It Works · Pricing · ROI · Market Better Show
- **Content:** positioning as a unified marketing/sales platform for service businesses.
  Funnel framing: Video → Content → Inbound → Outbound. ROI calculator.
- **CTAs:** "See how the funnel works", "Let's connect →", "Let's Talk" form
  (name / phone / email).
- Note: nav *already* contains a "Market Better Show" item — need to confirm where it
  points today and repoint it post-migration.

### 2. The Market Better Show — `marketbetter.xyz` (currently the root)
- **Platform:** Webflow, behind Cloudflare (`x-wf-region: us-east-1`, `server: cloudflare`).
- **Apex → www:** `marketbetter.xyz` 301-redirects to `https://www.marketbetter.xyz/`.
- **Tagline:** "The B2B show for marketers who refuse to blend in."
- **Nav:** The Team · Sponsor the Show · Market Better Studio (→ `/studio`)
- **Content:** large episode archive, categorized (AI-Powered, GTM, Revenue, Operations,
  Content). Email capture ("10k+ Marketing Nerds"). Logo wall — Salesforce, ZoomInfo, etc.
- **Integrations:** Google Tag Manager, Facebook Pixel, JetBoost (search), Slick Slider,
  cookie consent.
- **Already has a `/studio` route and a "The Team" page** — relevant, since Mike wants a
  team page on the new site. May be reusable content.

### 3. `marketbetter.io` — newly acquired, unconfigured
- **A records:** `3.33.130.190`, `15.197.148.33` — GoDaddy/AWS parking.
- **HTTPS:** fails, no valid certificate issued.
- **HTTP:** 200, 114-byte parking placeholder.
- **MX:** none. No mail configured.
- Effectively a blank domain. Nothing to preserve.

## DNS & registrar

| | `marketbetter.xyz` | `marketbetter.io` |
|---|---|---|
| Nameservers | `ns75/ns76.domaincontrol.com` (GoDaddy) | `ns03/ns04.domaincontrol.com` (GoDaddy) |
| Apex A | `198.202.211.1`, `162.159.140.166` | AWS parking |
| `www` | CNAME → `cdn.webflow.com` | — |
| MX | Google Workspace (`aspmx.l.google.com` et al.) | none |

Both domains sit on GoDaddy DNS. Cloudflare in front of the `.xyz` web traffic is
**Webflow's own CDN**, not a Market Better Cloudflare account — this matters, see the
reverse-proxy option in the plan.

`marketbetter.xyz` MX points at Google Workspace, so **mail for `.xyz` is live**. Any DNS
work on that zone must leave MX/SPF/DKIM/DMARC untouched or mail breaks.

## Findings that change the plan

**`show.marketbetter.xyz` already exists and is broken.**
CNAME → `customers.getcontrast.io`. Requesting it returns `307` redirecting to
`https://www.getcontrast.io/` — i.e. a dangling/misconfigured Contrast subdomain that
does *not* serve the show. Someone set this up previously. Either reclaim it or remove it;
leaving it is a subdomain-takeover-shaped risk.

**`https://www.marketbetter.xyz/show` returns 404.** The path is free.

**The `/show` path is not trivially achievable.** The Show is Webflow and would need to
live under a path while Lovable owns the root. One origin per domain root — they can't
both answer. This is the central technical constraint of Phase 0.

**No analytics baseline captured yet.** Before moving the Show we need its traffic and
top URLs, or we can't size the SEO risk or build the redirect map. GTM is installed;
need access.
