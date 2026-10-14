import { SOCIAL_PROFILES } from '../seo/site'
import { SERVICE_CATALOG } from './services'

export const FOOTER_TAGLINE = 'Bold Strategy Meets Innovation'

export const FOOTER_SERVICES = SERVICE_CATALOG.map((service) => service.name)

export const FOOTER_SOCIAL = [
  { label: 'Instagram', href: SOCIAL_PROFILES.instagram },
  { label: 'LinkedIn', href: SOCIAL_PROFILES.linkedin },
] as const
