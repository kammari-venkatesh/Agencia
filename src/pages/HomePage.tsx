import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Button from '../components/Button';
import { BookCallButton, BookCallModal } from '../components/BookCallModal';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { preloadCalEmbed } from '../lib/ensureCalEmbedScript';
import { Reveal } from '../motion/Reveal';
import { getLenis } from '../motion/SmoothScroll';
import {
  fadeUpSoft,
  staggerParentFast,
  sectionReveal,
} from '../motion/variants';
import { services } from '../data/services';
import WhyVridhioSection from '../components/WhyVridhioSection';
import SystemTransformationSection from '../components/SystemTransformationSection';
import FlowingMenu from '../components/FlowingMenu';
import LeadCaptureSection from '../components/LeadCaptureSection';
import ScrollFloat from '../components/ScrollFloat';
import DotGrid from '../components/DotGrid';
import ScrollStack, { ScrollStackItem } from '../components/ScrollStack';
import ServiceStackCard from '../components/ServiceStackCard';
import TestimonialsSection from '../components/TestimonialsSection';
import FaqSection from '../components/FaqSection';
import {
  Cursor3DIllustration,
  Phone3DIllustration,
  Bot3DIllustration,
  Workflow3DIllustration,
  PhoneCall3DIllustration,
  Pen3DIllustration,
  Film3DIllustration,
  Target3DIllustration,
  Star3DIllustration,
  Rocket3DIllustration,
  Search3DIllustration,
} from '../components/ServiceIllustrations';
import './HomePage.css';

