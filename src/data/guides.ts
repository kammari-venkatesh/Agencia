/**
 * Canonical supporting-guide catalog — only these slugs resolve under /guides/.
 * Do not add parallel guide lists. Unknown slugs 404.
 */

import type { ServiceId } from './services'

export type GuideId =
  | 'website-development-cost-india'
  | 'mobile-app-development-cost-india'
  | 'seo-vs-google-ads'
  | 'google-ads-vs-meta-ads'
  | 'custom-website-vs-website-builder'
  | 'seo-cost-india'

export type GuideCategory = 'cost' | 'comparison'

export type GuidePriority = 'p0' | 'p1'

export type GuideCatalogEntry = {
  id: GuideId
  name: string
  slug: string
  /** Short index-card description — not the article meta description. */
  description: string
  category: GuideCategory
  priority: GuidePriority
  parentIds: readonly ServiceId[]
  /** ISO date stored with the catalog — used for Article datePublished. */
  datePublished: string
}

export const GUIDE_CATALOG: readonly GuideCatalogEntry[] = [
  {
    id: 'website-development-cost-india',
    name: 'Website development cost in India',
    slug: 'website-development-cost-india',
    description:
      'What actually drives website pricing — scope, design, integrations, and ongoing work — without a fake rate card.',
    category: 'cost',
    priority: 'p0',
    parentIds: ['website-development'],
    datePublished: '2026-08-29',
  },
  {
    id: 'mobile-app-development-cost-india',
    name: 'Mobile app development cost in India',
    slug: 'mobile-app-development-cost-india',
    description:
      'How app cost is shaped by platforms, screens, backend work, and launch — not a single published price.',
    category: 'cost',
    priority: 'p0',
    parentIds: ['app-development'],
    datePublished: '2026-08-29',
  },
  {
    id: 'seo-vs-google-ads',
    name: 'SEO vs Google Ads',
    slug: 'seo-vs-google-ads',
    description:
      'When organic search and paid search each make sense, and when using both is the more honest plan.',
    category: 'comparison',
    priority: 'p0',
    parentIds: ['seo', 'google-ads'],
    datePublished: '2026-08-29',
  },
  {
    id: 'google-ads-vs-meta-ads',
    name: 'Google Ads vs Meta Ads',
    slug: 'google-ads-vs-meta-ads',
    description:
      'Search demand capture versus paid social discovery — and how to choose without a universal ROI claim.',
    category: 'comparison',
    priority: 'p0',
    parentIds: ['google-ads', 'meta-ads'],
    datePublished: '2026-08-29',
  },
  {
    id: 'custom-website-vs-website-builder',
    name: 'Custom website vs website builder',
    slug: 'custom-website-vs-website-builder',
    description:
      'A balanced look at builders versus custom development — speed, control, and when each is enough.',
    category: 'comparison',
    priority: 'p1',
    parentIds: ['website-development'],
    datePublished: '2026-08-29',
  },
  {
    id: 'seo-cost-india',
    name: 'SEO cost in India',
    slug: 'seo-cost-india',
    description:
      'Why SEO quotes vary, what a proposal should include, and how to compare scope instead of a single number.',
    category: 'cost',
    priority: 'p1',
    parentIds: ['seo'],
    datePublished: '2026-08-29',
  },
]

export const GUIDE_CATEGORY_LABEL: Record<GuideCategory, string> = {
  cost: 'Cost',
  comparison: 'Comparison',
}

export function getGuideBySlug(slug: string): GuideCatalogEntry | undefined {
  return GUIDE_CATALOG.find((guide) => guide.slug === slug)
}

export function isGuideSlug(slug: string): boolean {
  return GUIDE_CATALOG.some((guide) => guide.slug === slug)
}

export function guideHref(slug: string): string {
  return `/guides/${slug}/`
}

export const GUIDES_INDEX_HREF = '/guides/'
