import { render } from 'vike/abort'
import type { PageContextServer } from 'vike/types'
import { getGuidePageBySlug, type ResolvedGuidePage } from '../../../data/guidePages'

export type Data = ResolvedGuidePage

/**
 * Resolve catalog slug → guide. Unknown slugs are not guide pages.
 */
export function data(pageContext: PageContextServer): Data {
  const slug = pageContext.routeParams.slug
  const page = getGuidePageBySlug(slug ?? '')
  if (!page) {
    throw render(404)
  }
  return page
}
