import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
      <Reveal className="cs-header" variants={sectionReveal}>
        <div className="breadcrumb">
          <span className="breadcrumb-brand">Veltrix</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Scaling Sales with Paid Ads</span>
        </div>
        <h1 className="cs-title">Scaling Sales with Paid Ads</h1>
      </Reveal>

      <div className="cs-hero-wrapper">
        <motion.img
          src="/works-paidads.png"
          alt="Scaling Sales with Paid Ads"
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
              LuxeFit, a premium activewear brand, had been running digital ads with
              inconsistent results. Their cost-per-click was too high, and their
              conversion rates were not strong enough to justify ad spend. Despite
              having a great product, they were struggling to attract and convert
              the right audience.
            </p>
            <p>
              Their previous campaigns lacked a structured approach, leading to wasted
              budget and missed opportunities. They needed a performance-driven
              advertising strategy that targeted the right customers with compelling
              ad creatives and optimized placements.
            </p>
          </Reveal>

          <Reveal as="section" className="cs-section" variants={sectionRevealLg}>
            <h2>Our Approach</h2>
            <p>
              We began with a full ad account audit, identifying inefficiencies and
              gaps in targeting. We then restructured their ad campaigns, focusing
              on precision audience segmentation. Our strategy involved:
            </p>
            <ul className="cs-list">
              <li>Highly targeted Facebook &amp; Instagram ads based on customer behavior and interests.</li>
              <li>A/B testing different creatives and messaging to find the most effective combinations.</li>
              <li>Google Search &amp; Display ads to capture high-intent buyers.</li>
              <li>Retargeting campaigns to re-engage abandoned cart users and past visitors.</li>
            </ul>
            <p>
              Additionally, we refreshed LuxeFit&apos;s ad creatives to emphasize
              lifestyle storytelling. Instead of generic product photos, we used
              dynamic visuals showcasing real customers in action.
            </p>
          </Reveal>

          <Reveal as="section" className="cs-section" variants={sectionRevealLg}>
            <h2>Key Results</h2>
            <Reveal className="cs-results-grid" variants={staggerParent}>
              <motion.div className="cs-result-item" variants={fadeUp}>
                <span className="cs-result-number">120%</span>
                <span className="cs-result-label">increase in sales</span>
              </motion.div>
              <motion.div className="cs-result-item" variants={fadeUp}>
                <span className="cs-result-number">5x</span>
                <span className="cs-result-label">ROAS</span>
              </motion.div>
            </Reveal>
          </Reveal>
        </div>

        <Reveal as="aside" className="cs-sidebar" variants={staggerParent}>
          <motion.div className="cs-meta-item" variants={fadeUp}>
            <span className="cs-meta-label">Client</span>
            <span className="cs-meta-value">Luxe Home</span>
          </motion.div>
          <motion.div className="cs-meta-item" variants={fadeUp}>
            <span className="cs-meta-label">Service</span>
            <span className="cs-meta-value">Paid Advertising</span>
          </motion.div>
        </Reveal>
      </div>
    </div>
  );
};

export default CaseStudyPage;
