import type { Config } from 'vike/types'
import { GUIDES_INDEX_SEO } from '../../seo/site'

export default {
  title: GUIDES_INDEX_SEO.title,
  description: GUIDES_INDEX_SEO.description,
  image: GUIDES_INDEX_SEO.image ?? undefined,
} satisfies Config
