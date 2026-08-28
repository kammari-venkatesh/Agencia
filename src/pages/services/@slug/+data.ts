import { render } from 'vike/abort'
import type { PageContextServer } from 'vike/types'
import { getServicePageBySlug, type ResolvedServicePage } from '../../../data/servicePages'

export type Data = ResolvedServicePage

/**
 * Resolve catalog slug → page. Unknown slugs are not service pages.
 */
export function data(pageContext: PageContextServer): Data {
  const slug = pageContext.routeParams.slug
  const page = getServicePageBySlug(slug ?? '')
  if (!page) {
    throw render(404)
  }
  return page
}
