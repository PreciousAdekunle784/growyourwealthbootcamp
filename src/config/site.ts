/**
 * SINGLE SOURCE OF TRUTH FOR SITE CONTENT
 * ---------------------------------------------------------------------------
 * Every business fact on the site is read from this file. Facts come from the
 * brand research document (Nov 2026). Items marked `VERIFY` were published by
 * the brand but still need the client's confirmation before launch.
 *
 * To run a new campaign you should only need to edit `event` (and maybe `vsl`).
 */

/* ------------------------------------------------------------------ */
/* Brand & contact                                                     */
/* ------------------------------------------------------------------ */

export const brand = {
  name: 'Grow Your Wealth Bootcamp',
  shortName: 'Grow Your Wealth',
  legalEntity: 'Noelle Randall Inc.',
  parentBrand: 'Noelle Randall Coaching',
  siteUrl: 'https://growyourwealthbootcamp.com',
  description:
    'A one-day virtual bootcamp with real estate investor Noelle Randall and her coaching team: set up your business the right way, build business credit, and secure the funding to grow.',
} as const;

export const contact = {
  email: 'contact@noellerandall.com',
  phoneDisplay: '1-888-479-4542',
  phoneHref: 'tel:+18884794542',
  mail: ['600 N Thacker Ave, Suite D43', 'Kissimmee, FL 34741'],
  // Existing LeadConnector chat widget. Leave empty to omit.
  chatWidgetId: '', // VERIFY: '667a8888e6a49e4e06b85b26' was used on the old funnel
} as const;

