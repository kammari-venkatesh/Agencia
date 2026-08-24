import {
  ORGANIZATION_DESCRIPTION,
  SITE,
  absoluteUrl,
} from './site'

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
    name: SITE.name,
    alternateName: SITE.nameStyled,
    url: absoluteUrl('/'),
    description: ORGANIZATION_DESCRIPTION,
    email: SITE.email,
    telephone: SITE.telephone,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: SITE.email,
      telephone: SITE.telephone,
      url: absoluteUrl('/#contact'),
    },
  }
}

export function organizationJsonLdScript(): string {
  return JSON.stringify(buildOrganizationJsonLd())
}
