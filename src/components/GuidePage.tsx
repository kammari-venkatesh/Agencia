import { Fragment, type ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import type { ResolvedGuidePage } from '../data/guidePages'
import { GUIDE_CATEGORY_LABEL, GUIDES_INDEX_HREF, guideHref } from '../data/guides'
import { getServiceById, serviceHref } from '../data/services'
import './ServicePage.css'
import './GuidePage.css'

const CONTACT_HREF = '/#contact'

const TOKEN_RE = /\[\[([^\]]+)\]\]/g

function splitParagraphs(text: string) {
  return text
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean)
}

function renderRichText(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let key = 0

  for (const match of text.matchAll(TOKEN_RE)) {
    const index = match.index ?? 0
    if (index > lastIndex) {
      nodes.push(
        <Fragment key={`t-${key++}`}>{text.slice(lastIndex, index)}</Fragment>,
      )
    }

    const inner = match[1] ?? ''
    const isGuide = inner.startsWith('guide:')
    const payload = isGuide ? inner.slice('guide:'.length) : inner
    const [id, customLabel] = payload.split('|').map((part) => part.trim())

    if (isGuide && id) {
      nodes.push(
        <a key={`t-${key++}`} href={guideHref(id)}>
          {customLabel || id}
        </a>,
      )
    } else if (id) {
      const service = getServiceById(id)
      if (service) {
        nodes.push(
          <a key={`t-${key++}`} href={serviceHref(service.slug)}>
            {customLabel || service.name}
          </a>,
        )
      } else {
        nodes.push(<Fragment key={`t-${key++}`}>{match[0]}</Fragment>)
      }
    }

    lastIndex = index + match[0].length
  }

  if (lastIndex < text.length) {
    nodes.push(<Fragment key={`t-${key++}`}>{text.slice(lastIndex)}</Fragment>)
  }

  return nodes
}

function RichParagraphs({ text }: { text: string }) {
  return (
    <>
      {splitParagraphs(text).map((paragraph) => (
        <p key={paragraph}>{renderRichText(paragraph)}</p>
      ))}
    </>
  )
}

export default function GuidePage({ page }: { page: ResolvedGuidePage }) {
  const { copy, related, name } = page

  return (
    <article className="svc-page guide-page">
      <div className="svc-inner">
        <nav className="svc-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span className="svc-breadcrumb-sep" aria-hidden="true">
            /
          </span>
          <a href={GUIDES_INDEX_HREF}>Guides</a>
          <span className="svc-breadcrumb-sep" aria-hidden="true">
            /
          </span>
          <span className="svc-breadcrumb-current">{name}</span>
        </nav>

        <p className="svc-kicker">{GUIDE_CATEGORY_LABEL[page.category]}</p>
        <h1 className="svc-h1">{copy.h1}</h1>
        <p className="svc-intro">{copy.intro}</p>
        <div className="svc-hero-cta">
          <a href={CONTACT_HREF} className="svc-cta-primary">
            Book a consultation
            <ArrowRight size={18} />
          </a>
          <a href={GUIDES_INDEX_HREF} className="svc-cta-secondary">
            All guides
          </a>
        </div>

        {copy.sections.map((section) => (
          <section key={section.heading} className="svc-section">
            <h2>{section.heading}</h2>
            {section.body ? <RichParagraphs text={section.body} /> : null}
            {section.table ? (
              <div className="guide-table-wrap">
                <table className="guide-table">
                  <thead>
                    <tr>
                      {section.table.headers.map((header) => (
                        <th key={header || 'empty'}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row) => (
                      <tr key={row.join('|')}>
                        {row.map((cell, cellIndex) => (
                          <td key={`${cellIndex}-${cell}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
            {section.bullets && section.bullets.length > 0 ? (
              <ul className="guide-bullets">
                {section.bullets.map((item) => (
                  <li key={item}>{renderRichText(item)}</li>
                ))}
              </ul>
            ) : null}
            {section.subsections?.map((sub) => (
              <div key={sub.heading} className="guide-subsection">
                <h3>{sub.heading}</h3>
                {sub.body ? <RichParagraphs text={sub.body} /> : null}
                {sub.bullets && sub.bullets.length > 0 ? (
                  <ul className="guide-bullets">
                    {sub.bullets.map((item) => (
                      <li key={item}>{renderRichText(item)}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </section>
        ))}

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
            If this guide helped you frame the decision, we can talk through scope
            in a consultation. We are based in India and work with businesses
            globally.
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