const HomePage: React.FC = () => {
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
  const location = useLocation();
  const shouldReduce = useReducedMotion();

  // On first mount, if the URL has no hash, guarantee the page starts at the
  // hero. This prevents any residual scroll from a bfcache restore or a race
  // with scrollRestoration=manual from being visible to the user.
  // On first mount, if the URL has no hash, guarantee the page starts at the
  // hero. This prevents any residual scroll from a bfcache restore or a race
  // with scrollRestoration=manual from being visible to the user.
  useEffect(() => {
    if (location.hash) return;
    if (typeof history !== 'undefined' && 'scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
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

  // VRIDHIO intro animation: auto-starts on mount (synchronous with WebGL loader reveal)
  useEffect(() => {
    const isMobile =
      typeof window !== 'undefined' &&
      (window.innerWidth <= 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0);

    if (shouldReduce || isMobile) {
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
    if (!overlay || !text || !introContainer) {
      setHeroIntroComplete(true);
      return;
    }

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

    const startAutoReveal = () => {
      if (isRevealed) return;
      isRevealed = true;

      computeCoords();

      const tl = gsap.timeline({
        onComplete: () => {
          setHeroIntroComplete(true);
          if (navLogoEl) navLogoEl.style.opacity = '1';
          if (overlay) overlay.style.display = 'none';
          if (introContainer) introContainer.style.display = 'none';
        },
      });

      // 1. Hold centered gracefully (1.2s)
      tl.to(text, { opacity: 1, scale: 1, duration: 1.2 }, 0);

      // 2. Smoothly glide VRIDHIO text to header logo position (2.0s)
      tl.to(
        text,
        {
          x: targetX,
          y: targetY,
          scale: scaleTarget,
          transformOrigin: '0% 0%',
          duration: 2.0,
          ease: 'power2.inOut',
        },
        1.2
      );

      // 3. Fade out overlay and reveal page hero content (0.8s)
      tl.to(
        overlay,
        {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          onStart: () => {
            setHeroIntroComplete(true);
          },
        },
        3.0
      );
    };

    // Auto-start intro sequence automatically after 150ms
    const autoTimer = setTimeout(startAutoReveal, 150);

    // Hard failsafe timer: guarantee hero section is complete within 4.2s
    const failsafeTimer = setTimeout(() => {
      setHeroIntroComplete(true);
      if (navLogoEl) navLogoEl.style.opacity = '1';
      if (overlay) overlay.style.display = 'none';
      if (introContainer) introContainer.style.display = 'none';
    }, 4200);

    return () => {
      clearTimeout(autoTimer);
      clearTimeout(failsafeTimer);
      window.removeEventListener('resize', handleResize);
      const currentNavLogo = document.querySelector('.navbar-logo') as HTMLElement | null;
      if (currentNavLogo) {
        currentNavLogo.style.opacity = '1';
      }
    };
  }, [shouldReduce]);

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

  // High-performance DOM Mouse Parallax tracking (0 React re-renders for buttery 120fps)
  const heroLeftRef = useRef<HTMLDivElement>(null);
  const heroPortraitWrapRef = useRef<HTMLDivElement>(null);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (shouldReduce) return;
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 2;
    const y = (e.clientY / innerHeight - 0.5) * 2;

    if (heroLeftRef.current) {
      heroLeftRef.current.style.transform = `translate3d(${-x * 6}px, ${-y * 4}px, 0)`;
    }
    if (heroPortraitWrapRef.current) {
      heroPortraitWrapRef.current.style.transform = `translate3d(${x * 12}px, ${y * 8}px, 0)`;
    }
  };

  const EASE_CINEMATIC = [0.22, 1, 0.36, 1] as const;

  const heroContainerVariants = {
    hidden: { opacity: 0.94 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: EASE_CINEMATIC,
      },
    },
  };

  // 1. Character Image reveals FIRST: soft blur to sharp, scale 1.05 -> 1.0, y: 20 -> 0
  const characterVariants = {
    hidden: {
      opacity: 0,
      scale: 1.05,
      y: 20,
      filter: 'blur(14px)',
    },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: shouldReduce ? 0.01 : 1.1,
        ease: EASE_CINEMATIC,
        delay: shouldReduce ? 0 : 0.05,
      },
    },
  };

  // 2. Eyebrow Label
  const eyebrowVariants = {
    hidden: { opacity: 0, x: -16 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: shouldReduce ? 0.01 : 0.65,
        ease: EASE_CINEMATIC,
        delay: shouldReduce ? 0 : 0.3,
      },
    },
  };

  // 3. Masked Headline Lines (staggered)
  const headlineLine1 = {
    hidden: { opacity: 0, y: '110%' },
    show: {
      opacity: 1,
      y: '0%',
      transition: { duration: shouldReduce ? 0.01 : 0.75, ease: EASE_CINEMATIC, delay: shouldReduce ? 0 : 0.45 },
    },
  };

  const headlineLine2 = {
    hidden: { opacity: 0, y: '110%' },
    show: {
      opacity: 1,
      y: '0%',
      transition: { duration: shouldReduce ? 0.01 : 0.75, ease: EASE_CINEMATIC, delay: shouldReduce ? 0 : 0.58 },
    },
  };

  const headlineLine3 = {
    hidden: { opacity: 0, y: '110%' },
    show: {
      opacity: 1,
      y: '0%',
      transition: { duration: shouldReduce ? 0.01 : 0.75, ease: EASE_CINEMATIC, delay: shouldReduce ? 0 : 0.71 },
    },
  };

  const headlineLine4 = {
    hidden: { opacity: 0, y: '110%' },
    show: {
      opacity: 1,
      y: '0%',
      transition: { duration: shouldReduce ? 0.01 : 0.8, ease: EASE_CINEMATIC, delay: shouldReduce ? 0 : 0.85 },
    },
  };

  // 4. Description soft fade
  const descVariants = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduce ? 0.01 : 0.65, ease: EASE_CINEMATIC, delay: shouldReduce ? 0 : 1.0 },
    },
  };

  // 5. CTA buttons upward stagger
  const ctaVariants = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduce ? 0.01 : 0.65, ease: EASE_CINEMATIC, delay: shouldReduce ? 0 : 1.15 },
    },
  };

  // 6. Stats row
  const statsVariants = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduce ? 0.01 : 0.65, ease: EASE_CINEMATIC, delay: shouldReduce ? 0 : 1.3 },
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
      <section className="hero-section" onMouseMove={handleHeroMouseMove}>
        {/* Soft tint glow behind the portrait */}
        <div className="hero-portrait-glow" aria-hidden="true" />

        <motion.div
          className="hero-container"
          variants={heroContainerVariants}
          initial="hidden"
          animate={heroIntroComplete ? 'show' : 'hidden'}
        >
          {/* ── LEFT: editorial copy column ── */}
          <div
            ref={heroLeftRef}
            className="hero-left"
            style={{
              transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >

            <motion.div className="hero-eyebrow" variants={eyebrowVariants}>
              <span className="hero-eyebrow-line" />
              <span>DIGITAL AGENCY · EST. 2026</span>
            </motion.div>

            <h1 className="hero-title">
              <span className="hero-title-line-wrap">
                <motion.span className="hero-title-line" variants={headlineLine1}>
                  We Build
                </motion.span>
              </span>
              <span className="hero-title-line-wrap">
                <motion.span className="hero-title-line" variants={headlineLine2}>
                  Websites, Apps
                </motion.span>
              </span>
              <span className="hero-title-line-wrap">
                <motion.span className="hero-title-line" variants={headlineLine3}>
                  &amp; Marketing
                </motion.span>
              </span>
              <span className="hero-title-line-wrap">
                <motion.span className="hero-title-line hero-title-accent" variants={headlineLine4}>
                  That Convert
                </motion.span>
              </span>
            </h1>

            <motion.p className="hero-desc" variants={descVariants}>
              We help startups and businesses create high-performing websites,
              powerful apps, and result-driven marketing strategies that
              actually grow revenue.
            </motion.p>

            <motion.div className="hero-cta-row" variants={ctaVariants}>
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

            <motion.div className="hero-stats-row" variants={statsVariants}>
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
          <motion.div className="hero-right" variants={characterVariants}>
            <div
              ref={heroPortraitWrapRef}
              className="hero-portrait-wrap"
              style={{
                transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <img
                src="/hero-portrait.png"
                alt="Vridhio — Bold Strategy Meets Innovation"
                className="hero-portrait-img"
              />

              {/* Red Visor Light Sweep once during entrance & ambient glow */}
              <div className="hero-visor-glow-wrap" aria-hidden="true">
                <motion.div
                  className="hero-visor-sweep-bar"
                  initial={{ x: '-100%', opacity: 0 }}
                  animate={heroIntroComplete ? { x: '220%', opacity: [0, 1, 1, 0] } : {}}
                  transition={{ duration: 1.25, delay: 0.65, ease: EASE_CINEMATIC }}
                />
                <div className="hero-visor-pulse-glow" />
              </div>

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
        {/* Interactive DotGrid Background */}
        <DotGrid
          dotSize={4}
          gap={18}
          baseColor="#ffffff"
          activeColor="#DC143C"
          proximity={140}
          shockRadius={240}
          shockStrength={4}
          resistance={750}
          returnDuration={1.2}
        />
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

      {/* Services — Pinned Section Overlay Card Stack */}
      <section id="services">
        <ScrollStack>
          <div className="container services-hero-header-wrap">
            <Reveal className="services-eyebrow" variants={fadeUpSoft}>
              <span className="services-eyebrow-line" />
              <span>OUR EXPERTISE · WHAT WE OFFER</span>
            </Reveal>
            <Reveal as="h2" className="services-hero-title" variants={sectionReveal}>
              What We <span className="services-hero-accent">Offer</span>
            </Reveal>
            <Reveal as="p" className="services-hero-desc" variants={fadeUpSoft}>
              We build high-converting websites, powerful apps, and result-driven marketing strategies that grow your revenue.
            </Reveal>
          </div>

          <div className="services-card-stack-deck">
            {services.map((service, index) => {
              const illustrationMap: Record<string, React.ReactNode> = {
                'Website Development': <Cursor3DIllustration />,
                'App Development': <Phone3DIllustration />,
                'AI Chatbots': <Bot3DIllustration />,
                'Workflow Automations': <Workflow3DIllustration />,
                'AI Calling Systems': <PhoneCall3DIllustration />,
                'Graphic Designing': <Pen3DIllustration />,
                'Video Editing': <Film3DIllustration />,
                'Digital Marketing': <Target3DIllustration />,
                'Influencer Marketing': <Star3DIllustration />,
                'Sales & Growth Systems': <Rocket3DIllustration />,
                'Content Marketing': <Search3DIllustration />,
              };
              return (
                <ScrollStackItem key={service.title}>
                  <ServiceStackCard
                    title={service.title}
                    subtitle={service.description}
                    points={service.points}
                    illustration={illustrationMap[service.title] || <Cursor3DIllustration />}
                    variant={index + 1}
                    onLearnMore={openBookCall}
                  />
                </ScrollStackItem>
              );
            })}
          </div>
        </ScrollStack>
      </section>

      {/* System Transformation Section (Reinvented Chaos -> System Section) */}
      <SystemTransformationSection onBookCall={openBookCall} />

      <WhyVridhioSection />

      {/* Process Section */}
      <section id="process" className="process-section">
        <div className="container process-header-container">
          <Reveal className="process-header-wrap" variants={sectionReveal}>
            <span className="process-eyebrow">
              <span className="process-eyebrow-line" />
              <span>HOW WE WORK · STEP BY STEP</span>
            </span>
            <h2 className="process-heading">
              Our Simple <span className="process-heading-accent">Process</span>
            </h2>
          </Reveal>
        </div>
        <FlowingMenu
          items={[
            {
              num: '01',
              text: 'Strategy Call',
              desc: 'We understand your business, goals, audience, and requirements to create the right growth strategy.',
              link: '#contact',
            },
            {
              num: '02',
              text: 'Planning & Design',
              desc: 'We plan the structure, user experience, visuals, and workflows tailored to your business needs.',
              link: '#contact',
            },
            {
              num: '03',
              text: 'Development',
              desc: 'Our team builds fast, scalable, and modern digital solutions using the latest technologies.',
              link: '#contact',
            },
            {
              num: '04',
              text: 'Launch & Marketing',
              desc: 'We launch, optimize, and market your business to generate visibility, leads, and long-term growth.',
              link: '#contact',
            },
          ]}
          accentColor="#D90445"
          bgColor="#ffffff"
          textColor="#1a1a1a"
          borderColor="rgba(0, 0, 0, 0.08)"
          onItemClick={openBookCall}
        />
      </section>

      {/* Testimonials (OptionWheel + Editorial Client Stories) */}
      <TestimonialsSection />

      {/* Redesigned Editorial FAQ Section */}
      <FaqSection onBookCall={openBookCall} />

      <LeadCaptureSection onBookCall={openBookCall} />
    </div>
  );
};

export default HomePage;
