import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus } from 'lucide-react';
import Button from '../components/Button';
import Plasma from '../components/Plasma';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

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

      {/* Services - Horizontal Scroll Layout */}
      <section id="services" className="services-section">
        <div className="container">
          <h2 className="services-header">What we <span className="emphasis-italic">offer</span></h2>
        </div>
        <div className="services-scroll-wrapper">
          <div className="services-track">
            {/* Column 1 - Text Top */}
            <div className="service-card layout-top-text">
              <div className="service-text">
                <h3>Content Marketing</h3>
                <p>Engage your audience with compelling content that builds trust and drives conversions.</p>
              </div>
              <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop" alt="Content Marketing" className="service-img" />
            </div>

            {/* Column 2 - Image Top */}
            <div className="service-card layout-bottom-text">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop" alt="Paid Advertising" className="service-img" />
              <div className="service-text">
                <h3>Paid Advertising</h3>
                <p>Reach the right audience with data-driven ad campaigns that maximize ROI.</p>
              </div>
            </div>

            {/* Column 3 - Text Top */}
            <div className="service-card layout-top-text">
              <div className="service-text">
                <h3>Rebranding</h3>
                <p>Transform your brand with a fresh identity that aligns with your vision and market trends.</p>
              </div>
              <img src="https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=600&auto=format&fit=crop" alt="Rebranding" className="service-img" />
            </div>

            {/* Column 4 - Image Top */}
            <div className="service-card layout-bottom-text">
              <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop" alt="Email Marketing" className="service-img" />
              <div className="service-text">
                <h3>Email Marketing</h3>
                <p>Boost engagement and retention with high-converting email campaigns.</p>
              </div>
            </div>

            {/* Extra empty space block to allow scrolling past the last item cleanly */}
            <div style={{ minWidth: '150px' }}></div>
          </div>
          <div className="scroll-blur-overlay"></div>
        </div>
      </section>

      {/* Process - Horizontal Rows */}
      <section className="container process-section">
        <h2 className="works-header">How we work</h2>
        <div className="process-list">
          <div className="process-row">
            <h3>Discovery</h3>
            <p>We dive deep into your business, competitors, and goals to build a tailored strategy.</p>
            <div className="process-num">01</div>
          </div>
          <div className="process-row">
            <h3>Execution</h3>
            <p>Crafting premium, user-centric designs and scalable tech solutions.</p>
            <div className="process-num">02</div>
          </div>
          <div className="process-row">
            <h3>Optimization</h3>
            <p>Refining and testing user flows and funnels to maximize conversion rates.</p>
            <div className="process-num">03</div>
          </div>
          <div className="process-row">
            <h3>Growth</h3>
            <p>Deploying the system and implementing marketing to drive immediate scale.</p>
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
