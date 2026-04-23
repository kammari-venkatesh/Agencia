import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import Button from '../components/Button';
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
import './HomePage.css';

const HomePage: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
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
    const handleScroll = () => {
      if (!sectionRef.current || !trackRef.current) return;

      // On tablet + mobile the horizontal track is disabled via CSS and the
      // services section stacks vertically. Clear any stale transform left
      // over from a previous desktop viewport, then bail out.
      if (window.innerWidth <= 1024) {
        if (trackRef.current.style.transform) {
          trackRef.current.style.transform = '';
        }
        return;
      }

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const progress = -rect.top / (rect.height - windowHeight);
      const clampedProgress = Math.min(Math.max(progress, 0), 1);

      const trackWidth = trackRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      const maxTranslate = trackWidth - viewportWidth;

      if (maxTranslate > 0) {
        trackRef.current.style.transform = `translateX(-${clampedProgress * maxTranslate}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
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
    hidden: { opacity: 0, y: 30, scale: 0.98, filter: 'blur(6px)' },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration: dur.lg, ease: easeIOS },
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
              Where Bold<br />Strategy Meets<br /><span className="emphasis-italic">Innovation.</span>
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
            <motion.div className="hero-bottom-right text-right" variants={heroSmallChild}>
              <p className="hero-desc">
                Creative marketing and design solutions that make an impact.<br />
                Veltrix Studio helps businesses stand out with bold ideas and<br />
                measurable results.
              </p>
              <motion.div className="hero-cta-group justify-end" variants={heroSmallChild}>
                <Button size="lg" variant="primary">Book a call</Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="btn-outline"
                  style={{ background: 'transparent', border: '1px solid var(--border-light)' }}
                >
                  Our Services
                </Button>
              </motion.div>
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
            Veltrix. We craft bold, data-driven<br />
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
                  <span className="work-caption-sub">Veltrix Studio built a viral campaign that skyrocketed engagement and sales.</span>
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
                  <span className="work-caption-sub">Veltrix Studio optimised their strategy, leading to higher returns and lower acquisition costs.</span>
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
                  <span className="work-caption-sub">AquaFlow needed a modern identity to stand out. Veltrix Studio delivered a fresh, impactful rebrand.</span>
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
              <Reveal
                className="service-col"
                variants={fadeUp}
                viewportMargin="0px"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.45, ease: easeIOS }}
              >
                <div className="service-cell service-text-cell">
                  <h3>Content Marketing</h3>
                  <p>Engage your audience with compelling content that builds trust and drives conversions.</p>
                </div>
                <div className="service-cell service-img-cell">
                  <img src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop" alt="Content Marketing" />
                </div>
              </Reveal>

              <Reveal
                className="service-col service-col-reversed"
                variants={fadeUp}
                viewportMargin="0px"
                delay={0.05}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.45, ease: easeIOS }}
              >
                <div className="service-cell service-img-cell">
                  <img src="https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?q=80&w=800&auto=format&fit=crop" alt="Paid Advertising" />
                </div>
                <div className="service-cell service-text-cell">
                  <h3>Paid Advertising</h3>
                  <p>Reach the right audience with data-driven ad campaigns that maximize ROI.</p>
                </div>
              </Reveal>

              <Reveal
                className="service-col"
                variants={fadeUp}
                viewportMargin="0px"
                delay={0.1}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.45, ease: easeIOS }}
              >
                <div className="service-cell service-text-cell">
                  <h3>Rebranding</h3>
                  <p>Transform your brand with a fresh identity that aligns with your vision and market trends.</p>
                </div>
                <div className="service-cell service-img-cell">
                  <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800&auto=format&fit=crop" alt="Rebranding" />
                </div>
              </Reveal>

              <Reveal
                className="service-col service-col-reversed"
                variants={fadeUp}
                viewportMargin="0px"
                delay={0.15}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.45, ease: easeIOS }}
              >
                <div className="service-cell service-img-cell">
                  <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop" alt="Email Marketing" />
                </div>
                <div className="service-cell service-text-cell">
                  <h3>Email Marketing</h3>
                  <p>Boost engagement and retention with high-converting email campaigns.</p>
                </div>
              </Reveal>

              <Reveal
                className="service-col"
                variants={fadeUp}
                viewportMargin="0px"
                delay={0.2}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.45, ease: easeIOS }}
              >
                <div className="service-cell service-text-cell">
                  <h3>SEO Strategy</h3>
                  <p>Dominate search results and drive organic traffic with our expert optimization techniques.</p>
                </div>
                <div className="service-cell service-img-cell">
                  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop" alt="SEO Strategy" />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="process-section">
        <div className="container">
          <Reveal as="h2" className="process-heading" variants={sectionReveal}>
            How we <span className="emphasis-italic">work</span>
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
            { title: 'Discovery', desc: 'We dive deep into your brand, goals, and audience to craft a tailored marketing strategy.', num: '01' },
            { title: 'Execution', desc: 'Our team brings ideas to life with compelling visuals, messaging, and data-driven content.', num: '02' },
            { title: 'Optimization', desc: 'We refine campaigns in real-time, ensuring maximum performance and engagement.', num: '03' },
            { title: 'Growth', desc: 'With data-driven insights, we scale your success and drive long-term impact.', num: '04' },
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
                text: 'Veltrix completely transformed our online presence. Our lead generation increased by 40% in just two months.',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=facearea&facepad=3',
                name: 'Sarah Jenkins, CEO at TechFlow',
              },
              {
                text: 'The team at Veltrix understands both aesthetics and business strategy. A rare combination in agencies today.',
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
                  <img className="testimonial-avatar" src={t.avatar} alt={t.name} />
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

      {/* Contact */}
      <Reveal as="section" id="contact" className="contact-section" variants={sectionRevealLg}>
        <div className="contact-bg-wave" aria-hidden="true" />
        <div className="container contact-section-content">
          <motion.div
            className="contact-grid"
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-10% 0px', amount: 0.2 }}
          >
            <motion.div className="contact-left" variants={fadeUp}>
              <h2 className="contact-title">
                <span className="contact-title-sans">Contact us and let&apos;s</span>
                <span className="contact-title-italic">create something great</span>
              </h2>
            </motion.div>
            <motion.div className="contact-right" variants={fadeUp}>
              <p className="contact-description">
                Ready to take your brand to the next level? Get in touch with us and let&apos;s create powerful
                marketing strategies that drive real results.
              </p>
              <motion.div className="contact-cta" variants={fadeUpSoft}>
                <Button size="lg" variant="primary">Book a call</Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </Reveal>
    </div>
  );
};

export default HomePage;
