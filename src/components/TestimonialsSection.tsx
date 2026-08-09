import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OptionWheel from './OptionWheel';
import { getLenis } from '../motion/SmoothScroll';
import './TestimonialsSection.css';

export interface TestimonialItem {
  id: string;
  category: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
  metric: string;
  metricLabel: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: '01',
    category: 'Real Estate',
    quote: "Vridhiō understood our business economics before writing a single line of code. They didn't just redesign our portal — they restructured our entire lead funnel for high-intent luxury homebuyers.",
    name: 'Vikramaditya Singhania',
    role: 'Managing Director',
    company: 'Aura Luxury Residences',
    initials: 'VS',
    metric: '+38%',
    metricLabel: 'QUALIFIED ENQUIRIES',
  },
  {
    id: '02',
    category: 'Healthcare',
    quote: 'Most agencies give you pretty templates that crash under traffic spikes. Vridhiō engineered a sub-second patient booking platform that doubled our appointment conversions across 14 locations.',
    name: 'Dr. Ananya Reddy',
    role: 'Founder & CEO',
    company: 'Reddy Health Systems',
    initials: 'AR',
    metric: '2.4×',
    metricLabel: 'PATIENT BOOKINGS',
  },
  {
    id: '03',
    category: 'Education',
    quote: 'Vridhiō brought strategy, technology and marketing together instead of treating them as separate projects. We finally have a digital system that supports our rapid pan-India student enrollment growth.',
    name: 'Rahul Varma',
    role: 'Co-Founder & COO',
    company: 'NexGen Academy',
    initials: 'RV',
    metric: '+42%',
    metricLabel: 'LEAD CONVERSION',
  },
  {
    id: '04',
    category: 'E-commerce',
    quote: 'Our ad spend was burning money with low repeat purchases. Vridhiō overhauled our storefront UX and automated CRM retention flows, which immediately lifted customer lifetime value.',
    name: 'Karan Mehta',
    role: 'Head of Growth',
    company: 'Sattva D2C Brands',
    initials: 'KM',
    metric: '+64%',
    metricLabel: 'REPEAT PURCHASE RATE',
  },
  {
    id: '05',
    category: 'Technology',
    quote: 'The engineering speed and visual polish were exceptional. They delivered an enterprise-ready B2B platform in weeks, giving us immediate credibility with global enterprise buyers.',
    name: 'Priya Nair',
    role: 'Chief Product Officer',
    company: 'Strata SaaS Labs',
    initials: 'PN',
    metric: '<0.4s',
    metricLabel: 'PAGE LOAD SPEED',
  },
];

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= breakpoint;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [breakpoint]);

  return isMobile;
}

/* ==========================================================================
   DESKTOP EXPERIENTIAL TESTIMONIALS (>= 769px) — OptionWheel + Pinned Scroll
   ========================================================================== */
