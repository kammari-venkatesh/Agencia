import type { Config } from 'vike/types'
import { HOME_SEO } from '../../seo/site'

export default {
  title: HOME_SEO.title,
  description: HOME_SEO.description,
  image: HOME_SEO.image ?? undefined,
} satisfies Config
