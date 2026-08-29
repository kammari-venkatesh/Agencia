import { ArrowRight } from 'lucide-react'
import {
  GUIDE_CATALOG,
  GUIDE_CATEGORY_LABEL,
  guideHref,
} from '../data/guides'
import './ServicePage.css'
import './GuidePage.css'

const CONTACT_HREF = '/#contact'

export default function GuidesIndex() {
  return (
    <article className="svc-page">
      <div className="svc-inner">
        <nav className="svc-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span className="svc-breadcrumb-sep" aria-hidden="true">
            /
          </span>
          <span className="svc-breadcrumb-current">Guides</span>
        </nav>

        <p className="svc-kicker">Editorial</p>
        <h1 className="svc-h1">Guides</h1>
        <p className="guide-index-lead">
          Short decision guides on cost, channel choice, and build approach.
          They support Vridhio’s services — they are not a news blog, and they
          are not a substitute for a scoped proposal.
        </p>

        <ul className="guide-index-list">
          {GUIDE_CATALOG.map((guide) => (
            <li key={guide.id}>
              <a className="guide-index-card" href={guideHref(guide.slug)}>
                <p className="guide-index-card-kicker">
                  {GUIDE_CATEGORY_LABEL[guide.category]}
                </p>
                <h2 className="guide-index-card-title">{guide.name}</h2>
                <p className="guide-index-card-desc">{guide.description}</p>
              </a>
            </li>
          ))}
        </ul>

        <section className="svc-cta-band guide-index-cta">
          <h2>Looking for a service instead?</h2>
          <p>
            If you already know the work you need, start from the service pages
            or book a consultation.
          </p>
          <div className="svc-hero-cta">
            <a href={CONTACT_HREF} className="svc-cta-primary">
              Book a consultation
              <ArrowRight size={18} />
            </a>
            <a href="/#services" className="svc-cta-secondary">
              All services
            </a>
          </div>
        </section>
      </div>
    </article>
  )
}
