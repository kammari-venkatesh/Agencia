import { SERVICE_CATALOG } from './services'

export const FOOTER_TAGLINE = 'Bold Strategy Meets Innovation'

export const FOOTER_SERVICES = SERVICE_CATALOG.map((service) => service.name)

export const FOOTER_SOCIAL = [
  { label: 'Instagram', href: 'https://www.instagram.com/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
] as const
