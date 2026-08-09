import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './FaqSection.css';

export interface FaqItem {
  id: string;
  num: string;
  question: string;
  answer: string;
  tags?: string[];
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-01',
    num: '01',
    question: 'What industries do you work with?',
    answer:
      'We work with ambitious businesses across technology, education, healthcare, real estate, e-commerce and professional services. Our approach changes based on the business, not the industry label.',
    tags: ['TECHNOLOGY', 'EDUCATION', 'HEALTHCARE', 'REAL ESTATE', 'E-COMMERCE'],
  },
  {
    id: 'faq-02',
    num: '02',
    question: 'How long does a typical project take?',
    answer:
      'Most projects take between 2–8 weeks depending on scope, complexity and the number of services involved. We define the timeline before development begins.',
    tags: ['2–8 WEEKS AVG', 'AGILE ROADMAP', 'CLEAR TIMELINES'],
  },
  {
    id: 'faq-03',
    num: '03',
    question: 'Do you offer custom marketing strategies?',
    answer:
      'Yes. We build marketing around your business goals, audience and growth stage rather than applying a fixed package.',
    tags: ['CUSTOM FUNNELS', 'RETENTION FLOWS', 'REVENUE FIRST'],
  },
  {
    id: 'faq-04',
    num: '04',
    question: 'Can you manage our social media accounts?',
    answer:
      'Yes. We can handle strategy, content planning, creative direction and ongoing management depending on what your business needs.',
    tags: ['CREATIVE DIRECTION', 'CONTENT STRATEGY', 'ORGANIC & PAID'],
  },
  {
    id: 'faq-05',
    num: '05',
    question: "What's the first step to working with you?",
    answer:
      'Start with a conversation. We understand your goals, identify the biggest opportunities and then recommend the right combination of strategy, design, technology and growth.',
    tags: ['STRATEGY CALL', 'NO OBLIGATION', 'CUSTOM ROADMAP'],
  },
];

export interface FaqSectionProps {
  onBookCall?: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onBookCall }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faqs" className="faq-section" aria-label="Frequently Asked Questions">
      {/* Background Grid & Ambient Tint */}
      <div className="faq-bg-grid" aria-hidden="true" />
      <div className="faq-bg-glow" aria-hidden="true" />

      <div className="faq-container">
        <div className="faq-grid">
          {/* LEFT COLUMN: Editorial Header & Tech System Metadata */}
          <motion.div
            className="faq-left-col"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="faq-eyebrow">
              <span className="faq-eyebrow-badge">
                <span className="faq-status-dot" />
                FAQ / THE USUAL QUESTIONS
              </span>
            </div>

            {/* Technical System Status Indicator */}
            <div className="faq-system-indicator">
              <span className="faq-indicator-item">FAQ SYSTEM</span>
              <span className="faq-indicator-divider">·</span>
              <span className="faq-indicator-item">05 QUESTIONS</span>
              <span className="faq-indicator-divider">·</span>
              <span className="faq-indicator-accent">
                {activeIndex !== null ? `0${activeIndex + 1} ACTIVE` : 'READY'}
              </span>
            </div>

            <h2 className="faq-headline">
              Got questions?<br />
              <span className="faq-cherry-accent">Good.</span>
            </h2>

            <p className="faq-subtext">
              Here’s what businesses usually want to know before working with us.
            </p>

            {/* CTA Box at Bottom of Left Column (Desktop) */}
            <div className="faq-left-cta-wrap">
              <span className="faq-cta-label">STILL HAVE QUESTIONS?</span>
              <p className="faq-cta-quote">“Let's talk.”</p>
              <button
                type="button"
                className="faq-cta-btn"
                onClick={onBookCall}
              >
                <span>START A CONVERSATION</span>
                <span className="faq-cta-arrow" aria-hidden="true">→</span>
              </button>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Asymmetric Editorial FAQ List */}
          <div className="faq-right-col">
            <ol className="faq-list">
              {FAQ_DATA.map((item, idx) => {
                const isOpen = activeIndex === idx;

                return (
                  <motion.li
                    key={item.id}
                    className={`faq-item ${isOpen ? 'is-active' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{
                      duration: 0.5,
                      delay: idx * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <button
                      type="button"
                      className="faq-trigger"
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${item.id}`}
                      id={`faq-trigger-${item.id}`}
                    >
                      <div className="faq-trigger-left">
                        <span className="faq-num">{item.num}</span>
                        <span className="faq-question-text">{item.question}</span>
                      </div>

                      {/* Animated Indicator (+ to ×) */}
                      <div className="faq-icon-wrap" aria-hidden="true">
                        <motion.span
                          className="faq-icon-symbol"
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        >
                          +
                        </motion.span>
                      </div>

                      {/* Subtle Hover Underline */}
                      <div className="faq-hover-line" />
                    </button>

                    {/* Answer Reveal Accordion */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-answer-${item.id}`}
                          role="region"
                          aria-labelledby={`faq-trigger-${item.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="faq-answer-container"
                        >
                          <div className="faq-answer-content">
                            <p className="faq-answer-text">
                              “{item.answer}”
                            </p>

                            {item.tags && item.tags.length > 0 && (
                              <div className="faq-tags-row">
                                {item.tags.map((tag) => (
                                  <span key={tag} className="faq-tag">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </ol>

            {/* Mobile CTA (shown at bottom of list on small viewports) */}
            <div className="faq-mobile-cta-wrap">
              <span className="faq-cta-label">STILL HAVE QUESTIONS?</span>
              <p className="faq-cta-quote">“Let's talk.”</p>
              <button
                type="button"
                className="faq-cta-btn"
                onClick={onBookCall}
              >
                <span>START A CONVERSATION</span>
                <span className="faq-cta-arrow" aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
