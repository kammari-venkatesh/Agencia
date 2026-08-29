/**
 * Central SEO / site identity source of truth.
 * Future pages should import from here instead of hardcoding www URLs or copy.
 */

export const SITE_ORIGIN = 'https://www.vridhio.com' as const

export const SITE = {
  origin: SITE_ORIGIN,
  name: 'Vridhio',
  /** Styled brand mark used in UI (footer / wordmark). */
  nameStyled: 'Vridhiō',
  tagline: 'Where Bold Strategy Meets Innovation.',
  /** Primary public contact channels present on the current site. */
  email: 'tech@vridhio.com',
  telephone: '+919347171519',
  locale: 'en_US',
  lang: 'en',
} as const

/**
 * Homepage social preview image — measured from public/assets/og-image.png
 * (1731×909 PNG ≈ 1.91:1, hosted under www).
 */
export const OG_IMAGE = {
  path: '/assets/og-image.png',
  width: 1731,
  height: 909,
  type: 'image/png',
  alt: 'Vridhio — We Build Websites, Apps & Marketing That Convert, with brand portrait',
} as const

/** Build an absolute www URL from a path (leading slash optional). */
export function absoluteUrl(path: string = '/'): string {
  if (/^https?:\/\//i.test(path)) return path
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_ORIGIN}${normalized}`
}

export function absoluteOgImageUrl(): string {
  return absoluteUrl(OG_IMAGE.path)
}

export type PageSeo = {
  path: string
  title: string
  description: string
  /** Absolute canonical URL for this page. */
  canonical: string
  robots?: string
  ogType?: 'website' | 'article'
  /** Absolute OG/Twitter image URL, or null when no suitable asset exists yet. */
  image: string | null
  imageAlt?: string
  imageWidth?: number
  imageHeight?: number
  imageType?: string
}

/**
 * Homepage SEO — derived from current hero/footer positioning, not legacy Veltrix metadata.
 */
export const HOME_SEO: PageSeo = {
  path: '/',
  title: 'Vridhio — Websites, Apps & Marketing That Convert',
  description:
    'Vridhio builds high-performing websites, apps, and result-driven marketing strategies that grow revenue for startups and ambitious businesses.',
  canonical: absoluteUrl('/'),
  robots: 'index, follow',
  ogType: 'website',
  image: absoluteOgImageUrl(),
  imageAlt: OG_IMAGE.alt,
  imageWidth: OG_IMAGE.width,
  imageHeight: OG_IMAGE.height,
  imageType: OG_IMAGE.type,
}

/** Organization description grounded in current footer copy. */
export const ORGANIZATION_DESCRIPTION =
  'Vridhio is a modern technology, automation & growth company building high-performance digital systems for ambitious businesses worldwide.'

/** Canonical service page URL (trailing slash) from a catalog slug. */
export function serviceCanonicalUrl(slug: string): string {
  return absoluteUrl(`/services/${slug}/`)
}

export function buildServicePageSeo(input: {
  slug: string
  title: string
  description: string
}): PageSeo {
  return {
    path: `/services/${input.slug}/`,
    title: input.title,
    description: input.description,
    canonical: serviceCanonicalUrl(input.slug),
    robots: 'index, follow',
    ogType: 'website',
    image: absoluteOgImageUrl(),
    imageAlt: OG_IMAGE.alt,
    imageWidth: OG_IMAGE.width,
    imageHeight: OG_IMAGE.height,
    imageType: OG_IMAGE.type,
  }
}

/** Canonical guide URL (trailing slash) from a catalog slug. */
export function guideCanonicalUrl(slug: string): string {
  return absoluteUrl(`/guides/${slug}/`)
}

export function buildGuidePageSeo(input: {
  slug: string
  title: string
  description: string
}): PageSeo {
  return {
    path: `/guides/${input.slug}/`,
    title: input.title,
    description: input.description,
    canonical: guideCanonicalUrl(input.slug),
    robots: 'index, follow',
    ogType: 'article',
    image: absoluteOgImageUrl(),
    imageAlt: OG_IMAGE.alt,
    imageWidth: OG_IMAGE.width,
    imageHeight: OG_IMAGE.height,
    imageType: OG_IMAGE.type,
  }
}

/** Index for the supporting-guides collection. */
export const GUIDES_INDEX_SEO: PageSeo = {
  path: '/guides/',
  title: 'Guides | Vridhio',
  description:
    'Short decision guides on website and app cost, SEO versus ads, and related choices — written to support Vridhio’s services, not to replace them.',
  canonical: absoluteUrl('/guides/'),
  robots: 'index, follow',
  ogType: 'website',
  image: absoluteOgImageUrl(),
  imageAlt: OG_IMAGE.alt,
  imageWidth: OG_IMAGE.width,
  imageHeight: OG_IMAGE.height,
  imageType: OG_IMAGE.type,
}
