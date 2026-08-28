import type { PageContext } from 'vike/types'
import type { Data } from './+data'

export function title(pageContext: PageContext<Data>) {
  return pageContext.data.seo.title
}
