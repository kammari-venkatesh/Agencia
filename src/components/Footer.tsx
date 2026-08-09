import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { getLenis } from '../motion/SmoothScroll';
import './Footer.css';

const exploreLinks = [
  { label: 'Services', id: 'services' },
  { label: 'System', id: 'problem-solution' },
  { label: 'Why Vridhiō', id: 'why-vridhio' },
  { label: 'FAQ', id: 'faqs' },
  { label: 'Contact', id: 'contact' },
];

const socialLinks = [
  { label: 'Instagram', handle: '@vridhio.tech', href: 'https://instagram.com' },
  { label: 'LinkedIn', handle: 'Vridhiō Growth', href: 'https://linkedin.com' },
  { label: 'WhatsApp', handle: '+91 93471 71519', href: 'https://wa.me/919347171519' },
  { label: 'Email', handle: 'tech@vridhio.com', href: 'mailto:tech@vridhio.com' },
];

const Footer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const scrollToId = () => {
      const el = document.getElementById(id);
      if (!el) return;
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(el, { offset: -80 });
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    if (location.pathname === '/') {
      void navigate({ pathname: '/', hash: `#${id}` });
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollToId);
      });
    } else {
      void navigate({ pathname: '/', hash: `#${id}` });
    }
  };

  return (
    <footer className="vrd-footer-section">
      <div className="vrd-footer-outer-container">
        {/* LARGE EDITORIAL ROUNDED FOOTER CONTAINER */}
        <div className="vrd-footer-card">

          {/* TOP EDITORIAL NAVIGATION GRID */}
          <div className="vrd-footer-top-grid">

            {/* COLUMN 1: BRAND IDENTITY & DESCRIPTION */}
            <div className="vrd-footer-col vrd-footer-col-brand">
              <Link to="/" className="vrd-footer-logo-link" onClick={(e) => handleNavClick(e, 'hero')}>
                <span className="vrd-footer-brand-name">VRIDHIŌ</span>
              </Link>
              <p className="vrd-footer-description">
                Vridhiō is a modern technology, automation & growth company building high-performance digital systems for ambitious businesses worldwide.
              </p>
              <div className="vrd-footer-status-pill">
                <span className="vrd-footer-status-dot" />
                <span>AVAILABLE FOR NEW PROJECTS — Q1/Q2 {currentYear}</span>
              </div>
            </div>

            {/* COLUMN 2: EXPLORE NAVIGATION */}
            <div className="vrd-footer-col vrd-footer-col-explore">
              <span className="vrd-footer-heading">Explore</span>
              <nav className="vrd-footer-nav">
                {exploreLinks.map((item) => (
                  <a
                    key={item.id}
                    href={`/#${item.id}`}
                    className="vrd-footer-link"
                    onClick={(e) => handleNavClick(e, item.id)}
                  >
                    <span className="vrd-link-text">{item.label}</span>
                    <span className="vrd-link-dot" />
                  </a>
                ))}
              </nav>
            </div>

            {/* COLUMN 3: CONNECT & SOCIAL */}
            <div className="vrd-footer-col vrd-footer-col-social">
              <span className="vrd-footer-heading">Connect</span>
              <ul className="vrd-footer-social-list">
                {socialLinks.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="vrd-footer-social-link"
                    >
                      <span className="vrd-social-platform">{item.label}</span>
                      <span className="vrd-social-handle">{item.handle}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* COLUMN 4: ACTION CTAS */}
            <div className="vrd-footer-col vrd-footer-col-cta">
              <div className="vrd-footer-cta-block">
                <a
                  href="/#contact"
                  className="vrd-footer-primary-cta"
                  onClick={(e) => handleNavClick(e, 'contact')}
                >
                  <div className="vrd-cta-text-wrap">
                    <span className="vrd-cta-title">Start a Project</span>
                    <span className="vrd-cta-sub">Let's build something big</span>
                  </div>
                  <div className="vrd-cta-arrow-btn">
                    <ArrowRight size={18} />
                  </div>
                </a>

                <div className="vrd-footer-secondary-cta">
                  <a
                    href="/#contact"
                    className="vrd-secondary-link"
                    onClick={(e) => handleNavClick(e, 'contact')}
                  >
                    <div className="vrd-sec-text">
                      <span className="vrd-sec-title">Book Consultation</span>
                      <span className="vrd-sec-sub">30-min strategy call</span>
                    </div>
                    <ArrowUpRight size={16} className="vrd-sec-arrow" />
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* GIANT OVERSIZED CROPPED WORDMARK AT CONTAINER BOTTOM */}
          <div className="vrd-footer-wordmark-container" aria-hidden="true">
            <motion.h1
              className="vrd-footer-giant-wordmark"
              initial={{ y: '35%', opacity: 0 }}
              whileInView={{ y: '0%', opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
            >
              VRIDHI<span className="vrd-cherry-o">Ō</span>
            </motion.h1>
          </div>

        </div>

        {/* THIN BOTTOM BAR */}
        <div className="vrd-footer-bottom-bar">
          <div className="vrd-bottom-left">
            <span className="vrd-copyright">© {currentYear} Vridhiō. All rights reserved.</span>
            <span className="vrd-bottom-sep">•</span>
            <a href="/#privacy" className="vrd-bottom-link" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <span className="vrd-bottom-sep">•</span>
            <a href="/#terms" className="vrd-bottom-link" onClick={(e) => e.preventDefault()}>Terms of Service</a>
          </div>

          <div className="vrd-bottom-right">
            <span className="vrd-location-tag">BASED IN INDIA</span>
            <span className="vrd-bottom-sep">•</span>
            <span className="vrd-location-tag">WORKING GLOBALLY</span>
            <span className="vrd-flag">🇮🇳</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
