import {
  ORGANIZATION_DESCRIPTION,
  SITE,
  SOCIAL_PROFILES,
  absoluteUrl,
} from './site'

/** Stable Organization entity id — Service.provider references this, not a second Organization object. */
export const ORGANIZATION_ID = absoluteUrl('/#organization')

/** Stable WebSite entity id — emitted on the homepage only. */
export const WEBSITE_ID = absoluteUrl('/#website')

/**
 * Organization JSON-LD built only from facts present on the current site.
 * Intentionally omits: foundingDate, employee counts, street address,
 * ratings, clients, and awards. sameAs lists only owner-provided official profiles.
 */
export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE.name,
    alternateName: SITE.nameStyled,
    url: absoluteUrl('/'),
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/assets/vridhio-logo.png'),
    },
    description: ORGANIZATION_DESCRIPTION,
    email: SITE.email,
    telephone: SITE.telephone,
    contactPoint: {
      '@type': 'ContactPoint',
      email: SITE.email,
      telephone: SITE.telephone,
      url: absoluteUrl('/#contact'),
    },
    sameAs: [SOCIAL_PROFILES.linkedin, SOCIAL_PROFILES.instagram],
  }
}

export function organizationJsonLdScript(): string {
  return JSON.stringify(buildOrganizationJsonLd())
}

/** Site-name signal for Google. No alternateName by design. */
export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE.name,
    url: absoluteUrl('/'),
    publisher: {
      '@id': ORGANIZATION_ID,
    },
  }
}

export function webSiteJsonLdScript(): string {
  return JSON.stringify(buildWebSiteJsonLd())
}

export function buildServiceJsonLd(input: {
  name: string
  url: string
  description: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    url: input.url,
    description: input.description,
    provider: {
      '@id': ORGANIZATION_ID,
    },
  }
}

export function buildFaqPageJsonLd(
  faqs: { question: string; answer: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function buildArticleJsonLd(input: {
  headline: string
  description: string
  url: string
  datePublished: string
  image?: string | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    url: input.url,
    mainEntityOfPage: input.url,
    datePublished: input.datePublished,
    image: input.image ?? undefined,
    publisher: {
      '@id': ORGANIZATION_ID,
    },
  }
}
