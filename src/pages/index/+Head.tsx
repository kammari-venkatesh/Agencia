import { HOME_SEO, SITE } from '../../seo/site'

/**
 * Homepage-only head tags (canonical, robots, OG/Twitter extras).
 * title / description / og:title / og:description / og:image come from +config via vike-react.
 */
export default function Head() {
  const image = HOME_SEO.image

  return (
    <>
      <link rel="canonical" href={HOME_SEO.canonical} />
      <meta name="robots" content={HOME_SEO.robots ?? 'index, follow'} />

      <meta property="og:type" content={HOME_SEO.ogType ?? 'website'} />
      <meta property="og:url" content={HOME_SEO.canonical} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content={SITE.locale} />

      {image ? (
        <>
          <meta property="og:image:secure_url" content={image} />
          {HOME_SEO.imageType ? (
            <meta property="og:image:type" content={HOME_SEO.imageType} />
          ) : null}
          {HOME_SEO.imageWidth != null ? (
            <meta property="og:image:width" content={String(HOME_SEO.imageWidth)} />
          ) : null}
          {HOME_SEO.imageHeight != null ? (
            <meta property="og:image:height" content={String(HOME_SEO.imageHeight)} />
          ) : null}
          {HOME_SEO.imageAlt ? (
            <meta property="og:image:alt" content={HOME_SEO.imageAlt} />
          ) : null}
        </>
      ) : null}

      <meta name="twitter:title" content={HOME_SEO.title} />
      <meta name="twitter:description" content={HOME_SEO.description} />
      {image ? <meta name="twitter:image" content={image} /> : null}
      {image && HOME_SEO.imageAlt ? (
        <meta name="twitter:image:alt" content={HOME_SEO.imageAlt} />
      ) : null}
    </>
  )
}