/** VERIFY: the old funnel used two different sets of handles. These match the founder site + checkout pages. */
export const socials = [
  { label: 'YouTube', href: 'https://www.youtube.com/@NoelleRandall1' },
  { label: 'Instagram', href: 'https://www.instagram.com/noellerandallcoaching/' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@noellerandallcoaching' },
  { label: 'Facebook', href: 'https://www.facebook.com/noellerandallcoaching' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/noelle-randall-coaching/' },
] as const;

export const legalLinks = {
  terms: 'https://noellerandall.com/terms-and-conditions/',
  privacy: 'https://noellerandall.com/privacy-policy/',
} as const;

/** Verbatim from every page of the existing funnel. */
export const earningsDisclaimer =
  'The Grow Your Wealth Bootcamp is an educational program. We do not guarantee earnings or specific results. Any examples or testimonials are for educational purposes only and are not typical. Your outcomes depend on your own effort, experience, resources, and market conditions.';

/* ------------------------------------------------------------------ */
/* Event state — the switch that keeps the site from going stale       */
/* ------------------------------------------------------------------ */

/**
 * 'waitlist' — no date announced. Every CTA collects waitlist sign-ups.
 * 'open'     — tickets on sale. CTAs go to `checkoutUrl`.
 * 'replay'   — event finished, replay on sale/available. CTAs go to `checkoutUrl`.
 */
export type EventState = 'waitlist' | 'open' | 'replay';

export const event = {
  state: 'waitlist' as EventState,

  /** Shown when state is 'open' or 'replay'. ISO date, e.g. '2027-03-06'. */
  nextDate: '' as string,
  /** 'Live' or 'Encore broadcast'. An Encore rebroadcasts the best moments of the live events. */
  edition: 'Live' as 'Live' | 'Encore broadcast',
  hours: '11 AM – 6 PM ET',

  /** The most recent edition, used for honest "last time" context while on the waitlist. */
  lastEdition: {
    date: '2026-11-07',
    label: 'Encore broadcast',
  },

  /**
   * GoHighLevel checkout step. INTEGRATION: set PUBLIC_CHECKOUT_URL in .env, or
   * paste the URL here. Used only when state is 'open' or 'replay'.
   */
  checkoutUrl: (import.meta.env.PUBLIC_CHECKOUT_URL as string | undefined) ?? '',

  /** Replay window. The Nov 2026 Encore gave 3 weeks. */
  replayWindow: '3 weeks',
} as const;

export const isSelling = event.state !== 'waitlist' && event.checkoutUrl.length > 0;

/** Primary CTA for the whole site, derived from the event state. */
export const primaryCta = isSelling
  ? { label: event.state === 'replay' ? 'Get replay access' : 'Reserve your seat', href: event.checkoutUrl, external: true }
  : { label: 'Join the waitlist', href: '/#waitlist', external: false };

export function formatDate(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/* ------------------------------------------------------------------ */
/* Offer                                                               */
/* ------------------------------------------------------------------ */

/** The three-step method, verbatim pillars from the opt-in page. */
export const method = [
  {
    key: 'structure',
    label: 'Structure',
    title: 'Set up your business the right way.',
    body: 'Everything else is built on the foundation. Start with a business that is set up correctly from day one, so what you build on top of it holds.',
  },
  {
    key: 'credit',
    label: 'Credit',
    title: 'Build powerful business credit.',
    body: 'Credit in your business’s name, separate from your personal profile. It is the asset that turns a new business into one that can borrow.',
  },
  {
    key: 'capital',
    label: 'Capital',
    title: 'Secure the funding to grow.',
    body: 'No-doc loans, SBA loans, grants, lines of credit and more: the funding routes covered on the day.',
  },
] as const;

export const fundingRoutes = ['No-doc loans', 'SBA loans', 'Grants', 'Lines of credit'] as const;

export type Tier = {
  id: string;
  name: string;
  summary: string;
  includes: string[];
  /** Current price, e.g. '$47'. Leave empty while on the waitlist. */
  price: string;
  /** Last published price, shown as context while on the waitlist. */
  lastPrice: string;
  featured?: boolean;
};

/** Inclusions as published on the Nov 2026 checkout. VERIFY before each campaign. */
export const tiers: Tier[] = [
  {
    id: 'general',
    name: 'General Admission',
    summary: 'The full day, plus the tools to act on it.',
    includes: [
      'Full-day bootcamp access',
      'Replay access after the event',
      'Downloadable workbook',
      'Exclusive partner offers',
    ],
    price: '',
    lastPrice: '$47',
  },
  {
    id: 'vip',
    name: 'VIP Access',
    summary: 'For people who want the coaches’ time, not just the content.',
    includes: [
      'Everything in General Admission',
      'VIP-only live Q&A with Master Coaches (2+ hours)',
      'Grow Your Wealth VIP private community',
      'Two eBooks from Noelle: Making It! and Pick a Horse',
      'QuickStart REI course',
    ],
    price: '',
    lastPrice: '$97',
    featured: true,
  },
];

/* ------------------------------------------------------------------ */
/* Video                                                               */
/* ------------------------------------------------------------------ */

/**
 * No VSL exists yet (see research doc, Phase 3). Leave `provider` null to show the
 * designed placeholder. When the real video is supplied:
 *   { provider: 'vimeo', id: '123456789' }   or
 *   { provider: 'youtube', id: 'dQw4w9WgXcQ' } or
 *   { provider: 'file', src: '/video/presentation.mp4' }
 * Do NOT use vimeo.com/775915361 until the client confirms its content and rights.
 */
export const vsl: {
  provider: 'vimeo' | 'youtube' | 'file' | null;
  id?: string;
  src?: string;
  title: string;
  duration?: string;
} = {
  provider: null,
  title: 'The Grow Your Wealth Bootcamp presentation',
};

/* ------------------------------------------------------------------ */
/* Founder                                                             */
/* ------------------------------------------------------------------ */

export const founder = {
  name: 'Noelle Randall',
  postNominals: 'MPS, MBA',
  roles: ['Entrepreneur', 'Real estate investor', 'Mentor', 'Author', 'Speaker'],
  quote:
    'Success doesn’t start with the money in your account, the cars that you own, the properties you can get… it starts with having mindset!',
  /** Published on noellerandall.com. VERIFY sources and dates before launch. */
  stats: [
    { value: '20+', label: 'Years as an entrepreneur' },
    { value: '60K+', label: 'Students' },
    { value: '22M+', label: 'Views across YouTube' },
  ],
  education: [
    { degree: 'MBA', school: 'Baylor University' },
    { degree: 'Master’s, Economic Development', school: 'Penn State' },
    { degree: 'Bachelor’s, Urban Planning', school: 'University of Connecticut' },
  ],
  ventures: [
    { name: 'Noelle Randall Coaching', role: 'CEO', note: 'Real estate training, workshops and events' },
    { name: 'FDR Horizon Enterprises', role: 'Founder & President', note: 'Private real estate equity firm and brand manager' },
    { name: 'NuuRez Inc.', role: 'Founder', note: 'Home-sharing and short-term rental properties' },
    { name: 'Nuu Lending & Nuu Realty', role: 'Founder', note: 'Lending and realty companies' },
    { name: 'Marley Simms Foundation', role: 'Executive Director', note: 'Non-profit promoting children’s literacy' },
  ],
  books: [
    'Grow Your Wealth: Go from Zero to Rich Investing in Real Estate',
    'Real Estate Millionaire Secrets',
    'Millionaire Business Secrets',
    'BNB Millionaire Secrets',
    'Turo Millionaire Secrets',
  ],
} as const;

/** Master Coaches. Empty = section hidden. VERIFY: names, roles and photos from the client. */
export const coaches: { name: string; role: string }[] = [];

/* ------------------------------------------------------------------ */
/* Proof                                                               */
/* ------------------------------------------------------------------ */

/**
 * Verbatim from noellerandall.com/about. These are Noelle Randall Coaching members,
 * not bootcamp-specific reviews, and the page labels them that way.
 * VERIFY written permission before launch; replace with bootcamp stories when available.
 */
export const testimonials = [
  {
    name: 'Shervonne Henderson',
    image: 'shervonne',
    quote:
      'I got $17,000 in business credit just from Noelle’s free video—before I even joined the program. Now I’m part of a real community, building wealth with expert guidance and real support. This mentorship changed my life.',
    pull: '$17,000 in business credit',
  },
  {
    name: 'Mercedes Sanchez',
    image: 'mercedes',
    quote:
      'This program gave me clarity and purpose. I went from just wanting to invest to building two businesses and studying for my real estate license—all while being a mom to two amazing boys with autism. I’m building something they can inherit.',
    pull: 'Building something they can inherit',
  },
  {
    name: 'Dwayne Mayweather',
    image: 'dwayne',
    quote:
      'I’ve overcome so much—but this mentorship gave me hope, direction, and a true community. For the first time, I don’t feel alone in my journey.',
    pull: 'For the first time, I don’t feel alone',
  },
] as const;

/**
 * Partner offers shown to attendees. Several of the source links are affiliate or
 * referral links, so they render with rel="sponsored" and an affiliate disclosure.
 * VERIFY which partnerships are current.
 */
export const partners = [
  { name: 'Big Think Capital', href: 'https://bigthinkcapital.com/partner/noelle-randall/', field: 'Business funding' },
  { name: 'Nav', href: 'https://nav.nkwcmr.net/c/2522407/675356/2410', field: 'Business credit' },
  { name: 'NorthOne', href: 'https://northone.com/?utm_source=youtube&utm_campaign=influencer_noelle-randall', field: 'Business banking' },
  { name: 'Creative Credit Solutions', href: 'https://creativecreditsolutions.info/noellerandall', field: 'Credit services' },
  { name: 'Prime Corporate Services', href: 'https://primecorporateservices.com/noelle-randall/', field: 'Business setup' },
  { name: 'DealMachine', href: 'https://dealmachine.com/Noelle', field: 'Real estate deal finding' },
  { name: 'Golden Trinity Group', href: 'https://goldentrinitygroup.com', field: 'Partner' },
  { name: 'BizCentral Suite', href: 'https://bizcentralsuite.com', field: 'Partner' },
  { name: 'Justin Mirche Consulting', href: 'https://justinmircheconsulting.com/affiliate/noelle/', field: 'Consulting' },
] as const;

/* ------------------------------------------------------------------ */
/* Integrations                                                        */
/* ------------------------------------------------------------------ */

/**
 * Waitlist form endpoint. INTEGRATION: set PUBLIC_WAITLIST_ENDPOINT to a GoHighLevel
 * inbound webhook (or any endpoint accepting JSON POST). If unset, the form falls back
 * to opening a pre-filled email to the support address, so it never silently fails.
 */
export const integrations = {
  waitlistEndpoint: (import.meta.env.PUBLIC_WAITLIST_ENDPOINT as string | undefined) ?? '',
  metaPixelId: (import.meta.env.PUBLIC_META_PIXEL_ID as string | undefined) ?? '',
  googleAdsId: (import.meta.env.PUBLIC_GOOGLE_ADS_ID as string | undefined) ?? '',
} as const;
