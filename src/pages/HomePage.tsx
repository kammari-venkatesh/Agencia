import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useLocation } from 'react-router-dom';
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
import { AnimatedNumber } from '../components/AnimatedNumber';
import { preloadCalEmbed } from '../lib/ensureCalEmbedScript';
import { Reveal } from '../motion/Reveal';
import { getLenis } from '../motion/SmoothScroll';
import {
  easeIOS,
  dur,
  fadeUp,
  fadeUpSoft,
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
import ScrollFloat from '../components/ScrollFloat';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [bookCallOpen, setBookCallOpen] = useState(false);
  const [bookCallPersist, setBookCallPersist] = useState(false);
  const [heroIntroComplete, setHeroIntroComplete] = useState(false);

  // Refs for VRIDHIO intro overlay
  const overlayRef = useRef<HTMLDivElement>(null);
  const vridhioRef = useRef<HTMLSpanElement>(null);
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

  // VRIDHIO intro animation: starts when user clicks (synchronous with WebGL loader reveal)
  useEffect(() => {
    if (shouldReduce) {
      setHeroIntroComplete(true);
      const navLogoEl = document.querySelector('.navbar-logo') as HTMLElement | null;
      if (navLogoEl) navLogoEl.style.opacity = '1';
      if (overlayRef.current) overlayRef.current.style.display = 'none';
      const container = vridhioRef.current?.parentElement;
      if (container) container.style.display = 'none';
      return;
    }
    const overlay = overlayRef.current;
    const text = vridhioRef.current;
    const introContainer = text?.parentElement;
    if (!overlay || !text || !introContainer) return;

    // Hide static navbar logo during intro animation so only the animated VRIDHIO text is visible
    const navLogoEl = document.querySelector('.navbar-logo') as HTMLElement | null;
    if (navLogoEl) {
      navLogoEl.style.opacity = '0';
    }

    // Make VRIDHIO centered & visible on solid white overlay behind the loader canvas
    gsap.set(text, { opacity: 1, scale: 1, x: 0, y: 0, transformOrigin: '0% 0%' });
    gsap.set(overlay, { opacity: 1, display: 'block' });
    gsap.set(introContainer, { display: 'flex' });

    let isRevealed = false;
    let targetX = 0;
    let targetY = 0;
    let scaleTarget = 1;

    const computeCoords = () => {
      const currentNavLogo = document.querySelector('.navbar-logo');
      const splashRect = text.getBoundingClientRect();
      const navRect = currentNavLogo ? currentNavLogo.getBoundingClientRect() : null;

      if (navRect && splashRect && splashRect.width > 0 && splashRect.height > 0) {
        targetX = navRect.left - splashRect.left;
        targetY = navRect.top - splashRect.top;
        scaleTarget = navRect.height / splashRect.height;
      } else {
        targetX = -(window.innerWidth / 2 - 90);
        targetY = -(window.innerHeight / 2 - 50);
        scaleTarget = 0.22;
      }
    };

    const handleResize = () => {
      if (!isRevealed) return;
      computeCoords();
      gsap.set(text, {
        x: targetX,
        y: targetY,
        scale: scaleTarget,
        transformOrigin: '0% 0%',
      });
    };

    window.addEventListener('resize', handleResize);

    const handleRevealClick = () => {
      isRevealed = true;
      computeCoords();

      const tl = gsap.timeline({
        delay: 0.1,
        onComplete: () => {
          setHeroIntroComplete(true);
          if (overlay) overlay.style.display = 'none';
          // Switch container from position:fixed to position:absolute so VRIDHIO logo
          // stays as the single continuous text element and scrolls naturally with the page.
          if (introContainer) {
            introContainer.style.position = 'absolute';
            introContainer.style.zIndex = '51';
          }
        },
      });

      // 1. Hold VRIDHIO centered on solid white while smoke clears (1.5s)
      tl.to(text, { opacity: 1, scale: 1, duration: 1.5 }, 0);

      // 2. Smoothly shrink & glide VRIDHIO text to top-left header logo position (2.2s)
      tl.to(
        text,
        {
          x: targetX,
          y: targetY,
          scale: scaleTarget,
          transformOrigin: '0% 0%',
          duration: 2.2,
          ease: 'power2.inOut',
        },
        1.5
      );

      // 3. VRIDHIO text HAS LANDED at header position!
      // Solid white background overlay fades out (0.8s), revealing page beneath
      tl.to(
        overlay,
        {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          onStart: () => {
            // Trigger hero section content fade in around header
            setHeroIntroComplete(true);
          },
        },
        3.7
      );
    };

    window.addEventListener('click', handleRevealClick, { once: true });

    return () => {
      window.removeEventListener('click', handleRevealClick);
      window.removeEventListener('resize', handleResize);
      const currentNavLogo = document.querySelector('.navbar-logo') as HTMLElement | null;
      if (currentNavLogo) {
        currentNavLogo.style.opacity = '1';
      }
    };
  }, [shouldReduce]);


  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const scrollToServices = () => {
    const el = document.getElementById('services');
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

  const futuristicIntroParent = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const futuristicIntroChild = {
    hidden: { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: dur.md, ease: easeIOS },
    },
  };

  return (
    <div className="home-page">
      {/* VRIDHIO Intro Overlay Background */}
      <div ref={overlayRef} className="hero-intro-overlay-bg" />

      {/* VRIDHIO Intro Animated Text (Fixed in header) */}
      <div className="hero-intro-logo-container">
        <span ref={vridhioRef} className="hero-intro-logo">
          VRIDHIO
        </span>
      </div>

      <BookCallModal
        persistShell={bookCallPersist}
        isOpen={bookCallOpen}
        onClose={() => setBookCallOpen(false)}
      />
      {/* Hero Section */}
      <section className="hero-section">
        {/* Soft tint glow behind the portrait */}
        <div className="hero-portrait-glow" aria-hidden="true" />

        <motion.div
          className="hero-container"
          variants={heroParent}
          initial="hidden"
          animate={heroIntroComplete ? 'show' : 'hidden'}
        >
          {/* ── LEFT: editorial copy column ── */}
          <div className="hero-left">

            <motion.div className="hero-eyebrow" variants={heroSmallChild}>
              <span className="hero-eyebrow-line" />
              <span>DIGITAL AGENCY · EST. 2026</span>
            </motion.div>

            <motion.h1 className="hero-title" variants={heroChild}>
              We Build<br />
              Websites, Apps<br />
              &amp; Marketing<br />
              <span className="hero-title-accent">That Convert</span>
            </motion.h1>

            <motion.p className="hero-desc" variants={heroSmallChild}>
              We help startups and businesses create high-performing websites,
              powerful apps, and result-driven marketing strategies that
              actually grow revenue.
            </motion.p>

            <motion.div className="hero-cta-row" variants={heroSmallChild}>
              <BookCallButton type="button" onClick={openBookCall}>
                Get Free Consultation
              </BookCallButton>
              <Button
                size="lg"
                variant="secondary"
                className="btn-outline hero-btn-ghost"
                onClick={scrollToServices}
              >
                View Services
              </Button>
            </motion.div>

            <motion.div className="hero-stats-row" variants={heroSmallChild}>
              <div className="hero-stat">
                <AnimatedNumber value="150+" className="hero-stat-num" trigger={heroIntroComplete} />
                <span className="hero-stat-label">Brands Grown</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <AnimatedNumber value="8×" className="hero-stat-num" trigger={heroIntroComplete} />
                <span className="hero-stat-label">Avg. ROI</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <AnimatedNumber value="98%" className="hero-stat-num" trigger={heroIntroComplete} />
                <span className="hero-stat-label">Client Satisfaction</span>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: full-height portrait image ── */}
          <motion.div className="hero-right" variants={heroChild}>
            <div className="hero-portrait-wrap">
              <img
                src="/hero-portrait.png"
                alt="Vridhio — Bold Strategy Meets Innovation"
                className="hero-portrait-img"
              />
              {/* Bottom left accent line */}
              <div className="hero-portrait-tag">
                <span className="hero-tag-line" />
                <span className="hero-tag-text">GENERATE LEADS — NOT JUST LOOKS</span>
              </div>
            </div>
          </motion.div>
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
        {/* Curved decorative lines */}
        <div className="intro-lines" aria-hidden="true">
          {/* Left curved lines */}
          <div className="intro-lines-left">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={`left-${i}`}
                className="intro-curve intro-curve-left"
                style={{
                  width: `${60 + i * 10}px`,
                  animationDelay: `${i * 0.25}s`,
                  left: 0,
                }}
              />
            ))}
          </div>
          {/* Right curved lines */}
          <div className="intro-lines-right">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={`right-${i}`}
                className="intro-curve intro-curve-right"
                style={{
                  width: `${60 + i * 10}px`,
                  animationDelay: `${i * 0.25}s`,
                  right: 0,
                }}
              />
            ))}
          </div>
        </div>

        <div className="container">
          <ScrollFloat
            as="p"
            containerClassName="intro-text-wrapper"
            textClassName="intro-text font-unbounded"
            animationDuration={0.65}
            ease="power2.out"
            scrollStart="top bottom-=25%"
            scrollEnd="center center+=10%"
            stagger={0.012}
          >
            Discover <strong className="cherry-accent">the future of</strong><br />
            <strong className="cherry-accent">marketing</strong> with Vridhio.<br />
            We craft bold, data-driven strategies that captivate, convert, and<br />
            <strong className="cherry-accent">scale your brand to new heights.</strong>
          </ScrollFloat>
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
