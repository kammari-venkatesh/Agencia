import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import {
  whyVridhioEyebrow,
  whyVridhioMainHeading,
  whyVridhioMainHeadingAccent,
  whyVridhioSubheading,
  capabilityNodes,
  comparisonSteps,
} from '../data/whyVridhio';
import type { CapabilityNode } from '../data/whyVridhio';
import './WhyVridhioSection.css';

// Sub-component for individual capability nodes to handle per-node scroll transforms safely
const CapabilityNodeCard: React.FC<{
  node: CapabilityNode;
  progress: any;
  shouldReduceMotion: boolean | null;
  baseOpacity: any;
}> = ({ node, progress, shouldReduceMotion, baseOpacity }) => {
  const nodeX = useTransform(progress, [0, 0.75], [node.x * 1.5, node.x]);
  const nodeY = useTransform(progress, [0, 0.75], [node.y * 1.5, node.y]);

  return (
    <motion.div
      key={node.id}
      className={`wv-node-card wv-node-${node.id}`}
      style={{
        x: shouldReduceMotion ? node.x : nodeX,
        y: shouldReduceMotion ? node.y : nodeY,
        opacity: shouldReduceMotion ? 1 : baseOpacity,
      }}
    >
      <div className="wv-node-header">
        <span className="wv-node-num">SYSTEM / {node.number}</span>
        <span className="wv-node-dot" />
      </div>
      <h3 className="wv-node-title">{node.name}</h3>
      <p className="wv-node-desc">{node.shortDesc}</p>
      <div className="wv-node-footer">
        <span className="wv-node-role">{node.role}</span>
        <span className="wv-node-state">CONNECTED</span>
      </div>
    </motion.div>
  );
};

const WhyVridhioSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  // Scroll triggers for ecosystem section
  const sectionRef = useRef<HTMLDivElement>(null);
  const ecosystemRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: ecosystemProgress } = useScroll({
    target: ecosystemRef,
    offset: ['start 75%', 'end 35%'],
  });

  const { scrollYProgress: comparisonProgress } = useScroll({
    target: comparisonRef,
    offset: ['start 80%', 'end 30%'],
  });

  // Smooth springs for fluid scroll transforms
  const smoothEcoProgress = useSpring(ecosystemProgress, {
    stiffness: 100,
    damping: 24,
    restDelta: 0.001,
  });

  const smoothCompProgress = useSpring(comparisonProgress, {
    stiffness: 100,
    damping: 24,
    restDelta: 0.001,
  });

  // Dynamic transforms based on scroll
  const nodeOpacity = useTransform(smoothEcoProgress, [0, 0.3, 0.7], [0.45, 0.75, 1]);
  const lineDashOffset = useTransform(smoothEcoProgress, [0, 1], [400, 0]);
  const lineOpacity = useTransform(smoothEcoProgress, [0, 0.4, 0.8], [0.2, 0.6, 1]);
  const centerPulseScale = useTransform(smoothEcoProgress, [0.3, 0.9], [0.85, 1.15]);
  const centerGlowOpacity = useTransform(smoothEcoProgress, [0.2, 0.85], [0.2, 0.9]);
  const climaxOpacity = useTransform(smoothEcoProgress, [0.55, 0.85], [0, 1]);
  const climaxY = useTransform(smoothEcoProgress, [0.55, 0.85], [24, 0]);

  // Vertical divider fill height for comparison
  const dividerHeight = useTransform(smoothCompProgress, [0, 0.85], ['0%', '100%']);

  return (
    <section id="why-vridhio" ref={sectionRef} className="wv-section" aria-label="Why Vridhio Ecosystem">
      {/* Subtle Grain & Ambient Glow Background */}
      <div className="wv-bg-grain" aria-hidden="true" />
      <div className="wv-ambient-glow" aria-hidden="true" />
      <div className="wv-grid-lines" aria-hidden="true" />

      <div className="container wv-container">
        {/* ===================================================
            1. HERO INTRO
           =================================================== */}
        <header className="wv-hero">
          <motion.div
            className="wv-eyebrow-pill"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <span className="wv-status-indicator" />
            <span className="wv-eyebrow-text">{whyVridhioEyebrow}</span>
            <span className="wv-meta-tag">VRD-SYS // 2026</span>
          </motion.div>

          <motion.h2
            className="wv-hero-title"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {whyVridhioMainHeading}{' '}
            <span className="wv-title-accent">{whyVridhioMainHeadingAccent}</span>
          </motion.h2>

          <motion.p
            className="wv-hero-desc"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {whyVridhioSubheading}
          </motion.p>
        </header>

        {/* ===================================================
            2. CENTRAL "VRIDHIO SYSTEM" ECOSYSTEM (DESKTOP & TABLET)
           =================================================== */}
        <div ref={ecosystemRef} className="wv-ecosystem-wrapper">
          <div className="wv-ecosystem-header">
            <span className="wv-tech-label">SYSTEM ARCHITECTURE</span>
            <span className="wv-tech-status">
              ● SCROLL TO CONNECT NODES
            </span>
          </div>

          <div className="wv-ecosystem-stage">
            {/* SVG Connecting Paths & Pulsing Particles */}
            <svg className="wv-network-svg" viewBox="-400 -280 800 560" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(220, 20, 60, 0.15)" />
                  <stop offset="50%" stopColor="rgba(220, 20, 60, 0.85)" />
                  <stop offset="100%" stopColor="rgba(220, 20, 60, 0.15)" />
                </linearGradient>
                <radialGradient id="centerGlowGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(220, 20, 60, 0.25)" />
                  <stop offset="60%" stopColor="rgba(220, 20, 60, 0.08)" />
                  <stop offset="100%" stopColor="rgba(220, 20, 60, 0)" />
                </radialGradient>
              </defs>

              {/* Background Orbit Ring */}
              <circle cx="0" cy="0" r="180" className="wv-svg-orbit" />
              <circle cx="0" cy="0" r="240" className="wv-svg-orbit-outer" />

              {/* Connecting Lines from Central (0,0) to Node Coordinates */}
              {capabilityNodes.map((node) => (
                <g key={`line-${node.id}`}>
                  {/* Dashed faint base line */}
                  <line
                    x1="0"
                    y1="0"
                    x2={node.x}
                    y2={node.y}
                    className="wv-svg-base-line"
                  />

                  {/* Animated Red Connection Line */}
                  <motion.line
                    x1="0"
                    y1="0"
                    x2={node.x}
                    y2={node.y}
                    className="wv-svg-active-line"
                    style={{
                      strokeDasharray: 400,
                      strokeDashoffset: lineDashOffset,
                      opacity: lineOpacity,
                    }}
                  />

                  {/* Moving Light Pulses along the line */}
                  <circle cx="0" cy="0" r="3.5" className="wv-svg-pulse-dot">
                    <animateMotion
                      path={`M 0,0 L ${node.x},${node.y}`}
                      dur={`${2.2 + node.mobileOrder * 0.4}s`}
                      repeatCount="indefinite"
                      keyTimes="0;1"
                    />
                  </circle>
                  <circle cx="0" cy="0" r="3.5" className="wv-svg-pulse-dot-reverse">
                    <animateMotion
                      path={`M ${node.x},${node.y} L 0,0`}
                      dur={`${2.8 + node.mobileOrder * 0.3}s`}
                      repeatCount="indefinite"
                      keyTimes="0;1"
                    />
                  </circle>
                </g>
              ))}
            </svg>

            {/* CENTRAL VRIDHIO NODE */}
            <div className="wv-node-center-wrap">
              <motion.div
                className="wv-node-center-glow"
                style={{
                  scale: shouldReduceMotion ? 1 : centerPulseScale,
                  opacity: shouldReduceMotion ? 0.8 : centerGlowOpacity,
                }}
              />
              <motion.div
                className="wv-node-center"
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="wv-center-badge">CORE SYSTEM</span>
                <span className="wv-center-brand">VRIDHIŌ</span>
                <span className="wv-center-status">● INTEGRATED</span>
              </motion.div>
            </div>

            {/* SURROUNDING CAPABILITY NODES */}
            {capabilityNodes.map((node) => (
              <CapabilityNodeCard
                key={node.id}
                node={node}
                progress={smoothEcoProgress}
                shouldReduceMotion={shouldReduceMotion}
                baseOpacity={nodeOpacity}
              />
            ))}
          </div>

          {/* MOBILE ALTERNATIVE VISUAL TIMELINE (<768px) */}
          <div className="wv-mobile-timeline" aria-label="Vridhio Mobile System Flow">
            <div className="wv-mobile-system-card">
              <div className="wv-mobile-center-header">
                <span className="wv-center-badge">CENTRAL ENGINE</span>
                <h3 className="wv-mobile-brand">VRIDHIŌ</h3>
                <p className="wv-mobile-sub">Connected Growth System</p>
              </div>
              <div className="wv-mobile-nodes-list">
                {capabilityNodes.map((node, index) => (
                  <motion.div
                    key={node.id}
                    className="wv-mobile-node-item"
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="wv-mobile-node-left">
                      <span className="wv-mobile-num">{node.number}</span>
                      <span className="wv-mobile-line" />
                    </div>
                    <div className="wv-mobile-node-content">
                      <div className="wv-mobile-node-top">
                        <h4 className="wv-mobile-node-title">{node.name}</h4>
                        <span className="wv-mobile-badge">CONNECTED</span>
                      </div>
                      <p className="wv-mobile-node-desc">{node.shortDesc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* VISUAL CLIMAX REVEAL */}
          <motion.div
            className="wv-ecosystem-climax"
            style={{
              opacity: shouldReduceMotion ? 1 : climaxOpacity,
              y: shouldReduceMotion ? 0 : climaxY,
            }}
          >
            <span className="wv-climax-eyebrow">SYSTEM STATUS: FULLY SYNCHRONIZED</span>
            <h3 className="wv-climax-statement">
              ONE PARTNER. <span className="wv-text-highlight">EVERYTHING CONNECTED.</span>
            </h3>
          </motion.div>
        </div>

        {/* ===================================================
            3. THE "WHY" MOMENT — BOLD TRANSITION
           =================================================== */}
        <div className="wv-contrast-section">
          <div className="wv-contrast-inner">
            <motion.div
              className="wv-contrast-box wv-contrast-old"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 0.7, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
            >
              <span className="wv-contrast-label">THE TRADITIONAL MODEL</span>
              <p className="wv-contrast-text-old">Most agencies sell services.</p>
            </motion.div>

            <motion.div
              className="wv-contrast-arrow"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ArrowRight size={24} className="wv-arrow-icon" />
            </motion.div>

            <motion.div
              className="wv-contrast-box wv-contrast-new"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: 0.25 }}
            >
              <span className="wv-contrast-label wv-label-cherry">THE VRIDHIO SYSTEM</span>
              <h3 className="wv-contrast-text-new">
                Vridhiō builds <span className="wv-cherry-highlight">systems.</span>
              </h3>
            </motion.div>
          </div>
        </div>

        {/* ===================================================
            4. INTERACTIVE COMPARISON (OLD WAY VS VRIDHIO WAY)
           =================================================== */}
        <div ref={comparisonRef} className="wv-comparison-section">
          <div className="wv-comparison-header">
            <span className="wv-tech-label">MODEL COMPARISON</span>
            <h3 className="wv-comparison-title">The Usual Agency vs. Vridhiō</h3>
          </div>

          <div className="wv-comparison-grid">
            {/* LEFT COLUMN: THE USUAL AGENCY */}
            <div className="wv-comp-col wv-comp-usual">
              <div className="wv-comp-col-header">
                <span className="wv-comp-tag wv-tag-usual">DISCONNECTED</span>
                <h4 className="wv-comp-col-title">THE USUAL AGENCY</h4>
                <p className="wv-comp-col-sub">Isolated vendors, fragmented accountability</p>
              </div>
              <ul className="wv-comp-list">
                {comparisonSteps.map((step, idx) => (
                  <li key={`usual-${idx}`} className="wv-comp-item wv-item-usual">
                    <div className="wv-comp-bullet-off">✕</div>
                    <div className="wv-comp-item-text">
                      <span className="wv-comp-item-title">{step.usual}</span>
                      <span className="wv-comp-item-sub">{step.usualSub}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* CENTER VERTICAL DIVIDER */}
            <div className="wv-comp-divider-wrap" aria-hidden="true">
              <div className="wv-comp-divider-base" />
              <motion.div
                className="wv-comp-divider-fill"
                style={{ height: dividerHeight }}
              />
              <div className="wv-comp-divider-badge">VS</div>
            </div>

            {/* RIGHT COLUMN: VRIDHIO SYSTEM */}
            <div className="wv-comp-col wv-comp-vridhio">
              <div className="wv-comp-col-header">
                <span className="wv-comp-tag wv-tag-vridhio">● VRIDHIŌ SYSTEM</span>
                <h4 className="wv-comp-col-title">VRIDHIŌ</h4>
                <p className="wv-comp-col-sub">One connected team, compounding revenue output</p>
              </div>
              <ul className="wv-comp-list">
                {comparisonSteps.map((step, idx) => (
                  <li key={`vridhio-${idx}`} className="wv-comp-item wv-item-vridhio">
                    <div className="wv-comp-bullet-on">
                      <Check size={14} strokeWidth={3} />
                    </div>
                    <div className="wv-comp-item-text">
                      <div className="wv-comp-item-row">
                        <span className="wv-comp-item-title-vridhio">{step.vridhio}</span>
                        {idx < comparisonSteps.length - 1 && (
                          <span className="wv-comp-step-arrow">↓</span>
                        )}
                      </div>
                      <span className="wv-comp-item-sub-vridhio">{step.vridhioSub}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ===================================================
            6. SECTION ENDING — THE DIFFERENCE
           =================================================== */}
        <div className="wv-ending">
          <motion.div
            className="wv-ending-inner"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7 }}
          >
            <span className="wv-tech-label">THE DIFFERENCE</span>
            <h3 className="wv-ending-title">
              Five capabilities. <br />
              One growth partner.
            </h3>
            <div className="wv-ending-accent-row">
              <span className="wv-ending-accent-text">That’s</span>
              <span className="wv-ending-brand">Vridhiō.</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyVridhioSection;
