import { SERVICE_CATALOG } from '../../../data/services'

/** Only catalog slugs are prerendered — never invented or retired service URLs. */
export function onBeforePrerenderStart() {
  return SERVICE_CATALOG.map((service) => `/services/${service.slug}`)
}
