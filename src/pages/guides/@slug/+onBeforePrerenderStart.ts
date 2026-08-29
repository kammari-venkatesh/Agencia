import { GUIDE_CATALOG } from '../../../data/guides'

/** Only catalog slugs are prerendered — never invented or rejected guide URLs. */
export function onBeforePrerenderStart() {
  return GUIDE_CATALOG.map((guide) => `/guides/${guide.slug}`)
}
