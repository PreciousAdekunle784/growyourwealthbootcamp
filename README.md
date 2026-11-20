# Grow Your Wealth Bootcamp — website

The marketing site for the Grow Your Wealth Bootcamp, a one-day virtual event from Noelle Randall Coaching
(Noelle Randall Inc.). Built with [Astro](https://astro.build) as a fast static site.

Every business fact on the site comes from the brand research document (Nov 2026) and lives in **one file**:
`src/config/site.ts`. Nothing is invented. Items still needing the client's confirmation are marked `VERIFY` there.

## Run it

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

`npm run build` type-checks (`astro check`) and outputs static files to `dist/`. Deploy `dist/` to any static host
(Netlify, Vercel, Cloudflare Pages, S3) and point growyourwealthbootcamp.com at it.

## Running a campaign

The old site went stale between events. This one is driven by an **event state** in `src/config/site.ts`:

| `event.state` | What visitors see | Every CTA goes to |
| --- | --- | --- |
| `'waitlist'` (current) | "Next date: to be announced", last-edition prices as context | The waitlist form |
| `'open'` | The date, real prices, "Reserve your seat" | `PUBLIC_CHECKOUT_URL` |
| `'replay'` | "Get replay access" | `PUBLIC_CHECKOUT_URL` |

To open sales: set `state: 'open'`, `nextDate`, `edition`, each tier's `price`, and `PUBLIC_CHECKOUT_URL`, then
rebuild. The hero, header, tickets, FAQ answers, sticky mobile bar and Event structured data all update.
If the checkout URL is missing, the site stays in waitlist mode rather than showing dead buttons.

## Integrations to connect

Copy `.env.example` to `.env` (or set these in your host's environment settings).

| Variable | Purpose | Without it |
| --- | --- | --- |
| `PUBLIC_WAITLIST_ENDPOINT` | Receives waitlist sign-ups as JSON `POST` (e.g. a GoHighLevel inbound webhook). Payload: `first_name, last_name, email, phone, consent, source, page, tags: ['GYWB - Waitlist'], submitted_at`. Must allow CORS from the site. | The form opens the visitor's email app with their details pre-filled to contact@noellerandall.com |
| `PUBLIC_CHECKOUT_URL` | The GoHighLevel checkout step (tier is chosen there) | CTAs stay on the waitlist |
| `PUBLIC_META_PIXEL_ID` | Meta Pixel (old funnel: `2070714110083227`); fires `PageView`, and `Lead` on waitlist success | No pixel |
| `PUBLIC_GOOGLE_ADS_ID` | Google Ads tag (old funnel: `AW-1010182417`) | No tag. Purchase conversions belong on the GHL confirmation step. |

Optional: `contact.chatWidgetId` in the config for the LeadConnector chat widget.

## Before launch — needs the client

- **Video.** No sales video exists yet. The Watch section shows a designed placeholder that links to the waitlist.
  Add the real video in `vsl` (`vimeo` / `youtube` / `file`). Do not use vimeo.com/775915361 until its content and
  rights are confirmed.
- **Testimonials.** The three quotes are Noelle Randall Coaching members, published on noellerandall.com/about, and
  are labelled that way. Confirm written permission; swap in bootcamp-specific stories when available.
- **Stats and bio.** 20+ years, 60K+ students, 22M+ YouTube views and the degrees are as published by the brand.
  Confirm sources and dates.
- **Tier inclusions and prices** for the next edition (`tiers`). "Making It!", "Pick a Horse" and QuickStart REI were
  only named on the last checkout.
- **Master Coaches.** Add names and roles to `coaches` to show them on the About page.
- **Social handles.** The old funnel used two sets; the config uses the @noellerandallcoaching set and YouTube
  @NoelleRandall1.
- **Partners.** Confirm which of the nine partner offers are current. Links render with `rel="sponsored"` and an
  affiliate disclosure on `/disclaimer`.
- **Legal review.** The refund policy is the published Nov 2023 ticket policy, with two phrases adapted for this page
  ("on this page" for "at the bottom of this page"; the checkbox reference). The SMS/phone consent wording on the form
  and the "not financial advice" line on `/disclaimer` are new and need legal sign-off.
- **Logo files.** The site uses a typographic wordmark and the official "Winning in Real Estate" badge. Supply vector
  logos if the GYWB mark should appear.

## Design system

**Concept — "The Capital Ledger."** The bootcamp's argument is a sequence: structure → credit → capital → property.
The site is typeset like a private-banking ledger: numbered sections (§), hairline rules, ledger-paper
panels, and a signature "capital stack" that Noelle stands on in the hero and that builds itself in the Method section.

- **Colour:** ink `#0c1633`, ledger paper `#f4efe6`, the brand's own magenta as the single accent (`#c8125f` on
  paper, `#b5104f` on darker paper, `#ff5c9a` on ink), royal blue `#2b47b5` only in the stack. All text pairs pass
  WCAG AA.
- **Type:** Fraunces (headlines, italic for emphasis; pinned to its display optical size so headlines scale
  predictably) and Instrument Sans (body, plus small tracked uppercase for labels and buttons). Self-hosted via
  Fontsource.
- **Grid:** one 12-column grid (`.cols`) everywhere. Headings and labels sit in columns 1–5 (`.c-l`); all content
  starts on the same axis at column 7 (`.c-r`). Section headings are sized from the grid width so the longest line
  always fits.
- **Motion:** lines rise out of their own baseline, folio rules draw, images unmask upward, the stack layers settle in
  scroll order. Motion only activates when the visitor allows it (`prefers-reduced-motion` gets everything instantly)
  and content is always visible without JavaScript.

## Structure

```
src/
  config/site.ts      all business content + event state + integrations
  config/faq.ts       FAQ, with answers that adapt to the event state
  layouts/Base.astro  <head>, SEO, structured data, tracking, header/footer
  components/         one file per homepage section, plus Header, Footer, MobileCta
  pages/              /, /about, /support, /refund-policy, /disclaimer, /thank-you, 404
  scripts/            motion.ts (reveal system), form.ts (waitlist validation + submit)
  styles/global.css   tokens, type, buttons, motion primitives
public/               favicon, og.jpg (social share image), robots.txt
```
