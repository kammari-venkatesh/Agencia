import React, { useState, useCallback, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MessageCircle, ArrowRight, Check } from 'lucide-react';
import { LEAD_CONTACT } from '../data/leadCapture';
import './LeadCaptureSection.css';

export interface ContactSectionProps {
  onBookCall?: () => void;
}

const SERVICE_CHIPS = [
  'WEBSITE DEVELOPMENT',
  'APP DEVELOPMENT',
  'AI & AUTOMATION',
  'DIGITAL MARKETING',
  'BRANDING & DESIGN',
  'OTHER',
] as const;

export const LeadCaptureSection: React.FC<ContactSectionProps> = ({ onBookCall }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>(['WEBSITE DEVELOPMENT']);
  const [message, setMessage] = useState('');

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const messageId = useId();

  // Toggle service chip selection
  const toggleService = useCallback((service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  }, []);

  // Calculate project briefing progress (0..5)
  const isNameValid = name.trim().length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPhoneValid = phone.trim().length >= 6;
  const isServicesValid = selectedServices.length > 0;
  const isMessageValid = message.trim().length >= 5;

  const filledCount =
    (isNameValid ? 1 : 0) +
    (isEmailValid ? 1 : 0) +
    (isPhoneValid ? 1 : 0) +
    (isServicesValid ? 1 : 0) +
    (isMessageValid ? 1 : 0);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!isNameValid) newErrors.name = 'Please enter your full name.';
    if (!isEmailValid) newErrors.email = 'Please enter a valid work email address.';
    if (!isPhoneValid) newErrors.phone = 'Please enter a phone or WhatsApp number.';
    if (!isServicesValid) newErrors.services = 'Please select at least one service.';
    if (!isMessageValid) newErrors.message = 'Please tell us a little about your project.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
      if (onBookCall) onBookCall();
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setSelectedServices(['WEBSITE DEVELOPMENT']);
    setMessage('');
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <section id="contact" className="cs-section" aria-label="Start a Conversation with Vridhio">
      {/* Subtle Ambient Glow & Technical Grid */}
      <div className="cs-bg-glow" aria-hidden="true" />
      <div className="cs-bg-grid" aria-hidden="true" />

      <div className="cs-container">
        {/* SECTION HEADER */}
        <motion.header
          className="cs-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="cs-eyebrow">
            <span className="cs-eyebrow-badge">
              <span className="cs-status-dot" />
              START A CONVERSATION / 01
            </span>
          </div>

          <h2 className="cs-headline">
            Got something{' '}
            <span className="cs-cherry-accent">big in mind?</span>
          </h2>

          <p className="cs-subtext">
            Tell us what you&apos;re building, where you&apos;re stuck, or where you want to go.
            We&apos;ll figure out the next move together.
          </p>
        </motion.header>

        {/* ABSTRACT CONVERSATION SIGNAL VISUAL */}
        <motion.div
          className="cs-signal-bar"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        >
          <div className="cs-signal-node">
            <span className="cs-node-dot" />
            <span className="cs-node-label">YOUR IDEA</span>
          </div>
          <div className="cs-signal-line">
            <motion.div
              className="cs-signal-pulse"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            />
          </div>
          <div className="cs-signal-node">
            <span className="cs-node-dot cs-node-dot--accent" />
            <span className="cs-node-label">STRATEGY</span>
          </div>
          <div className="cs-signal-line">
            <motion.div
              className="cs-signal-pulse"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2.4, delay: 0.8, ease: 'easeInOut' }}
            />
          </div>
          <div className="cs-signal-node">
            <span className="cs-node-dot cs-node-dot--accent" />
            <span className="cs-node-label">VRIDHIŌ GROWTH</span>
          </div>
        </motion.div>

        {/* MAIN ASYMMETRIC LAYOUT */}
        <div className="cs-grid">
          {/* LEFT COLUMN: INTERACTIVE PROJECT BRIEFING FORM */}
          <motion.div
            className="cs-left-col"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="cs-brief-header">
              <span className="cs-brief-title">LET&apos;S TALK ABOUT YOUR PROJECT</span>
              {/* Minimal Progress Indicator */}
              <div className="cs-progress-tracker">
                <span className="cs-progress-text">0{filledCount} / 05</span>
                <div className="cs-progress-track">
                  <div
                    className="cs-progress-fill"
                    style={{ width: `${(filledCount / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  className="cs-success-block"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="cs-success-icon-ring">
                    <Check size={28} strokeWidth={2.5} />
                  </div>
                  <h3 className="cs-success-heading">Message received.</h3>
                  <p className="cs-success-body">
                    Now the conversation starts. We&apos;ll review your project requirements and get back to you within 24 hours.
                  </p>
                  <button type="button" className="cs-reset-btn" onClick={resetForm}>
                    <span>SEND ANOTHER MESSAGE</span>
                    <ArrowRight size={16} />
                  </button>
                </motion.div>
              ) : (
                <form className="cs-editorial-form" onSubmit={handleSubmit} noValidate>
                  {/* FIELD 01: NAME */}
                  <div
                    className={`cs-field ${focusedField === 'name' ? 'is-focused' : ''} ${
                      isNameValid ? 'is-valid' : ''
                    } ${errors.name ? 'has-error' : ''}`}
                  >
                    <div className="cs-field-header">
                      <label htmlFor={nameId} className="cs-field-label">
                        <span className="cs-field-num">01 /</span> YOUR NAME
                      </label>
                      {isNameValid && <Check size={14} className="cs-check-icon" />}
                    </div>
                    <input
                      id={nameId}
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="e.g. Vikramaditya Singhania"
                      autoComplete="name"
                      aria-invalid={!!errors.name}
                    />
                    <div className="cs-field-line" />
                    {errors.name && <span className="cs-error-msg">{errors.name}</span>}
                  </div>

                  {/* FIELD ROW: EMAIL & PHONE */}
                  <div className="cs-field-row">
                    {/* FIELD 02: EMAIL */}
                    <div
                      className={`cs-field ${focusedField === 'email' ? 'is-focused' : ''} ${
                        isEmailValid ? 'is-valid' : ''
                      } ${errors.email ? 'has-error' : ''}`}
                    >
                      <div className="cs-field-header">
                        <label htmlFor={emailId} className="cs-field-label">
                          <span className="cs-field-num">02 /</span> WORK EMAIL
                        </label>
                        {isEmailValid && <Check size={14} className="cs-check-icon" />}
                      </div>
                      <input
                        id={emailId}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="you@company.com"
                        autoComplete="email"
                        aria-invalid={!!errors.email}
                      />
                      <div className="cs-field-line" />
                      {errors.email && <span className="cs-error-msg">{errors.email}</span>}
                    </div>

                    {/* FIELD 03: PHONE */}
                    <div
                      className={`cs-field ${focusedField === 'phone' ? 'is-focused' : ''} ${
                        isPhoneValid ? 'is-valid' : ''
                      } ${errors.phone ? 'has-error' : ''}`}
                    >
                      <div className="cs-field-header">
                        <label htmlFor={phoneId} className="cs-field-label">
                          <span className="cs-field-num">03 /</span> PHONE / WHATSAPP
                        </label>
                        {isPhoneValid && <Check size={14} className="cs-check-icon" />}
                      </div>
                      <input
                        id={phoneId}
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="+91 98765 43210"
                        autoComplete="tel"
                        aria-invalid={!!errors.phone}
                      />
                      <div className="cs-field-line" />
                      {errors.phone && <span className="cs-error-msg">{errors.phone}</span>}
                    </div>
                  </div>

                  {/* FIELD 04: SERVICE SELECTION CHIPS */}
                  <div
                    className={`cs-field cs-field-chips ${
                      errors.services ? 'has-error' : ''
                    }`}
                  >
                    <div className="cs-field-header">
                      <span className="cs-field-label">
                        <span className="cs-field-num">04 /</span> WHAT DO YOU NEED?
                      </span>
                    </div>
                    <div className="cs-chips-wrap">
                      {SERVICE_CHIPS.map((chip) => {
                        const isSelected = selectedServices.includes(chip);
                        return (
                          <button
                            key={chip}
                            type="button"
                            className={`cs-chip ${isSelected ? 'active' : ''}`}
                            onClick={() => toggleService(chip)}
                          >
                            <span>{chip}</span>
                            {isSelected && <Check size={12} strokeWidth={3} />}
                          </button>
                        );
                      })}
                    </div>
                    {errors.services && <span className="cs-error-msg">{errors.services}</span>}
                  </div>

                  {/* FIELD 05: PROJECT DESCRIPTION */}
                  <div
                    className={`cs-field ${focusedField === 'message' ? 'is-focused' : ''} ${
                      isMessageValid ? 'is-valid' : ''
                    } ${errors.message ? 'has-error' : ''}`}
                  >
                    <div className="cs-field-header">
                      <label htmlFor={messageId} className="cs-field-label">
                        <span className="cs-field-num">05 /</span> TELL US A LITTLE ABOUT IT
                      </label>
                      {isMessageValid && <Check size={14} className="cs-check-icon" />}
                    </div>
                    <textarea
                      id={messageId}
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="What's happening with the business right now? What are you trying to improve? What would success look like?"
                      aria-invalid={!!errors.message}
                    />
                    <div className="cs-field-line" />
                    {errors.message && <span className="cs-error-msg">{errors.message}</span>}
                  </div>

                  {/* SUBMIT BUTTON */}
                  <div className="cs-submit-wrap">
                    <button type="submit" className="cs-submit-btn">
                      <span>START THE CONVERSATION</span>
                      <ArrowRight size={18} className="cs-submit-arrow" />
                    </button>
                  </div>
                </form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* RIGHT COLUMN: DIRECT CONTACT CHANNELS + ISOLATED WHATSAPP HIGHLIGHT */}
          <motion.div
            className="cs-right-col"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="cs-direct-header">
              <span className="cs-direct-eyebrow">PREFER A DIRECT LINE?</span>
              <h3 className="cs-direct-headline">
                Skip the form.<br />
                Talk to us directly.
              </h3>
            </div>

            <div className="cs-channels-list">
              {/* CHANNEL 1: PHONE */}
              <a href={LEAD_CONTACT.phoneHref} className="cs-channel-item">
                <div className="cs-channel-icon">
                  <Phone size={18} />
                </div>
                <div className="cs-channel-info">
                  <span className="cs-channel-label">CALL DIRECTLY</span>
                  <span className="cs-channel-val">{LEAD_CONTACT.phone}</span>
                </div>
                <ArrowRight size={16} className="cs-channel-arrow" />
              </a>

              {/* CHANNEL 2: EMAIL */}
              <a href={LEAD_CONTACT.emailHref} className="cs-channel-item">
                <div className="cs-channel-icon">
                  <Mail size={18} />
                </div>
                <div className="cs-channel-info">
                  <span className="cs-channel-label">EMAIL US</span>
                  <span className="cs-channel-val">{LEAD_CONTACT.email}</span>
                </div>
                <ArrowRight size={16} className="cs-channel-arrow" />
              </a>

              {/* CHANNEL 3: ISOLATED WHATSAPP HIGHLIGHT BLOCK */}
              <div className="cs-whatsapp-highlight-card">
                <div className="cs-whatsapp-top">
                  <div className="cs-whatsapp-badge">
                    <span className="cs-wa-dot" />
                    QUICKEST RESPONSE
                  </div>
                  <MessageCircle size={22} className="cs-wa-icon" />
                </div>
                <h4 className="cs-whatsapp-title">WhatsApp us</h4>
                <p className="cs-whatsapp-desc">
                  Instant business communication &amp; direct team access.
                </p>
                <a
                  href={LEAD_CONTACT.whatsappHref}
                  className="cs-whatsapp-action-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>CHAT ON WHATSAPP</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>

            {/* TECHNICAL BUSINESS METADATA FOOTER */}
            <div className="cs-business-metadata">
              <div className="cs-meta-item">
                <span className="cs-meta-key">LOCATION</span>
                <span className="cs-meta-val">BASED IN INDIA · WORKING GLOBALLY</span>
              </div>
              <div className="cs-meta-item">
                <span className="cs-meta-key">HOURS</span>
                <span className="cs-meta-val">MON — SAT · BUSINESS HOURS</span>
              </div>
              <div className="cs-meta-item">
                <span className="cs-meta-key">RESPONSE TIME</span>
                <span className="cs-meta-val">WITHIN 24 HOURS</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM FINAL SECTION CTA */}
        <motion.div
          className="cs-footer-cta-bar"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="cs-footer-cta-left">
            <span className="cs-footer-cta-label">READY WHEN YOU ARE</span>
            <p className="cs-footer-cta-quote">“Tell us what&apos;s next.”</p>
          </div>
          <button type="button" className="cs-footer-cta-btn" onClick={onBookCall}>
            <span>START THE CONVERSATION</span>
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default LeadCaptureSection;
