import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Reveal } from '../motion/Reveal';
import { getLenis } from '../motion/SmoothScroll';
import {
  fadeUp,
  imageReveal,
  sectionReveal,
  sectionRevealLg,
  staggerParent,
} from '../motion/variants';
import './CaseStudyPage.css';

const CaseStudyPage: React.FC = () => {
  const { id } = useParams();

  useEffect(() => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [id]);

  return (
    <div className="case-study-page container">
      {/* Breadcrumb & Title */}
      <Reveal className="cs-header" variants={sectionReveal}>
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Works</Link> <span style={{ margin: '0 8px' }}>/</span> PayX Rebranding
        </div>
        <h1 className="cs-title">PayX Rebranding</h1>
      </Reveal>

      {/* Hero Image */}
      <div className="cs-hero-wrapper">
        <motion.img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
          alt="PayX Case Study Hero"
          className="cs-hero-image"
          variants={imageReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-5% 0px', amount: 0.2 }}
        />
      </div>

      {/* Content Layout */}
      <div className="cs-content-grid">
        <div className="cs-main-content">
          <Reveal as="section" className="cs-section" variants={sectionRevealLg}>
            <h2>Understanding the Challenge</h2>
            <p>
              PayX, a rising fintech startup, provided seamless digital payment solutions but struggled with a weak brand identity. Their visuals were inconsistent, and their messaging lacked the clarity and authority needed to gain consumer trust in a competitive market. Without a strong and recognizable brand, PayX was losing potential customers to more established competitors.
            </p>
            <p>
              Beyond visuals, their brand voice didn't communicate security, reliability, and ease of use—essential elements in fintech. Their website had high bounce rates, their app downloads had plateaued, and they weren't retaining as many users as expected. They needed a complete rebrand to reposition themselves as an industry leader.
            </p>
          </Reveal>

          <Reveal as="section" className="cs-section" variants={sectionRevealLg}>
            <h2>Our Approach</h2>
            <p>
              We began with an in-depth brand audit to identify weaknesses and opportunities. Our team analyzed competitors, gathered customer feedback, and studied market trends. Based on our insights, we developed a new brand strategy centered around three core pillars: trust, simplicity, and innovation.
            </p>
            <p>
              From there, we redesigned the PayX logo with a sleek, modern aesthetic that reflected security and digital efficiency. We introduced a refined color palette that evoked professionalism and reliability, along with typography that enhanced readability. We also revamped their website with an intuitive user interface, clear messaging, and persuasive call-to-actions to improve conversions.
            </p>
            <p>
              To ensure long-term consistency, we provided PayX with a brand guideline document covering logo usage, tone of voice, and design principles. We also collaborated with their marketing team to develop social media templates and email campaigns that aligned with their new identity.
            </p>
          </Reveal>

          <Reveal as="section" className="cs-section" variants={sectionRevealLg}>
            <h2>Key Results</h2>
            <Reveal className="cs-results-grid" variants={staggerParent}>
              <motion.div className="cs-result-item" variants={fadeUp}>
                <span className="cs-result-number">60%</span>
                <span className="cs-result-label">increase in brand recognition</span>
              </motion.div>
              <motion.div className="cs-result-item" variants={fadeUp}>
                <span className="cs-result-number">35%</span>
                <span className="cs-result-label">boost in website engagement</span>
              </motion.div>
            </Reveal>
          </Reveal>
        </div>

        <Reveal as="aside" className="cs-sidebar" variants={staggerParent}>
          <motion.div className="cs-meta-item" variants={fadeUp}>
            <span className="cs-meta-label">Date</span>
            <span className="cs-meta-value">Mar 28, 2025</span>
          </motion.div>
          <motion.div className="cs-meta-item" variants={fadeUp}>
            <span className="cs-meta-label">Client</span>
            <span className="cs-meta-value">PayX</span>
          </motion.div>
          <motion.div className="cs-meta-item" variants={fadeUp}>
            <span className="cs-meta-label">Service</span>
            <span className="cs-meta-value">Rebranding</span>
          </motion.div>
        </Reveal>
      </div>
    </div>
  );
};

export default CaseStudyPage;
