import {
  ORGANIZATION_DESCRIPTION,
  SITE,
  absoluteUrl,
} from './site'

/** Stable Organization entity id — Service.provider references this, not a second Organization object. */
export const ORGANIZATION_ID = absoluteUrl('/#organization')

/**
 * Organization JSON-LD built only from facts present on the current site.
 * Intentionally omits: foundingDate, employee counts, sameAs social profiles
 * (footer Instagram/LinkedIn hrefs are platform roots, not verified profiles),
 * street address, ratings, clients, and awards.
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
  }
}

export function organizationJsonLdScript(): string {
  return JSON.stringify(buildOrganizationJsonLd())
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
