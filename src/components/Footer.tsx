import type { FC, SVGProps } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone } from 'lucide-react'
import { LEAD_CONTACT } from '../data/leadCapture'
import { FOOTER_SERVICES, FOOTER_SOCIAL, FOOTER_TAGLINE } from '../data/footer'
import './Footer.css'

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect width={20} height={20} x={2} y={2} rx={5} ry={5} />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1={17.5} x2={17.51} y1={6.5} y2={6.5} />
    </svg>
  )
}

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width={4} height={12} x={2} y={9} />
      <circle cx={4} cy={4} r={2} />
    </svg>
  )
}

const socialIcons = {
  Instagram: InstagramIcon,
  LinkedIn: LinkedInIcon,
} as const

const Footer: FC = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="footer-wrapper">
      <div className="container footer">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo-link">
              <span className="footer-logo">Vridhio</span>
            </Link>
            <p className="footer-tagline">{FOOTER_TAGLINE}</p>
          </div>

          <div className="footer-col">
            <span className="footer-col-label">Services:</span>
            <nav className="footer-nav footer-services-list" aria-label="Services">
              {FOOTER_SERVICES.map((service) => (
                <Link key={service} to="/#services">
                  {service}
                </Link>
              ))}
            </nav>
          </div>

          <div className="footer-col">
            <span className="footer-col-label">Contact:</span>
            <div className="footer-contact-list">
              <a href={LEAD_CONTACT.emailHref} className="footer-contact-link">
                <Mail size={16} aria-hidden="true" />
                <span>{LEAD_CONTACT.email}</span>
              </a>
              <a href={LEAD_CONTACT.phoneHref} className="footer-contact-link">
                <Phone size={16} aria-hidden="true" />
                <span>{LEAD_CONTACT.phone}</span>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <span className="footer-col-label">Social Links:</span>
            <nav className="footer-nav footer-social-links" aria-label="Social links">
              {FOOTER_SOCIAL.map((item) => {
                const Icon = socialIcons[item.label as keyof typeof socialIcons]
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-link"
                  >
                    {Icon ? <Icon /> : null}
                    <span>{item.label}</span>
                  </a>
                )
              })}
            </nav>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {year} Vridhio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
