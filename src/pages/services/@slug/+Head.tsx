import { useData } from 'vike-react/useData'
import { buildFaqPageJsonLd, buildServiceJsonLd } from '../../../seo/schema'
import { SITE } from '../../../seo/site'
import type { Data } from './+data'

/**
 * Service-page head tags (canonical, robots, OG/Twitter extras).
 * title / description / og:title / og:description / og:image come from +config via vike-react.
 * Organization JSON-LD stays in the global pages/+Head.tsx (one per page).
 */
export default function Head() {
  const page = useData<Data>()
  const { seo, copy, name } = page
  const image = seo.image
  const serviceJsonLd = JSON.stringify(
    buildServiceJsonLd({
      name,
      url: seo.canonical,
      description: copy.intro,
    }),
  )
  const faqJsonLd =
    copy.faqs.length > 0 ? JSON.stringify(buildFaqPageJsonLd(copy.faqs)) : null

  return (
    <>
      <link rel="canonical" href={seo.canonical} />
      <meta name="robots" content={seo.robots ?? 'index, follow'} />

      <meta property="og:type" content={seo.ogType ?? 'website'} />
      <meta property="og:url" content={seo.canonical} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content={SITE.locale} />

      {image ? (
        <>
          <meta property="og:image:secure_url" content={image} />
          {seo.imageType ? (
            <meta property="og:image:type" content={seo.imageType} />
          ) : null}
          {seo.imageWidth != null ? (
            <meta property="og:image:width" content={String(seo.imageWidth)} />
          ) : null}
          {seo.imageHeight != null ? (
            <meta property="og:image:height" content={String(seo.imageHeight)} />
          ) : null}
          {seo.imageAlt ? (
            <meta property="og:image:alt" content={seo.imageAlt} />
          ) : null}
        </>
      ) : null}

      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      {image ? <meta name="twitter:image" content={image} /> : null}
      {image && seo.imageAlt ? (
        <meta name="twitter:image:alt" content={seo.imageAlt} />
      ) : null}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serviceJsonLd }}
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: faqJsonLd }}
        />
      ) : null}
    </>
  )
}
