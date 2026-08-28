import type { PageContextServer } from 'vike/types'
import type { Data } from './+data'

export function description(pageContext: PageContextServer<Data>) {
  return pageContext.data.seo.description
}
