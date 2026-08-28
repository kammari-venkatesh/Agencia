import { SERVICE_CATALOG } from './services'

/** Contact options derived from the canonical catalog. "Other" is form-only. */
export const LEAD_SERVICE_OPTIONS = [
  ...SERVICE_CATALOG.map((service) => service.name),
  'Other',
] as const

export const CONTACT_SERVICE_CHIPS = LEAD_SERVICE_OPTIONS.map((name) =>
  name.toUpperCase(),
)

export const LEAD_CONTACT = {
  phone: '+91 93471 71519',
  phoneHref: 'tel:+919347171519',
  email: 'tech@vridhio.com',
  emailHref: 'mailto:tech@vridhio.com',
  whatsappHref: 'https://wa.me/919347171519',
  whatsappLabel: 'Chat on WhatsApp',
} as const;
