# Design system

**What ships is Mike's design** — the Lovable build at `market-better.lovable.app`,
rebuilt here. Joseph approved it on 2026-10-18 over an in-house alternative. Jump to
[The shipping design](#the-shipping-design-lovable) for the tokens that are actually in
`app/globals.css`.

**Everything before that section is brand research on the direction that lost.** It is
kept because it is still the best record of where the brand's colour and typography
actually come from, and three findings in it outlived the design itself: the Show's
commercial fonts are never applied (no licensing problem), the logo's provenance and
why it is stacked, and the fact that Mike's purple is byte-identical to mbgrowth's. The
losing direction lives on in the `mb_official_website` repo; none of its tokens exist in
this one.

That direction split its sources deliberately (Joseph, 2026-10-16):

| Layer | Source | Why |
|---|---|---|
| **Colour** | `https://mbgrowth.marketbetter.xyz/` (`mb-funnel.css`) | Superseded the Show's palette on Joseph's instruction — *"solo los colores"* |
| **Typography + geometry** | `https://www.marketbetter.xyz/` (the Show) | Unchanged: Archivo, the heading scale, the `.btn` box |

Both were extracted from the live stylesheets, not eyeballed from screenshots.

## Key finding: the fonts are free

The Show's stylesheet declares four commercial Pangram Pangram faces — **PP Monument Extended**,
**PP Agrandir Grand**, **PP Gatwick** — via `@font-face`. They look like a licensing
problem, but **they are never applied to any selector.** All 18 references sit inside
`@font-face` blocks; zero appear in a rule that targets an element. They are dead weight
inherited from an old Webflow template.

The font actually in use is **Archivo** (49 applied references), loaded from Google Fonts
at weights `300,400,500,600,700`. Free, open source, no licensing concern, available via
`next/font/google`.

**Implication:** we can match the Show's typography exactly at zero cost and zero legal
risk. Do not buy PP licenses, and do not copy the dead `@font-face` blocks forward.

## Colours (source: mbgrowth)

`mb-funnel.css` is hand-written and small (12 KB), with a single declared `:root` — no
template leftovers to filter. It ships a light and a dark theme (`:root[data-theme="dark"]`).
We use the light theme; the dark theme matters only because it supplies the accent that
stays legible on ink surfaces.

| mbgrowth var | Hex | Our token | Role here |
|---|---|---|---|
| `--accent` | `#f54e29` | `--color-accent` | **Primary action** — button background |
| `--accent-dark` | `#d63d1c` | `--color-accent-dark` | Primary button hover |
| `--accent` (dark theme) | `#ff6440` | `--color-accent-bright` | Accent on ink surfaces |
| `--structure` | `#432ead` | `--color-purple` | Eyebrows, links, focus rings |
| `--page` | `#f4f3f0` | `--color-cream` | Tinted section band |
| `--page-alt` | `#eceae5` | `--color-beige` | Second tinted band |
| `--band-card` | `#efeadc` | `--color-sand` | Warmest band (was lavender) |
| `--ink` | `#14140f` | `--color-ink` | **Primary text**, dark sections |
| `--card` | `#fffefc` | — | Within 3/255 of white; we kept `white` |

Two token renames came with the swap, because the old names would have lied about the new
values: `lime` → `accent` (the primary action is orange now) and `purple-light` → `sand`
(`#efeadc` is warm, not lavender). `orange` was folded into `accent` — they had resolved to
the same colour. `purple-bright` and `ink-deep` were dropped; nothing referenced them.

**Why `accent-bright` exists:** `#f54e29` on `#14140f` is legible but muddy at the small,
uppercase, letter-spaced sizes we use for eyebrows. mbgrowth already solved this — its dark
theme swaps in `#ff6440` (6.4:1 against ink). We use the same value in the same situation:
the footer, the dark ROI panel, and the featured pricing card.

### Superseded: the Show's palette

Kept for reference only — this is what shipped before 2026-10-16 and what the Show still
uses. Do not reintroduce it.

| Token | Hex | Role |
|---|---|---|
| Lime | `#ddf44e` | Was the primary action colour |
| Purple | `#5638ae` | Brand purple (also `--_color---dark-purple-mbs: #5639ae`) |
| Purple bright | `#8c52ff` | Accent / highlight purple |
| Lavender | `#cdd2fa` | Soft purple tint, backgrounds |
| Orange | `#f44e29` | Accent (also the Show's `--_color---orange-mbs`) |
| Cream | `#fff2d2` | Warm background |
| Beige | `#f6d6e1` | Soft pink-beige background |
| Black | `#282e32` | Primary text on light surfaces |
| Black (alt) | `#171710` | Deeper near-black, `--mb-black` |

If you ever go back to the Show's stylesheet for anything, **ignore** the `--sb-*`
namespace (old template), `--graymodern*` (a gray ramp from a different kit), and all
`--<unknown|relume-variable-*>` references — broken Relume variables that resolve to
nothing. Carrying them over would import someone else's design system on top of ours.

## Typography (source: the Show — unchanged by the colour swap)

Family: `Archivo, sans-serif` for everything — headings and body. Note mbgrowth uses Roboto;
we deliberately did **not** take that. Joseph's instruction was colours only.

| Element | Size | Weight | Line height | Letter spacing |
|---|---|---|---|---|
| h1 | `4rem` | 700 | 1 | `-0.1rem` |
| h2 | `3rem` | 700 | 1.1 | `-0.05rem` |
| h3 | `2.5rem` | 700 / 500 | 1.1 | `-0.05rem` |
| h4 | `2rem` | 500 | 1.1 | `-0.025rem` |
| h5 | `1.5rem` | 500 | 1.2 | `0` |
| body | `1rem` | 400 | 1.4 | — |

Note the deliberate pattern: **tighter negative tracking as size increases**, relaxing to
`0` by h5. Preserve this — it's what makes the headings feel like this brand rather than
default Archivo.

Body text scale (utility classes on the Show):

| Class | Size | Weight |
|---|---|---|
| `text-size-tiny` | `0.75rem` | — |
| `text-size-small` | `0.875rem` | — |
| `text-size-regular` | `1rem` | — |
| `text-size-medium` | `1.125rem` | 500 |
| `text-size-large` | `1.5rem` | 400 |

One h3 variant uses a fluid clamp: `clamp(1.5rem, 1.27143rem + 1.14286vw, 2.3rem)`.
Worth adopting fluid type for headings generally on the rebuild — the fixed `4rem` h1 will
be too large on mobile otherwise.

## Primary button

The canonical `.button` — geometry from the Show, colours from mbgrowth:

```css
background: #f54e29;        /* accent  (was #ddf44e lime) */
color: #ffffff;             /* (was #282e32 black)        */
border-radius: 10px;
padding: 0.75rem 1.75rem;
font-family: Archivo, sans-serif;
font-size: 0.9rem;
font-weight: 600;
line-height: 1;
letter-spacing: 0.02rem;
white-space: nowrap;
transition: border-color .3s, color .3s, background-color .3s;
```

Note `letter-spacing: 0.02rem` — positive tracking on buttons, opposite of the headings.

`.button-group` uses `gap: 1rem`, `flex-wrap: wrap`, `align-items: center`.

**Ignore `.button-2` through `.button-10`.** They're Relume/template leftovers with
inconsistent values (`#d14424`, 100px radius, broken variable refs) and no relationship to
the brand. Only `.button` reflects current design intent.

## How the losing direction was implemented

For the record only — **none of these tokens exist in this repo.** They lived in an
`@theme` block alongside the `mk-*` set while both versions shared one app:

```css
--color-accent: #f54e29;   --color-accent-dark: #d63d1c;
--color-accent-bright: #ff6440;  --color-purple: #432ead;
--color-cream: #f4f3f0;    --color-beige: #eceae5;
--color-sand: #efeadc;     --color-ink: #14140f;
--font-sans: var(--font-archivo), sans-serif;
--radius-btn: 10px;
```

## Logo

`public/mb-logo.png` — the stacked wordmark ("market" over "better."), supplied by
Joseph 2026-10-16 at 1247×717. It is the only logo asset in this repo; a cream-on-dark
variant exists in `mb_official_website` but this design never puts the mark on a dark
surface, so it was not carried over.

Being stacked rather than single-line, it needs roughly twice the height of a one-line
lockup to stay readable — rendered here at `h-8` on phones and `h-10` from `sm` up.
No vector original has surfaced yet.

## The shipping design (Lovable)

Built 2026-10-16 on Joseph's request — *"otra version de esta pagina web como lo diseño
Mike"* — as a faithful rebuild of `market-better.lovable.app`, and approved on
2026-10-18 as the direction that ships.

It shares **nothing** with the research above: different palette, different typeface,
different geometry. The `mk-` prefix on its tokens is a leftover from the period when
both designs lived in one app and had to coexist without overriding each other. It is
kept only because renaming every token now would be churn for no gain.

Lovable stores its palette as HSL triplets in `:root` inside
`assets/index-lat2Vftg.css`. Converted to hex:

| Lovable var | Our token | Hex | Role |
|---|---|---|---|
| `--background` | `--color-mk-bg` | `#efeadc` | Page background — the same sand as ours, by coincidence |
| `--foreground` | `--color-mk-fg` | `#161519` | Body text |
| `--primary` | `--color-mk-primary` | `#432ead` | The purple bands — the same purple as mbgrowth |
| `--accent` | `--color-mk-accent` | `#ff4124` | Orange-red, on nearly every heading |
| `--secondary` | `--color-mk-secondary` | `#ada4d0` | The struck-through "vanity metrics" text |
| `--muted-foreground` | `--color-mk-muted-fg` | `#605e68` | Secondary copy |
| `--border` | `--color-mk-border` | `#b6b5c0` | Hairlines, slider track |
| `--card` | `--color-mk-card` | `#ffffff` | The non-featured pricing card |
| `--panel-ink` | `--color-mk-panel-ink` | `#121212` | The featured pricing card |
| `--peach` | `--color-mk-peach` | `#ffd9cc` | That card's border |

Worth noting: Mike's purple is `#432ead`, byte-identical to mbgrowth's. The two designs
are less far apart than they look — the real divergence is the typeface and the accent.

As it actually appears in `app/globals.css` (Tailwind 4 is CSS-first, so there is no
`tailwind.config.ts`):

```css
@theme {
  --color-mk-bg: #efeadc;        --color-mk-fg: #161519;
  --color-mk-card: #ffffff;      --color-mk-primary: #432ead;
  --color-mk-secondary: #ada4d0; --color-mk-muted: #e2ddcf;
  --color-mk-muted-fg: #605e68;  --color-mk-accent: #ff4124;
  --color-mk-border: #b6b5c0;    --color-mk-panel-ink: #121212;
  --color-mk-peach: #ffd9cc;

  --font-display: var(--font-poppins), sans-serif;
  --radius-mk: 0.25rem;
  --shadow-soft: 0 24px 60px -24px rgb(22 21 25 / 0.18);
  --shadow-panel: 0 34px 80px -28px rgb(255 65 36 / 0.35);
}
```

`--color-mk-muted` is part of the source palette but nothing uses it yet.

**Typeface: Poppins** 400–800 via `next/font/google`, exposed as `--font-display` so
`font-display` works as a Tailwind utility. (mbgrowth uses Roboto, the Show uses Archivo,
Lovable uses Poppins — three sites, three typefaces.)

**Headings carry no size of their own.** Lovable strips them to
`font-size: inherit; font-weight: inherit` and sizes each one with a utility class
(`text-9xl`, `leading-[.94]`, and so on). Tailwind's preflight already does that reset,
so this repo needs nothing extra — but it is worth knowing before anyone "helpfully"
adds a global heading scale, which would fight every page.

While both designs shared one app this reset had to be scoped to a `.theme-mike`
wrapper, so that a class selector could outrank the other theme's bare element
selectors. **That wrapper is gone here** — the theme sits directly on `body`, which also
means a short page no longer shows white below the fold.

**Routes.** Flat and at the root: `/`, `/how-it-works`, `/pricing`, `/roi-calculator`.
The root layout owns `<html>`/`<body>`, loads Poppins, and wraps header → children →
footer in the `RoiProvider`.

**Not reproduced:** Lovable bundles testimonial avatars and client logos as PNGs (Credit
Repair Cloud, DFY Real Estate, AAICT). We don't have those assets, so those cards render
attribution as text. Also not reproduced: Lovable's Supabase form wiring — the form posts
to a LeadConnector webhook instead, see [open questions](04-open-questions.md).

## Open items

- **Spacing scale** — the Show's section padding is scattered across per-component Webflow
  classes with no coherent scale. Recommend defining a clean one for the rebuild rather
  than reverse-engineering the inconsistency.
- **Dark sections** — the Show uses dark backgrounds (`#06090e` appears on `.button-2`).
  Confirm with Mike whether the corporate site should carry dark sections too.
