import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'
import { HOME_SEO, SITE } from '../seo/site'

// Global defaults — homepage overrides title/description/image in index/+config.ts.
// Future pages (services, blog, about) should set their own +config from src/seo/site.ts.
export default {
  extends: [vikeReact],
  prerender: true,
  lang: SITE.lang,
  title: HOME_SEO.title,
  description: HOME_SEO.description,
  image: HOME_SEO.image ?? undefined,
} satisfies Config
