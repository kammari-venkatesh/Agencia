import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Plus,
  XCircle,
  Palette,
  Code2,
  Megaphone,
  Users,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import Button from '../components/Button';
import { BookCallButton, BookCallModal } from '../components/BookCallModal';
import { preloadCalEmbed } from '../lib/ensureCalEmbedScript';
import Plasma from '../components/PlasmaLazy';
import { Reveal } from '../motion/Reveal';
import { getLenis } from '../motion/SmoothScroll';
import {
  easeIOS,
  dur,
  fadeUp,
  fadeUpSoft,
  imageReveal,
  slideInRight,
  staggerParent,
  staggerParentFast,
  staggerParentSlow,
  sectionReveal,
  sectionRevealLg,
} from '../motion/variants';
import { services, SERVICE_IMAGE_FALLBACK } from '../data/services';
import WhyVridhioSection from '../components/WhyVridhioSection';
import LeadCaptureSection from '../components/LeadCaptureSection';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [bookCallOpen, setBookCallOpen] = useState(false);
  const [bookCallPersist, setBookCallPersist] = useState(false);

  const openBookCall = () => {
    setBookCallPersist(true);
    setBookCallOpen(true);
  };
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const shouldReduce = useReducedMotion();

  // On first mount, if the URL has no hash, guarantee the page starts at the
  // hero. This prevents any residual scroll from a bfcache restore or a race
  // with scrollRestoration=manual from being visible to the user.
  useEffect(() => {
    if (location.hash) return;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = location.hash?.replace(/^#/, '');
    if (!id) return;
    const t = window.setTimeout(() => {
      const target = document.getElementById(id);
      if (!target) return;
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(target, { offset: -80 });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
    return () => clearTimeout(t);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    // Services horizontal-pin handler. Heavily throttled:
    //  1. Coalesced via requestAnimationFrame so it runs at most once per frame
    //     regardless of how many scroll events Lenis emits.
    //  2. Early-exits when the services section is fully outside the viewport,
    //     so hero / FAQ / contact scrolls don't pay for getBoundingClientRect
    //     or scrollWidth reads.
    let rafId = 0;
    let pending = false;

    const update = () => {
      pending = false;
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      if (window.innerWidth <= 1024) {
        if (track.style.transform) track.style.transform = '';
        return;
      }

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.bottom < 0 || rect.top > windowHeight) return;

      const progress = -rect.top / (rect.height - windowHeight);
      const clampedProgress = Math.min(Math.max(progress, 0), 1);
      const maxTranslate = track.scrollWidth - window.innerWidth;

      if (maxTranslate > 0) {
        track.style.transform = `translateX(-${clampedProgress * maxTranslate}px)`;
      }
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Warm the Cal.com embed during browser idle after first paint. By the time
  // the user clicks Book a call, embed.js is cached and Cal('init') has run,
  // so the first open typically only waits for Cal's iframe to render.
  useEffect(() => {
    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const w = window as IdleWindow;
    const cb = () => {
      void preloadCalEmbed();
    };
    let idleId = 0;
    let timeoutId = 0;
    if (typeof w.requestIdleCallback === 'function') {
      idleId = w.requestIdleCallback(cb, { timeout: 2500 });
    } else {
      timeoutId = window.setTimeout(cb, 1500);
    }
    return () => {
      if (idleId && typeof w.cancelIdleCallback === 'function') {
        w.cancelIdleCallback(idleId);
      }
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const scrollToWorks = () => {
    const el = document.getElementById('works');
    if (!el) return;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(el, { offset: -80 });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Hero entrance plays on mount (above the fold). Calm, cinematic sequence:
  // background fades first (starts immediately), then the heading, then the
  // stacked text, then the description, then the CTAs — each separated by
  // ~150ms per spec.
  const heroBg = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 1.4, ease: easeIOS },
    },
  };

  const heroParent = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: shouldReduce ? 0 : 0.35,
      },
    },
  };

  const heroChild = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: dur.md, ease: easeIOS },
    },
  };

  const heroSmallChild = {
    hidden: { opacity: 0, y: 24, scale: 0.985 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: dur.md, ease: easeIOS },
    },
  };

  return (
    <div className="home-page">
      <BookCallModal
        persistShell={bookCallPersist}
        isOpen={bookCallOpen}
        onClose={() => setBookCallOpen(false)}
      />
      {/* Hero Section */}
      <section className="hero-section">
        <motion.div
          className="hero-background"
          variants={heroBg}
          initial="hidden"
          animate="show"
        >
          <Plasma
            color="#ff6b35"
            speed={0.3}
            direction="forward"
            scale={1.1}
            opacity={0.8}
            mouseInteractive={false}
          />
        </motion.div>
        <motion.div
          className="container hero-container"
          variants={heroParent}
          initial="hidden"
          animate="show"
        >
          <div className="hero-top">
            <motion.h1 className="hero-title" variants={heroChild}>
              We Build Websites, Apps &<br />
              Marketing Systems That<br />
              Generate Leads — <span className="emphasis-italic">Not Just Looks</span>
            </motion.h1>
            <motion.div className="hero-top-right" variants={heroSmallChild}>
              <div className="small-stacked-text text-right">
                GROW<br />YOUR BRAND<br />BEYOND<br />BOUNDARIES
              </div>
            </motion.div>
          </div>

          <div className="hero-bottom">
            <motion.div className="hero-bottom-left" variants={heroSmallChild}>
              <div className="small-stacked-text">
                BREAK LIMITS<br />BUILD<br />STRONGER<br />BRANDS
              </div>
            </motion.div>
            <motion.div className="hero-bottom-right" variants={heroSmallChild}>
              <div className="hero-bottom-right-inner">
                <p className="hero-desc">
                  We help startups and businesses create high-performing websites,<br />
                  powerful apps, and result-driven marketing strategies that<br />
                  actually grow revenue.
                </p>
                <motion.div className="hero-cta-group justify-end" variants={heroSmallChild}>
                  <BookCallButton type="button" onClick={openBookCall}>
                    Get Free Consultation
                  </BookCallButton>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="btn-outline"
                    style={{ background: 'transparent', border: '1px solid var(--border-light)' }}
                    onClick={scrollToWorks}
                  >
                    View Our Work
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Logo Strip */}
      <section className="logo-strip-section">
        <Reveal
          className="container logo-strip"
          variants={staggerParentFast}
          viewportMargin="-5% 0px"
        >
          {['TechCrunch', 'Forbes', 'WIRED', 'FastCompany', 'Inc.'].map((label) => (
            <motion.span key={label} className="logo-item" variants={fadeUpSoft}>
              {label}
            </motion.span>
          ))}
        </Reveal>
      </section>

      {/* Intro */}
      <section id="about" className="intro-section">
        <div className="container">
          <Reveal as="p" className="intro-text" variants={sectionRevealLg}>
            Discover <strong>the future of marketing</strong> with<br />
            Vridhio. We craft bold, data-driven<br />
            strategies that captivate, convert, and<br />
            <strong>scale your brand to new heights.</strong>
          </Reveal>
        </div>
      </section>

      {/* Selected Works */}
      <section id="works" className="works-section">
        <div className="container">
          <Reveal as="h2" className="works-heading" variants={sectionReveal}>
            Our selected <span className="emphasis-italic">works</span>
          </Reveal>

          {/* Row 1: Large left 57% + Smaller right 43% */}
          <Reveal className="works-row works-row-1" variants={staggerParent}>
            <motion.div
              variants={fadeUp}
              className="work-card-wrap"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.45, ease: easeIOS }}
            >
              <Link to="/works/1" className="work-card">
                <div className="work-img-wrap">
                  <motion.img
                    src="/works-payx.png"
                    alt="PayX Rebranding"
                    variants={imageReveal}
                  />
                  <div className="work-arrow">&#8599;</div>
                </div>
                <div className="work-caption">
                  <span className="work-caption-title">PayX Rebranding</span>
                  <span className="work-caption-sub">Revitalising a Fintech Brand for the Modern Market</span>
                </div>
              </Link>
            </motion.div>
            <motion.div
              variants={fadeUp}
              className="work-card-wrap"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.45, ease: easeIOS }}
            >
              <Link to="/works/2" className="work-card">
                <div className="work-img-wrap">
                  <motion.img
                    src="/works-trendwear.png"
                    alt="Social Growth for TrendWear"
                    variants={imageReveal}
                  />
                  <div className="work-arrow">&#8599;</div>
                </div>
                <div className="work-caption">
                  <span className="work-caption-title">Social Growth for TrendWear</span>
                  <span className="work-caption-sub">Vridhio Studio built a viral campaign that skyrocketed engagement and sales.</span>
                </div>
              </Link>
            </motion.div>
          </Reveal>

          {/* Row 2: Medium left 43% + Large right 57% */}
          <Reveal className="works-row works-row-2" variants={staggerParent}>
            <motion.div
              variants={fadeUp}
              className="work-card-wrap"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.45, ease: easeIOS }}
            >
              <Link to="/works/3" className="work-card">
                <div className="work-img-wrap">
                  <motion.img
                    src="/works-paidads.png"
                    alt="Scaling Sales with Paid Ads"
                    variants={imageReveal}
                  />
                  <div className="work-arrow">&#8599;</div>
                </div>
                <div className="work-caption">
                  <span className="work-caption-title">Scaling Sales with Paid Ads</span>
                  <span className="work-caption-sub">Vridhio Studio optimised their strategy, leading to higher returns and lower acquisition costs.</span>
                </div>
              </Link>
            </motion.div>
            <motion.div
              variants={fadeUp}
              className="work-card-wrap"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.45, ease: easeIOS }}
            >
              <Link to="/works/4" className="work-card">
                <div className="work-img-wrap">
                  <motion.img
                    src="/works-aquaflow.png"
                    alt="Rebranding for AquaFlow"
                    variants={imageReveal}
                  />
                  <div className="work-arrow">&#8599;</div>
                </div>
                <div className="work-caption">
                  <span className="work-caption-title">Rebranding for AquaFlow</span>
                  <span className="work-caption-sub">AquaFlow needed a modern identity to stand out. Vridhio Studio delivered a fresh, impactful rebrand.</span>
                </div>
              </Link>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="services-scroll-wrapper" ref={sectionRef}>
        <div className="services-sticky">
          <div className="container">
            <Reveal as="h2" className="services-header" variants={sectionReveal}>
              What we <span className="emphasis-italic">offer</span>
            </Reveal>
          </div>

          <div className="services-track-container">
            <div className="services-track" ref={trackRef}>
              {services.map((service, index) => {
                const imageFirst = index % 2 === 1;
                const media = (
                  <div className="service-card-media">
                    <img
                      src={service.image}
                      alt={service.imageAlt}
                      loading="lazy"
                      decoding="async"
                      width={960}
                      height={600}
                      style={{ objectPosition: service.imagePosition ?? 'center center' }}
                      onError={(e) => {
                        const el = e.currentTarget;
                        if (el.dataset.fallbackApplied !== '1') {
                          el.dataset.fallbackApplied = '1';
                          el.src = SERVICE_IMAGE_FALLBACK;
                        }
                      }}
                    />
                    <div className="service-card-media-shade" aria-hidden="true" />
                  </div>
                );
                const body = (
                  <div className="service-card-body">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <ul className="service-points">
                      {service.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                );
                return (
                  <Reveal
                    key={service.title}
                    className="service-col"
                    variants={fadeUp}
                    viewportMargin="0px"
                    delay={index * 0.05}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.45, ease: easeIOS }}
                  >
                    <article className="service-card-inner">
                      {imageFirst ? (
                        <>
                          {media}
                          {body}
                        </>
                      ) : (
                        <>
                          {body}
                          {media}
                        </>
                      )}
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Problem → Solution */}
      <section id="problem-solution" className="ps-section" aria-labelledby="ps-heading">
        <div className="ps-bg-glow" aria-hidden="true" />
        <div className="container ps-section-inner">
          <motion.div
            className="ps-header"
            variants={sectionReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-5% 0px', amount: 0.2 }}
          >
            <h2 id="ps-heading" className="ps-heading">
              Why Most Businesses Struggle <span className="emphasis-italic">Online</span>
            </h2>
            <p className="ps-subheading">
              Most businesses fail because design, strategy, and marketing are disconnected.
            </p>
          </motion.div>

          <motion.div
            className="ps-columns"
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-5% 0px', amount: 0.15 }}
          >
            <motion.article
              className="ps-problem-card"
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.45, ease: easeIOS }}
            >
              <span className="ps-badge ps-badge--problem">THE PROBLEM</span>
              <p className="ps-card-desc">
                Poor website design, no clear strategy, and weak marketing lead to low visibility and zero conversions.
              </p>
              <div className="ps-divider" aria-hidden="true" />
              <p className="ps-spends-label">Businesses spend money on:</p>
              <ul className="ps-problem-list">
                {[
                  'Random marketing',
                  'Slow websites',
                  'Poor branding',
                  'Weak online presence',
                ].map((item) => (
                  <li key={item}>
                    <XCircle className="ps-problem-icon" size={18} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="ps-result-line">…and don&apos;t get results.</p>
            </motion.article>

            <motion.article
              className="ps-solution-card"
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.45, ease: easeIOS }}
            >
              <span className="ps-badge ps-badge--solution">THE SOLUTION</span>
              <p className="ps-card-desc">
                We fix that by combining design, development, and marketing into one powerful system that consistently brings you leads and growth.
              </p>
              <motion.div
                className="ps-flow"
                variants={staggerParentSlow}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-5% 0px', amount: 0.2 }}
              >
                {[
                  { label: 'Design', icon: Palette },
                  { label: 'Development', icon: Code2 },
                  { label: 'Marketing', icon: Megaphone },
                  { label: 'Leads', icon: Users },
                  { label: 'Growth', icon: TrendingUp },
                ].flatMap((step, index, arr) => {
                  const Icon = step.icon;
                  const nodes = [
                    <motion.div
                      key={step.label}
                      className="ps-flow-step"
                      variants={fadeUpSoft}
                      whileHover={{ y: -3, scale: 1.02 }}
                      transition={{ duration: 0.35, ease: easeIOS }}
                    >
                      <div className="ps-flow-icon">
                        <Icon size={18} aria-hidden="true" />
                      </div>
                      <span className="ps-flow-label">{step.label}</span>
                    </motion.div>,
                  ];
                  if (index < arr.length - 1) {
                    nodes.push(
                      <motion.div
                        key={`${step.label}-arrow`}
                        className="ps-flow-connector"
                        variants={fadeUpSoft}
                        aria-hidden="true"
                      >
                        <ArrowRight size={16} />
                      </motion.div>,
                    );
                  }
                  return nodes;
                })}
              </motion.div>
            </motion.article>
          </motion.div>
        </div>
      </section>

      <WhyVridhioSection />

      {/* Process */}
      <section className="process-section">
        <div className="container">
          <Reveal as="h2" className="process-heading" variants={sectionReveal}>
            Our Simple <span className="emphasis-italic">Process</span>
          </Reveal>
        </div>
        <motion.div
          className="process-list"
          variants={staggerParentSlow}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-10% 0px', amount: 0.1 }}
        >
          {[
            { title: 'Strategy Call', desc: 'We understand your business, goals, audience, and requirements to create the right growth strategy.', num: '01' },
            { title: 'Planning & Design', desc: 'We plan the structure, user experience, visuals, and workflows tailored to your business needs.', num: '02' },
            { title: 'Development', desc: 'Our team builds fast, scalable, and modern digital solutions using the latest technologies.', num: '03' },
            { title: 'Launch & Marketing', desc: 'We launch, optimize, and market your business to generate visibility, leads, and long-term growth.', num: '04' },
          ].map((row) => (
            <motion.div key={row.num} className="process-row" variants={fadeUp}>
              <h3>{row.title}</h3>
              <p>{row.desc}</p>
              <motion.div className="process-num" variants={slideInRight}>{row.num}</motion.div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <Reveal as="h2" className="testimonials-heading" variants={sectionReveal}>
            Hear what clients have to say about us
          </Reveal>
          <Reveal className="testimonials-grid" variants={staggerParentSlow}>
            {[
              {
                text: 'Vridhio completely transformed our online presence. Our lead generation increased by 40% in just two months.',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=facearea&facepad=3',
                name: 'Sarah Jenkins, CEO at TechFlow',
              },
              {
                text: 'The team at Vridhio understands both aesthetics and business strategy. A rare combination in agencies today.',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=facearea&facepad=3',
                name: 'Michael Chen, Founder at NovaApp',
              },
              {
                text: 'They delivered our rebrand perfectly and increased our conversion rate significantly. Truly top-tier work.',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=facearea&facepad=3',
                name: 'Elena Rostova, CMO at Horizon',
              },
            ].map((t) => (
              <motion.article
                key={t.name}
                className="testimonial-card"
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.45, ease: easeIOS }}
              >
                <span className="testimonial-quote" aria-hidden="true">&#8221;</span>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-footer">
                  <img className="testimonial-avatar" src={t.avatar} alt={t.name} loading="lazy" decoding="async" width={52} height={52} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
                  <div className="testimonial-meta">{t.name}</div>
                </div>
              </motion.article>
            ))}
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faqs" className="container faq-section">
        <Reveal className="faq-list" variants={staggerParent}>
          {[
            { q: 'What industries do you work with?', a: "We partner with a wide range of industries including SaaS, e-commerce, finance, healthcare, hospitality, and emerging tech startups. Our approach adapts to your market, audience, and goals." },
            { q: 'How long does a typical project take?', a: "Most engagements run between 4 and 8 weeks, depending on scope and complexity. We'll share a detailed timeline during the strategy call once we understand your requirements." },
            { q: 'Do you offer custom marketing strategies?', a: "Yes. Every strategy is tailored to your brand, audience, and business objectives. We don't use templates or cookie-cutter playbooks." },
            { q: 'Can you manage our social media accounts?', a: 'Absolutely. We handle content creation, scheduling, community engagement, and performance reporting across all major platforms.' },
            { q: "What's the first step to working with you?", a: "Book a free strategy call. We'll discuss your goals, audit your current setup, and outline a clear roadmap before any commitment." },
          ].map((faq, i) => {
            const open = activeFaq === i;
            return (
              <motion.div
                key={faq.q}
                className={`faq-row ${open ? 'active' : ''}`}
                variants={fadeUpSoft}
              >
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => toggleFaq(i)}
                  aria-expanded={open}
                >
                  <span>{faq.q}</span>
                  <span className={`faq-icon ${open ? 'open' : ''}`} aria-hidden="true">
                    <Plus size={20} />
                  </span>
                </button>
                <div className="faq-answer-wrap">
                  <div className="faq-answer">{faq.a}</div>
                </div>
              </motion.div>
            );
          })}
        </Reveal>
      </section>

      <LeadCaptureSection onBookCall={openBookCall} />
    </div>
  );
};

export default HomePage;
