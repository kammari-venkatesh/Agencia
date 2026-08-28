/**
 * Canonical Vridhio service catalog — single source of truth.
 * Future homepage, contact, /services pages, SEO, schema, and sitemap
 * should import from here. Do not add parallel service lists.
 */

export const SERVICE_GROUP = {
  core: 'core',
  growth: 'growth',
} as const

export type ServiceGroupId = (typeof SERVICE_GROUP)[keyof typeof SERVICE_GROUP]

export const SERVICE_GROUP_LABEL: Record<ServiceGroupId, string> = {
  core: 'Core Services',
  growth: 'Growth & Marketing',
}

export type ServiceId =
  | 'website-development'
  | 'app-development'
  | 'ai-automation'
  | 'graphic-design'
  | 'video-editing'
  | 'seo'
  | 'google-ads'
  | 'meta-ads'
  | 'social-media-marketing'
  | 'lead-generation'

export type ServiceCatalogEntry = {
  id: ServiceId
  name: string
  group: 'core' | 'growth'
  slug: string
}

export const SERVICE_CATALOG: readonly ServiceCatalogEntry[] = [
  {
    id: 'website-development',
    name: 'Website Development',
    group: 'core',
    slug: 'website-development',
  },
  {
    id: 'app-development',
    name: 'App Development',
    group: 'core',
    slug: 'app-development',
  },
  {
    id: 'ai-automation',
    name: 'AI Automation',
    group: 'core',
    slug: 'ai-automation',
  },
  {
    id: 'graphic-design',
    name: 'Graphic Design',
    group: 'core',
    slug: 'graphic-design',
  },
  {
    id: 'video-editing',
    name: 'Video Editing',
    group: 'core',
    slug: 'video-editing',
  },
  {
    id: 'seo',
    name: 'SEO',
    group: 'growth',
    slug: 'seo',
  },
  {
    id: 'google-ads',
    name: 'Google Ads',
    group: 'growth',
    slug: 'google-ads',
  },
  {
    id: 'meta-ads',
    name: 'Meta Ads',
    group: 'growth',
    slug: 'meta-ads',
  },
  {
    id: 'social-media-marketing',
    name: 'Social Media Marketing',
    group: 'growth',
    slug: 'social-media-marketing',
  },
  {
    id: 'lead-generation',
    name: 'Lead Generation',
    group: 'growth',
    slug: 'lead-generation',
  },
]

export const CORE_SERVICES = SERVICE_CATALOG.filter(
  (service) => service.group === 'core',
)

export const GROWTH_SERVICES = SERVICE_CATALOG.filter(
  (service) => service.group === 'growth',
)

export function getServiceById(id: string): ServiceCatalogEntry | undefined {
  return SERVICE_CATALOG.find((service) => service.id === id)
}

export function getServiceBySlug(slug: string): ServiceCatalogEntry | undefined {
  return SERVICE_CATALOG.find((service) => service.slug === slug)
}

export function isServiceSlug(slug: string): boolean {
  return SERVICE_CATALOG.some((service) => service.slug === slug)
}

/** Public service path derived from the catalog slug (trailing slash). */
export function serviceHref(slug: string): string {
  return `/services/${slug}/`
}

const serviceImage = (slug: string) => `/images/services/${slug}.png`

/** Neutral fallback if a service image fails to load */
export const SERVICE_IMAGE_FALLBACK = serviceImage('website-development')

/**
 * Homepage card copy keyed by catalog id.
 * Existing on-site copy is reused where it maps; split growth cards use minimal labels.
 */
type ServicePresentation = {
  description: string
  points: string[]
  image: string
  imageAlt: string
  imagePosition?: string
}

const SERVICE_PRESENTATION: Record<ServiceId, ServicePresentation> = {
  'website-development': {
    description:
      'We create fast, modern, and conversion-focused websites that turn visitors into paying customers.',
    points: ['Business websites', 'Landing pages', 'E-commerce websites', 'Portfolio websites'],
    image: serviceImage('website-development'),
    imageAlt: 'Professional website development workspace with modern business site on laptop',
    imagePosition: 'center 40%',
  },
  'app-development': {
    description:
      'Scalable and user-friendly mobile & web apps designed for performance, scalability, and business growth.',
    points: ['Android apps', 'iOS apps', 'Web applications', 'Admin dashboards'],
    image: serviceImage('app-development'),
    imageAlt: 'Mobile app development with smartphones showing polished app interfaces',
    imagePosition: 'center center',
  },
  'ai-automation': {
    description:
      'Custom automation systems that reduce manual work and streamline business operations efficiently.',
    points: [
      'Customer support bots',
      'WhatsApp AI bots',
      'n8n automations',
      'CRM automation',
      'AI voice assistants',
      'Appointment scheduling',
    ],
    image: serviceImage('ai-chatbots'),
    imageAlt: 'AI automation technology with conversational interface in a modern office',
    imagePosition: 'center center',
  },
  'graphic-design': {
    description: 'Creative designs that build strong brand identity and grab attention instantly.',
    points: ['Social media creatives', 'Brand identity', 'Pitch decks', 'UI/UX design'],
    image: serviceImage('graphic-designing'),
    imageAlt: 'Graphic designer creating brand visuals and creative layouts',
    imagePosition: 'center center',
  },
  'video-editing': {
    description:
      'Professional video editing solutions tailored for brands, creators, ads, and social media growth.',
    points: ['Short-form reels', 'Long-form videos', 'Brand advertisements', 'Motion graphics'],
    image: serviceImage('video-editing'),
    imageAlt: 'Video editor at professional multi-monitor editing workstation',
    imagePosition: 'center center',
  },
  seo: {
    description: 'Search engine optimization.',
    points: ['SEO', 'Organic growth'],
    image: serviceImage('content-marketing'),
    imageAlt: 'Search and content workspace',
    imagePosition: 'center center',
  },
  'google-ads': {
    description: 'Paid search advertising on Google.',
    points: ['Google ads'],
    image: serviceImage('digital-marketing'),
    imageAlt: 'Digital marketing analytics and campaign performance on devices',
    imagePosition: 'center top',
  },
  'meta-ads': {
    description: 'Paid advertising on Meta platforms.',
    points: ['Meta ads'],
    image: serviceImage('digital-marketing'),
    imageAlt: 'Digital marketing analytics and campaign performance on devices',
    imagePosition: 'center top',
  },
  'social-media-marketing': {
    description: 'Social media marketing.',
    points: [
      'Social media marketing',
      'Influencer outreach',
      'Campaign management',
      'Brand collaborations',
    ],
    image: serviceImage('influencer-marketing'),
    imageAlt: 'Social media and creator content for brand campaigns',
    imagePosition: 'center 30%',
  },
  'lead-generation': {
    description:
      'Complete sales funnel systems designed to improve conversions and scale business growth.',
    points: ['Sales funnels', 'CRM systems', 'Lead nurturing', 'Outreach systems'],
    image: serviceImage('sales-growth-systems'),
    imageAlt: 'Sales and growth strategy session with funnel planning',
    imagePosition: 'center center',
  },
}

export type ServiceOffering = ServiceCatalogEntry &
  ServicePresentation & {
    /** Homepage card title — always equals `name`. */
    title: string
  }

/** Homepage service cards — derived from SERVICE_CATALOG, not a second list. */
export const services: ServiceOffering[] = SERVICE_CATALOG.map((entry) => ({
  ...entry,
  ...SERVICE_PRESENTATION[entry.id],
  title: entry.name,
}))
