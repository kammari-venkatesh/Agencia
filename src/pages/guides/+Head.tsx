import { GUIDES_INDEX_SEO, SITE } from '../../seo/site'

/**
 * Guides index head tags (canonical, robots, OG/Twitter extras).
 * title / description / og:title / og:description / og:image come from +config via vike-react.
 */
export default function Head() {
  const image = GUIDES_INDEX_SEO.image

  return (
    <>
      <link rel="canonical" href={GUIDES_INDEX_SEO.canonical} />
      <meta name="robots" content={GUIDES_INDEX_SEO.robots ?? 'index, follow'} />

      <meta property="og:type" content={GUIDES_INDEX_SEO.ogType ?? 'website'} />
      <meta property="og:url" content={GUIDES_INDEX_SEO.canonical} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content={SITE.locale} />
      <meta name="twitter:card" content="summary_large_image" />

      {image ? (
        <>
          <meta property="og:image:secure_url" content={image} />
          {GUIDES_INDEX_SEO.imageType ? (
            <meta property="og:image:type" content={GUIDES_INDEX_SEO.imageType} />
          ) : null}
          {GUIDES_INDEX_SEO.imageWidth != null ? (
            <meta property="og:image:width" content={String(GUIDES_INDEX_SEO.imageWidth)} />
          ) : null}
          {GUIDES_INDEX_SEO.imageHeight != null ? (
            <meta property="og:image:height" content={String(GUIDES_INDEX_SEO.imageHeight)} />
          ) : null}
          {GUIDES_INDEX_SEO.imageAlt ? (
            <meta property="og:image:alt" content={GUIDES_INDEX_SEO.imageAlt} />
          ) : null}
        </>
      ) : null}

      <meta name="twitter:title" content={GUIDES_INDEX_SEO.title} />
      <meta name="twitter:description" content={GUIDES_INDEX_SEO.description} />
      {image ? <meta name="twitter:image" content={image} /> : null}
      {image && GUIDES_INDEX_SEO.imageAlt ? (
        <meta name="twitter:image:alt" content={GUIDES_INDEX_SEO.imageAlt} />
      ) : null}
    </>
  )
}
