import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus } from 'lucide-react';
import Button from '../components/Button';
import Plasma from '../components/Plasma';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !trackRef.current || window.innerWidth < 768) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress of scroll within the tall section
      // rect.top is the distance from the top of the viewport to the top of the section
      // When rect.top is 0, progress is 0. When rect.top is -(rect.height - windowHeight), progress is 1.
      const progress = -rect.top / (rect.height - windowHeight);
      const clampedProgress = Math.min(Math.max(progress, 0), 1);
      
      const trackWidth = trackRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      const maxTranslate = trackWidth - viewportWidth;
      
      // Apply translation to track
      if (maxTranslate > 0) {
        trackRef.current.style.transform = `translateX(-${clampedProgress * maxTranslate}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll); // Recalculate on resize
    
    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="home-page">
      {/* Hero Section Exact UI */}
      <section className="hero-section">
        <div className="hero-background">
          <Plasma 
            color="#ff6b35"
            speed={0.6}
            direction="forward"
            scale={1.1}
            opacity={0.8}
            mouseInteractive={true}
          />
        </div>
        <div className="container hero-container">

          <div className="hero-top">
            <h1 className="hero-title">
              Where Bold<br />Strategy Meets<br /><span className="emphasis-italic">Innovation.</span>
            </h1>
            <div className="hero-top-right">
              <div className="small-stacked-text text-right">
                GROW<br />YOUR BRAND<br />BEYOND<br />BOUNDARIES
              </div>
            </div>
          </div>

          <div className="hero-bottom">
            <div className="hero-bottom-left">
              <div className="small-stacked-text">
                BREAK LIMITS<br />BUILD<br />STRONGER<br />BRANDS
              </div>
            </div>
            <div className="hero-bottom-right text-right">
              <p className="hero-desc">
                Creative marketing and design solutions that make an impact.<br />
                Veltrix Studio helps businesses stand out with bold ideas and<br />
                measurable results.
              </p>
              <div className="hero-cta-group justify-end">
                <Button size="lg" variant="primary">Book a call</Button>
                <Button size="lg" variant="secondary" className="btn-outline" style={{ background: 'transparent', border: '1px solid var(--border-light)' }}>Our Services</Button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Logo Strip */}
      <section className="logo-strip-section">
        <div className="container logo-strip">
          <span className="logo-item">TechCrunch</span>
          <span className="logo-item">Forbes</span>
          <span className="logo-item">WIRED</span>
          <span className="logo-item">FastCompany</span>
          <span className="logo-item">Inc.</span>
        </div>
      </section>

      {/* Intro — centered editorial paragraph */}
      <section className="intro-section">
        <div className="container">
          <p className="intro-text">
            Discover <strong>the future of marketing</strong> with<br />
            Veltrix. We craft bold, data-driven<br />
            strategies that captivate, convert, and<br />
            <strong>scale your brand to new heights.</strong>
          </p>
        </div>
      </section>

      {/* Selected Works — exact reference layout */}
      <section id="works" className="works-section">
        <div className="container">
          <h2 className="works-heading">
            Our selected <span className="emphasis-italic">works</span>
          </h2>

          {/* Row 1: Large left 57% + Smaller right 43% */}
          <div className="works-row works-row-1">
            <Link to="/works/1" className="work-card">
              <div className="work-img-wrap">
                <img src="/works-payx.png" alt="PayX Rebranding" />
                <div className="work-arrow">&#8599;</div>
              </div>
              <div className="work-caption">
                <span className="work-caption-title">PayX Rebranding</span>
                <span className="work-caption-sub">Revitalising a Fintech Brand for the Modern Market</span>
              </div>
            </Link>
            <Link to="/works/2" className="work-card">
              <div className="work-img-wrap">
                <img src="/works-trendwear.png" alt="Social Growth for TrendWear" />
                <div className="work-arrow">&#8599;</div>
              </div>
              <div className="work-caption">
                <span className="work-caption-title">Social Growth for TrendWear</span>
                <span className="work-caption-sub">Veltrix Studio built a viral campaign that skyrocketed engagement and sales.</span>
              </div>
            </Link>
          </div>

          {/* Row 2: Medium left 43% + Large right 57% */}
          <div className="works-row works-row-2">
            <Link to="/works/3" className="work-card">
              <div className="work-img-wrap">
                <img src="/works-paidads.png" alt="Scaling Sales with Paid Ads" />
                <div className="work-arrow">&#8599;</div>
              </div>
              <div className="work-caption">
                <span className="work-caption-title">Scaling Sales with Paid Ads</span>
                <span className="work-caption-sub">Veltrix Studio optimised their strategy, leading to higher returns and lower acquisition costs.</span>
              </div>
            </Link>
            <Link to="/works/4" className="work-card">
              <div className="work-img-wrap">
                <img src="/works-aquaflow.png" alt="Rebranding for AquaFlow" />
                <div className="work-arrow">&#8599;</div>
              </div>
              <div className="work-caption">
                <span className="work-caption-title">Rebranding for AquaFlow</span>
                <span className="work-caption-sub">AquaFlow needed a modern identity to stand out. Veltrix Studio delivered a fresh, impactful rebrand.</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Services - Horizontal Scroll Bento Grid */}
      <section id="services" className="services-scroll-wrapper" ref={sectionRef}>
        <div className="services-sticky">
          <div className="container">
            <h2 className="services-header">What we <span className="emphasis-italic">offer</span></h2>
          </div>

          <div className="services-track-container">
            <div className="services-track" ref={trackRef}>
              {/* Column 1: Text top, Image bottom */}
              <div className="service-col">
                <div className="service-cell service-text-cell">
                  <h3>Content Marketing</h3>
                  <p>Engage your audience with compelling content that builds trust and drives conversions.</p>
                </div>
                <div className="service-cell service-img-cell">
                  <img src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop" alt="Content Marketing" />
                </div>
              </div>

              {/* Column 2: Image top, Text bottom */}
              <div className="service-col service-col-reversed">
                <div className="service-cell service-img-cell">
                  <img src="https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?q=80&w=800&auto=format&fit=crop" alt="Paid Advertising" />
                </div>
                <div className="service-cell service-text-cell">
                  <h3>Paid Advertising</h3>
                  <p>Reach the right audience with data-driven ad campaigns that maximize ROI.</p>
                </div>
              </div>

              {/* Column 3: Text top, Image bottom */}
              <div className="service-col">
                <div className="service-cell service-text-cell">
                  <h3>Rebranding</h3>
                  <p>Transform your brand with a fresh identity that aligns with your vision and market trends.</p>
                </div>
                <div className="service-cell service-img-cell">
                  <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800&auto=format&fit=crop" alt="Rebranding" />
                </div>
              </div>

              {/* Column 4: Image top, Text bottom */}
              <div className="service-col service-col-reversed">
                <div className="service-cell service-img-cell">
                  <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop" alt="Email Marketing" />
                </div>
                <div className="service-cell service-text-cell">
                  <h3>Email Marketing</h3>
                  <p>Boost engagement and retention with high-converting email campaigns.</p>
                </div>
              </div>

              {/* Column 5: Text top, Image bottom */}
              <div className="service-col">
                <div className="service-cell service-text-cell">
                  <h3>SEO Strategy</h3>
                  <p>Dominate search results and drive organic traffic with our expert optimization techniques.</p>
                </div>
                <div className="service-cell service-img-cell">
                  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop" alt="SEO Strategy" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process - Horizontal Rows */}
      <section className="container process-section">
        <h2 className="process-heading">How we <span className="emphasis-italic">work</span></h2>
        <div className="process-list">
          <div className="process-row">
            <h3>Discovery</h3>
            <p>We dive deep into your brand, goals, and audience to craft a tailored marketing strategy.</p>
            <div className="process-num">01</div>
          </div>
          <div className="process-row">
            <h3>Execution</h3>
            <p>Our team brings ideas to life with compelling visuals, messaging, and data-driven content.</p>
            <div className="process-num">02</div>
          </div>
          <div className="process-row">
            <h3>Optimization</h3>
            <p>We refine campaigns in real-time, ensuring maximum performance and engagement.</p>
            <div className="process-num">03</div>
          </div>
          <div className="process-row">
            <h3>Growth</h3>
            <p>With data-driven insights, we scale your success and drive long-term impact.</p>
            <div className="process-num">04</div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container testimonials-section">
        <h2 className="text-center" style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          Hear what clients have to say about us
        </h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>"Veltrix completely transformed our online presence. Our lead generation increased by 40% in just two months."</p>
            <div className="testimonial-author">Sarah Jenkins</div>
            <div className="testimonial-role">CEO, TechFlow</div>
          </div>
          <div className="testimonial-card">
            <p>"The team at Veltrix understands both aesthetics and business strategy. A rare combination in agencies today."</p>
            <div className="testimonial-author">Michael Chen</div>
            <div className="testimonial-role">Founder, NovaApp</div>
          </div>
          <div className="testimonial-card">
            <p>"They delivered our rebrand perfectly and increased our conversion rate significantly. Truly top-tier work."</p>
            <div className="testimonial-author">Elena Rostova</div>
            <div className="testimonial-role">CMO, Horizon</div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container faq-section">
        <div className="faq-list">
          {[
            { q: "How long does a website project take?", a: "Most website projects take between 4 to 8 weeks depending on the complexity and the number of pages." },
            { q: "Do you provide ongoing support?", a: "Yes, we offer monthly retainers for continuous maintenance, marketing, and scaling." },
            { q: "Can you help with digital marketing as well?", a: "Absolutely. We build the systems and also run the marketing campaigns to drive traffic to them." },
            { q: "What is the typical budget required?", a: "Our projects start at $5,000 for standard websites, and custom web apps or marketing retainers vary based on scope." }
          ].map((faq, i) => (
            <div key={i} className={`faq-row ${activeFaq === i ? 'active' : ''}`}>
              <div className="faq-question" onClick={() => toggleFaq(i)}>
                {faq.q}
                {activeFaq === i ? <Minus size={24} /> : <Plus size={24} />}
              </div>
              <div className="faq-answer">{faq.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container contact-section">
        <div className="contact-bg-wave"></div>
        <div className="contact-grid">
          <div className="contact-left">
            <h2>Contact us and let's<br /><span className="emphasis-italic">Grow.</span></h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginBottom: '3rem' }}>
              Fill out the form or reach out directly to schedule your free strategy call.
            </p>
            <Button size="lg" variant="primary">Book Call</Button>
          </div>
          <div className="contact-right">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input type="text" className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input type="text" className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Service</label>
              <input type="text" className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <input type="text" className="form-input" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