const ClientTestimonialsDesktop: React.FC<{ items: TestimonialItem[] }> = ({ items }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isManualClickRef = useRef<boolean>(false);
  const manualTimeoutRef = useRef<number | null>(null);

  const current = items[selectedIndex] || items[0];
  const categories = items.map((t) => t.category);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      if (!wrapperRef.current || isManualClickRef.current) return;

      const rect = wrapperRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollDistance = rect.height - windowHeight;

      if (totalScrollDistance <= 0) return;

      const rawProgress = -rect.top / totalScrollDistance;
      const progress = Math.min(Math.max(rawProgress, 0), 1);

      const targetIndex = Math.min(
        items.length - 1,
        Math.floor(progress * items.length)
      );

      setSelectedIndex(targetIndex);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(rafId);
      if (manualTimeoutRef.current) clearTimeout(manualTimeoutRef.current);
    };
  }, [items.length]);

  const handleSelectCategory = useCallback(
    (index: number) => {
      setSelectedIndex(index);

      if (!wrapperRef.current) return;

      isManualClickRef.current = true;
      if (manualTimeoutRef.current) clearTimeout(manualTimeoutRef.current);

      const rect = wrapperRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollDistance = rect.height - windowHeight;

      if (totalScrollDistance > 0) {
        const targetProgress = (index + 0.5) / items.length;
        const wrapperTop = rect.top + window.scrollY;
        const targetY = wrapperTop + targetProgress * totalScrollDistance;

        const lenis = getLenis();
        if (lenis) {
          lenis.scrollTo(targetY, { duration: 0.8 });
        } else {
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      }

      manualTimeoutRef.current = window.setTimeout(() => {
        isManualClickRef.current = false;
      }, 850);
    },
    [items.length]
  );

  return (
    <div ref={wrapperRef} className="ts-pinned-wrapper">
      <div className="ts-sticky-viewport">
        <section id="testimonials" className="ts-section" aria-label="Client Stories and Testimonials">
          <div className="ts-bg-glow" aria-hidden="true" />
          <div className="ts-bg-grid" aria-hidden="true" />

          <div className="ts-container">
            <motion.header
              className="ts-header"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="ts-eyebrow">
                <span className="ts-eyebrow-badge">
                  <span className="ts-status-dot" />
                  CLIENT STORIES / 01
                </span>
              </div>

              <h2 className="ts-title">
                Real businesses.{' '}
                <span className="ts-cherry-accent">Real results.</span>
              </h2>

              <p className="ts-subtitle">
                Don't take our word for it. Hear directly from the people we've built with.
              </p>
            </motion.header>

            <div className="ts-experience-grid">
              <motion.div
                className="ts-left-col"
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="ts-nav-header-bar">
                  <span className="ts-nav-label">SELECT A CLIENT</span>
                  <span className="ts-nav-code">[ {selectedIndex + 1} / {items.length} ]</span>
                </div>

                <div className="ts-wheel-wrapper">
                  <div className="ts-index-list" aria-hidden="true">
                    {items.map((t, idx) => (
                      <span
                        key={t.id}
                        className={`ts-index-item ${idx === selectedIndex ? 'active' : ''}`}
                        onClick={() => handleSelectCategory(idx)}
                      >
                        {t.id}
                      </span>
                    ))}
                  </div>

                  <OptionWheel
                    items={categories}
                    defaultSelected={selectedIndex}
                    textColor="#a6a6a6"
                    activeColor="#111111"
                    side="left"
                    fontSize={2.4}
                    spacing={1.4}
                    curve={1}
                    tilt={6}
                    blur={1.5}
                    fade={0.25}
                    smoothing={200}
                    inset={45}
                    loop={false}
                    draggable
                    onChange={(index) => handleSelectCategory(index)}
                  />
                </div>

                <div className="ts-nav-footer-bar">
                  <span className="ts-drag-hint">DRAG / SCROLL TO EXPLORE</span>
                  <div className="ts-progress-bar-wrap">
                    <div
                      className="ts-progress-bar-fill"
                      style={{ width: `${((selectedIndex + 1) / items.length) * 100}%` }}
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="ts-right-col"
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <AnimatePresence mode="wait">
                  <motion.article
                    key={current.id}
                    className="ts-story-content"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="ts-story-meta-top">
                      <span className="ts-story-number">CLIENT STORY / {current.id}</span>
                      <span className="ts-category-tag">{current.category}</span>
                    </div>

                    <div className="ts-quote-mark-icon" aria-hidden="true">
                      “
                    </div>

                    <blockquote className="ts-quote-text">
                      “{current.quote}”
                    </blockquote>

                    <div className="ts-story-footer-grid">
                      <div className="ts-client-identity">
                        <div className="ts-avatar-monogram" aria-hidden="true">
                          <span>{current.initials}</span>
                        </div>
                        <div className="ts-client-details">
                          <h4 className="ts-client-name">{current.name}</h4>
                          <p className="ts-client-role">
                            {current.role} · <span className="ts-company-name">{current.company}</span>
                          </p>
                        </div>
                      </div>

                      <div className="ts-result-metric-card">
                        <span className="ts-metric-num">{current.metric}</span>
                        <span className="ts-metric-label">{current.metricLabel}</span>
                      </div>
                    </div>
                  </motion.article>
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

/* ==========================================================================
   MOBILE EDITORIAL TESTIMONIALS (<= 768px) — Touch Swipe + Category Selector
   ========================================================================== */
const ClientTestimonialsMobile: React.FC<{ items: TestimonialItem[] }> = ({ items }) => {
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selectedIndex = ((page % items.length) + items.length) % items.length;
  const current = items[selectedIndex] || items[0];

  const paginate = useCallback(
    (newDirection: number) => {
      const nextIdx = selectedIndex + newDirection;
      if (nextIdx >= 0 && nextIdx < items.length) {
        setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
        setHasInteracted(true);
      }
    },
    [selectedIndex, items.length]
  );

  const selectIndex = useCallback(
    (targetIdx: number) => {
      if (targetIdx === selectedIndex) return;
      const dir = targetIdx > selectedIndex ? 1 : -1;
      setPage([targetIdx, dir]);
      setHasInteracted(true);
    },
    [selectedIndex]
  );

  useEffect(() => {
    const activeTab = tabRefs.current[selectedIndex];
    if (activeTab) {
      activeTab.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [selectedIndex]);

  const storyVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 24 : -24,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -24 : 24,
      opacity: 0,
    }),
  };

  return (
    <section id="testimonials" className="ts-mobile-section" aria-label="Client Stories and Testimonials">
      <div className="ts-mobile-container">
        {/* MOBILE HEADER */}
        <div className="ts-mobile-header">
          <span className="ts-mobile-eyebrow">CLIENT STORIES</span>
          <h2 className="ts-mobile-title">
            Real businesses.<br />
            <span className="ts-cherry-accent">Real results.</span>
          </h2>
        </div>

        {/* HORIZONTAL CLIENT CATEGORY SELECTOR */}
        <div className="ts-mobile-category-bar" role="tablist">
          {items.map((t, idx) => {
            const isActive = idx === selectedIndex;
            return (
              <button
                key={t.id}
                ref={(el) => { tabRefs.current[idx] = el; }}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`ts-mobile-category-tab ${isActive ? 'active' : ''}`}
                onClick={() => selectIndex(idx)}
              >
                <span>{t.category.toUpperCase()}</span>
                {isActive && (
                  <motion.div
                    className="ts-mobile-active-line"
                    layoutId="mobileActiveTabLine"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* EDITORIAL TESTIMONIAL STORY CONTENT */}
        <div className="ts-mobile-story-viewport">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.article
              key={current.id}
              custom={direction}
              variants={storyVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, { offset, velocity }) => {
                const swipeThreshold = 40;
                if (offset.x < -swipeThreshold || velocity.x < -400) {
                  paginate(1);
                } else if (offset.x > swipeThreshold || velocity.x > 400) {
                  paginate(-1);
                }
              }}
              className="ts-mobile-story-card"
            >
              {/* TOP METADATA */}
              <div className="ts-mobile-story-meta">
                <span className="ts-mobile-story-num">{current.id} / 0{items.length}</span>
                <span className="ts-mobile-story-category">{current.category.toUpperCase()}</span>
              </div>

              {/* EDITORIAL QUOTE */}
              <blockquote className="ts-mobile-quote">
                “{current.quote}”
              </blockquote>

              {/* BUSINESS RESULT METRIC */}
              <div className="ts-mobile-metric-block">
                <motion.span
                  key={current.metric}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="ts-mobile-metric-num"
                >
                  {current.metric}
                </motion.span>
                <span className="ts-mobile-metric-label">{current.metricLabel}</span>
              </div>

              {/* CLIENT IDENTITY */}
              <div className="ts-mobile-client-row">
                <div className="ts-mobile-avatar" aria-hidden="true">
                  <span>{current.initials}</span>
                </div>
                <div className="ts-mobile-client-info">
                  <h4 className="ts-mobile-client-name">{current.name}</h4>
                  <p className="ts-mobile-client-role">
                    {current.role} · {current.company}
                  </p>
                </div>
              </div>

              {/* SWIPE HINT & PROGRESS */}
              <div className={`ts-mobile-swipe-hint ${hasInteracted ? 'interacted' : ''}`}>
                <span>{selectedIndex < items.length - 1 ? 'SWIPE FOR NEXT' : 'SWIPE TO EXPLORE'}</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                >
                  →
                </motion.span>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export const TestimonialsSection: React.FC = () => {
  const isMobile = useIsMobile(768);

  if (isMobile) {
    return <ClientTestimonialsMobile items={TESTIMONIALS} />;
  }

  return <ClientTestimonialsDesktop items={TESTIMONIALS} />;
};

export default TestimonialsSection;

