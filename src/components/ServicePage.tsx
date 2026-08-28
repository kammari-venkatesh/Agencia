import { ArrowRight } from 'lucide-react'
import type { ResolvedServicePage } from '../data/servicePages'
import { SERVICE_GROUP_LABEL } from '../data/services'
import './ServicePage.css'

const CONTACT_HREF = '/#contact'

export default function ServicePage({ page }: { page: ResolvedServicePage }) {
  const { copy, related, name } = page

  return (
    <article className="svc-page">
      <div className="svc-inner">
        <nav className="svc-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span className="svc-breadcrumb-sep" aria-hidden="true">
            /
          </span>
          <a href="/#services">Services</a>
          <span className="svc-breadcrumb-sep" aria-hidden="true">
            /
          </span>
          <span className="svc-breadcrumb-current">{name}</span>
        </nav>

        <p className="svc-kicker">{SERVICE_GROUP_LABEL[page.group]}</p>
        <h1 className="svc-h1">{copy.h1}</h1>
        <p className="svc-intro">{copy.intro}</p>
        <div className="svc-hero-cta">
          <a href={CONTACT_HREF} className="svc-cta-primary">
            Book a consultation
            <ArrowRight size={18} />
          </a>
          <a href="/#services" className="svc-cta-secondary">
            All services
          </a>
        </div>

        <section className="svc-section">
          <h2>{copy.overviewHeading}</h2>
          <p>{copy.overview}</p>
        </section>

        <section className="svc-section">
          <h2>{copy.capabilitiesHeading}</h2>
          <div className="svc-capability-list">
            {copy.capabilities.map((block) => (
              <div key={block.heading} className="svc-capability">
                <h3>{block.heading}</h3>
                {block.body ? <p>{block.body}</p> : null}
                {block.items && block.items.length > 0 ? (
                  <ul>
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="svc-section">
          <h2>{copy.processHeading}</h2>
          <p>{copy.process}</p>
        </section>

        <section className="svc-section">
          <h2>{copy.whoForHeading}</h2>
          <p>{copy.whoFor}</p>
        </section>

        <section className="svc-section">
          <h2>{copy.whyHeading}</h2>
          <p>{copy.why}</p>
        </section>

        {copy.faqs.length > 0 ? (
          <section className="svc-section" aria-label={`${name} FAQs`}>
            <h2>FAQs</h2>
            <div className="svc-faq-list">
              {copy.faqs.map((faq) => (
                <details key={faq.question} className="svc-faq">
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        {related.length > 0 ? (
          <section className="svc-section">
            <h2>Related services</h2>
            <ul className="svc-related">
              {related.map((item) => (
                <li key={item.id}>
                  <a href={item.href}>{item.name}</a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="svc-cta-band">
          <h2>Start a project</h2>
          <p>
            Book a 30-minute consultation or tell us what you need. We are based in
            India and work with businesses globally.
          </p>
          <a href={CONTACT_HREF} className="svc-cta-primary">
            Book a consultation
            <ArrowRight size={18} />
          </a>
        </section>
      </div>
    </article>
  )
}
