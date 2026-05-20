import { useState, type FC, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Mail, MessageCircle, Phone } from 'lucide-react';
import { LEAD_CONTACT, LEAD_SERVICE_OPTIONS } from '../data/leadCapture';
import { easeIOS, sectionReveal } from '../motion/variants';
import './LeadCaptureSection.css';

type LeadCaptureSectionProps = {
  onBookCall: () => void;
};

const LeadCaptureSection: FC<LeadCaptureSectionProps> = ({ onBookCall }) => {
  const [service, setService] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onBookCall();
  };

  return (
    <section id="contact" className="lc-section" aria-labelledby="lc-heading">
      <div className="lc-bg-glow" aria-hidden="true" />
      <div className="lc-bg-glow lc-bg-glow--secondary" aria-hidden="true" />
      <div className="container lc-section-inner">
        <motion.header
          className="lc-header"
          variants={sectionReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-5% 0px', amount: 0.2 }}
        >
          <h2 id="lc-heading" className="lc-heading">
            Let&apos;s Work <span className="lc-heading-gradient">Together</span>
          </h2>
          <p className="lc-subheading">
            Tell us about your project and let&apos;s build something powerful together.
          </p>
        </motion.header>

        <motion.div
          className="lc-grid"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8% 0px', amount: 0.12 }}
          transition={{ duration: 0.75, ease: easeIOS }}
        >
          <form className="lc-form-card" onSubmit={handleSubmit} noValidate>
            <div className="lc-field">
              <label htmlFor="lc-name">Full Name</label>
              <input
                id="lc-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                required
              />
            </div>

            <div className="lc-field-row">
              <div className="lc-field">
                <label htmlFor="lc-phone">Phone Number</label>
                <input
                  id="lc-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+91 93471 71519"
                  required
                />
              </div>
              <div className="lc-field">
                <label htmlFor="lc-email">Email</label>
                <input
                  id="lc-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>

            <div className="lc-field">
              <label htmlFor="lc-service">Service Required</label>
              <div className="lc-select-wrap">
                <select
                  id="lc-service"
                  name="service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select a service
                  </option>
                  {LEAD_SERVICE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown className="lc-select-icon" size={18} aria-hidden="true" />
              </div>
            </div>

            <div className="lc-field">
              <label htmlFor="lc-message">Tell us about your project</label>
              <textarea
                id="lc-message"
                name="message"
                rows={5}
                placeholder="Share your goals, timeline, and what success looks like for your business."
                required
              />
            </div>

            <button type="submit" className="book-call-btn lc-submit-btn">
              Book a Strategy Call
            </button>
          </form>

          <aside className="lc-info-panel" aria-label="Quick contact options">
            <div className="lc-info-top">
              <h3 className="lc-info-heading">Quick Contact Options</h3>
              <p className="lc-info-trust">
                Vridhio partners with ambitious brands to design, build, and scale growth systems
                that deliver measurable results.
              </p>
            </div>

            <div className="lc-info-divider" aria-hidden="true" />

            <div className="lc-contact-cards">
              <a href={LEAD_CONTACT.phoneHref} className="lc-contact-card">
                <div className="lc-contact-icon" aria-hidden="true">
                  <Phone size={20} strokeWidth={1.75} />
                </div>
                <div className="lc-contact-body">
                  <span className="lc-contact-title">Call Us</span>
                  <span className="lc-contact-value">{LEAD_CONTACT.phone}</span>
                  <span className="lc-contact-hint">Mon–Sat, business hours</span>
                </div>
              </a>

              <a href={LEAD_CONTACT.emailHref} className="lc-contact-card">
                <div className="lc-contact-icon" aria-hidden="true">
                  <Mail size={20} strokeWidth={1.75} />
                </div>
                <div className="lc-contact-body">
                  <span className="lc-contact-title">Email</span>
                  <span className="lc-contact-value">{LEAD_CONTACT.email}</span>
                  <span className="lc-contact-hint">We respond within 24 hours</span>
                </div>
              </a>

              <div className="lc-contact-card lc-contact-card--whatsapp">
                <div className="lc-contact-icon lc-contact-icon--whatsapp" aria-hidden="true">
                  <MessageCircle size={20} strokeWidth={1.75} />
                </div>
                <div className="lc-contact-body">
                  <span className="lc-contact-title">WhatsApp</span>
                  <p className="lc-contact-desc">
                    Instant business communication &amp; automation support
                  </p>
                  <a
                    href={LEAD_CONTACT.whatsappHref}
                    className="lc-whatsapp-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {LEAD_CONTACT.whatsappLabel}
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </motion.div>
      </div>
    </section>
  );
};

export default LeadCaptureSection;
