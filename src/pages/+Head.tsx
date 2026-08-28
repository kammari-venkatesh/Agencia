import { GOOGLE_FONTS_STYLESHEET } from '../seo/fonts'
import { organizationJsonLdScript } from '../seo/schema'

/**
 * Global head tags (cumulative). Page-specific SEO lives in each route's +Head / +config.
 */
export default function Head() {
  return (
    <>
      <meta name="theme-color" content="#0a0a0a" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={GOOGLE_FONTS_STYLESHEET} />
      <link rel="preconnect" href="https://app.cal.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://cal.com" crossOrigin="anonymous" />
      <script
        type="application/ld+json"
        // Organization schema — facts only from current site content.
        dangerouslySetInnerHTML={{ __html: organizationJsonLdScript() }}
      />
    </>
  )
}
