import type { PageContextServer } from 'vike/types'
import type { Data } from './+data'

export function image(pageContext: PageContextServer<Data>) {
  return pageContext.data.seo.image ?? undefined
}
