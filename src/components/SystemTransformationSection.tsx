import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  Palette,
  Code2,
  Megaphone,
  Users,
  TrendingUp,
  ArrowRight,
  X,
  Activity,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import './SystemTransformationSection.css';

interface SystemTransformationSectionProps {
  onBookCall?: () => void;
}

const SYSTEM_STAGES = [
  {
    id: '01',
    name: 'DESIGN',
    shortDesc: 'Looks good',
    fullTitle: 'Strategic Brand & UX Architecture',
    desc: 'Great design without strategy gets ignored. We craft distinct visual identities, high-converting interfaces, and intuitive user paths designed for high-intent visitors.',
    icon: Palette,
    metric: '+140% Engagement',
    details: ['Visual Identity Systems', 'Conversion UX Architecture', 'Interactive Design Languages', 'Design Tokens & Components']
  },
  {
    id: '02',
    name: 'DEVELOPMENT',
    shortDesc: 'Works fast',
    fullTitle: 'High-Performance Engineering',
    desc: 'Slow websites destroy conversions before the pitch even starts. We engineer sub-second, ultra-fluid digital platforms built for scale and seamless interaction.',
    icon: Code2,
    metric: '<0.4s Load Speed',
    details: ['Next.js & Vite Frameworks', 'Sub-second Page Speeds', 'Custom Micro-animations', 'Clean Scalable Codebase']
  },
  {
    id: '03',
    name: 'MARKETING',
    shortDesc: 'Gets attention',
    fullTitle: 'Precision Growth Marketing',
    desc: 'Random marketing burns money. We create targeted campaigns and messaging frameworks that align directly with high-intent prospective clients.',
    icon: Megaphone,
    metric: '3.8× Ad Efficiency',
    details: ['Full-funnel Strategy', 'Organic & Paid Acquisition', 'Conversion Messaging', 'Multi-channel Attribution']
  },
  {
    id: '04',
    name: 'LEADS',
    shortDesc: 'Creates demand',
    fullTitle: 'Automated Lead & Demand Engine',
    desc: 'Turn traffic into qualified pipelines. We build automated lead capture systems, instant qualifying workflows, and CRM integrations that never lose a prospect.',
    icon: Users,
    metric: '4.2× Lead Capture Rate',
    details: ['High-converting Offers', 'Automated Lead Qualification', 'Instant CRM Syncing', 'Smart Lead Routing']
  },
  {
    id: '05',
    name: 'GROWTH',
    shortDesc: 'Moves revenue',
    fullTitle: 'Scalable Revenue Compounder',
    desc: 'When design, dev, and marketing synchronize, growth becomes predictable. Every touchpoint compounds toward bottom-line business revenue.',
    icon: TrendingUp,
    metric: '8.4× Avg ROI',
    details: ['Data-driven CRO', 'Lifetime Value Optimization', 'Real-time Growth Dashboards', 'Continuous Iteration']
  }
];

const PROBLEM_ITEMS = [
  {
    id: 'p1',
    title: 'Random marketing',
    explanation: 'Spending budget on unaligned campaigns without tracking conversion metrics or customer lifetime value.'
  },
  {
    id: 'p2',
    title: 'Slow websites',
    explanation: 'Losing high-intent visitors before your value proposition even finishes rendering on screen.'
  },
  {
    id: 'p3',
    title: 'Weak branding',
    explanation: 'Blending into the noise with generic templates and unmemorable, cookie-cutter messaging.'
  },
  {
    id: 'p4',
    title: 'Disconnected tools',
    explanation: 'Customer data trapped in isolated apps while valuable qualified leads slip through the cracks.'
  },
  {
    id: 'p5',
    title: 'No clear strategy',
    explanation: 'Executing isolated tactics without a unified, end-to-end system pointing directly to revenue.'
  }
];

// ─── Shared Spring Easing (matches Apple HIG) ─────────────────────────────────
const SPRING_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Clip-reveal variants (each "line" slides up from behind a mask) ──────────
const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.05,
    },
  },
};

// Badge / eyebrow: subtle fade + lift
const eyebrowVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: SPRING_EASE },
  },
};

// Each headline "line" — clipped slide-up for iPhone crispness
const lineVariants: Variants = {
  hidden: { opacity: 0, y: '110%' },
  show: {
    opacity: 1,
    y: '0%',
    transition: { duration: 0.72, ease: SPRING_EASE },
  },
};

// Subtitle: soft stagger after title
const subtitleVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.60, ease: SPRING_EASE },
  },
};

// Chaos section entrance
const chaosVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: SPRING_EASE },
  },
};

// Problem rows — stagger in
const problemRowVariants: Variants = {
  hidden: { opacity: 0, x: -14 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: SPRING_EASE },
  },
};

const problemContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

// Problem left col
const problemLeftVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.70, ease: SPRING_EASE },
  },
};

// ─── Clip wrapper — each line needs overflow:hidden parent ────────────────────
const LineClip: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <span className={`sys-line-clip${className ? ` ${className}` : ''}`}>
    {children}
  </span>
);

export const SystemTransformationSection: React.FC<SystemTransformationSectionProps> = () => {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [hoveredProblem, setHoveredProblem] = useState<string | null>(null);
  const [manualState, setManualState] = useState<'auto' | 'chaos' | 'connected'>('auto');

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollSectionRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: scrollSectionRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 28,
    restDelta: 0.001,
  });

  const chaosProgress = useTransform(smoothProgress, [0.15, 0.55], [0, 1]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <section
      id="problem-solution"
      ref={containerRef}
      className="sys-section"
      onMouseMove={handleMouseMove}
      aria-label="The Digital System Difference"
    >
      <div
        className="sys-mouse-glow"
        style={{
          background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(220, 20, 60, 0.045), transparent 75%)`,
        }}
        aria-hidden="true"
      />
      <div className="sys-bg-grid" aria-hidden="true" />

      <div className="sys-container">

        {/* ══════════════════════════════════════════════════════════════════
            HEADER — LINE-BY-LINE CLIP REVEAL (Apple / Vercel style)
           ══════════════════════════════════════════════════════════════════ */}
        <motion.header
          className="sys-header"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.18 }}
        >
          {/* Eyebrow badge */}
          <motion.div className="sys-eyebrow" variants={eyebrowVariants}>
            <span className="sys-eyebrow-badge">
              <span className="sys-status-dot" />
              THE REAL PROBLEM
            </span>
            <span className="sys-eyebrow-code">[ SYS_DIAGNOSTIC // 2026 ]</span>
          </motion.div>

          {/* Title — each line wrapped in overflow:hidden for crisp clip-reveal */}
          <h2 className="sys-title sys-title--reveal">
            <LineClip>
              <motion.span className="sys-title-line" variants={lineVariants}>
                Your business doesn't need
              </motion.span>
            </LineClip>

            <LineClip>
              <motion.span className="sys-title-line sys-title-muted" variants={lineVariants}>
                MORE marketing.
              </motion.span>
            </LineClip>

            <LineClip>
              <motion.span className="sys-title-line" variants={lineVariants}>
                It needs a better{' '}
                <span className="sys-cherry-highlight">SYSTEM.</span>
              </motion.span>
            </LineClip>
          </h2>

          {/* Subtitle */}
          <motion.p className="sys-subtitle" variants={subtitleVariants}>
            Great design without strategy gets ignored. Great marketing without infrastructure burns money. We connect everything.
          </motion.p>
        </motion.header>

        {/* ══════════════════════════════════════════════════════════════════
            INTERACTIVE CHAOS VISUAL — scroll-driven entrance
           ══════════════════════════════════════════════════════════════════ */}
        <motion.div
          ref={scrollSectionRef}
          className="sys-chaos-stage-wrapper"
          variants={chaosVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
        >
          <div className="sys-chaos-header">
            <div className="sys-chaos-label">
              <span className="sys-tag-icon"><Activity size={14} /></span>
              <span>INTERACTIVE SYSTEM COMPOSITION</span>
            </div>

            <div className="sys-chaos-controls">
              <span className="sys-control-hint">PREVIEW MODE:</span>
              <button
                type="button"
                className={`sys-toggle-btn ${manualState === 'auto' ? 'active' : ''}`}
                onClick={() => setManualState('auto')}
              >
                SCROLL CONTROL
              </button>
              <button
                type="button"
                className={`sys-toggle-btn ${manualState === 'chaos' ? 'active' : ''}`}
                onClick={() => setManualState('chaos')}
              >
                CHAOS
              </button>
              <button
                type="button"
                className={`sys-toggle-btn ${manualState === 'connected' ? 'active' : ''}`}
                onClick={() => setManualState('connected')}
              >
                CONNECTED SYSTEM
              </button>
            </div>
          </div>

          <div className="sys-chaos-canvas">
            <motion.div
              className="sys-status-banner"
              style={{
                borderColor: manualState === 'connected' ? 'rgba(220,20,60,0.3)' : 'rgba(0,0,0,0.08)',
              }}
            >
              <div className="sys-status-banner-left">
                <span className="sys-pulse-indicator" />
                <span className="sys-status-text">
                  {manualState === 'chaos'
                    ? 'Looks familiar? — DISCONNECTED STATE'
                    : manualState === 'connected'
                    ? 'ONE SYSTEM. ONE DIRECTION. REAL GROWTH.'
                    : 'SCROLL TO CONNECT THE DOTS'}
                </span>
              </div>
              <div className="sys-status-banner-right">
                <span>[ NODES: 5/5 ]</span>
                <span className="sys-divider-slash">/</span>
                <span>[ STATUS: OPTIMIZED ]</span>
              </div>
            </motion.div>

            <svg className="sys-rail-svg" preserveAspectRatio="none" viewBox="0 0 1000 120">
              <line x1="80" y1="60" x2="920" y2="60" className="sys-rail-line-bg" />
              <line x1="80" y1="60" x2="920" y2="60" className="sys-rail-line-active" />
              <circle r="4" className="sys-rail-pulse-dot">
                <animateMotion path="M 80 60 L 920 60" dur="3.5s" repeatCount="indefinite" />
              </circle>
            </svg>

            <div className="sys-nodes-grid">
              {SYSTEM_STAGES.map((stage, idx) => {
                const Icon = stage.icon;
                const chaosOffsets = [
                  { x: -18, y: -24, rot: -2.5, status: 'DISCONNECTED' },
                  { x: 14, y: 20, rot: 2.2, status: 'NO INFRA' },
                  { x: -12, y: -18, rot: -1.8, status: 'UNALIGNED' },
                  { x: 18, y: 22, rot: 2.6, status: 'LEAKING' },
                  { x: -8, y: -16, rot: -2.0, status: 'STAGNANT' },
                ];
                const offset = chaosOffsets[idx];

                return (
                  <div key={stage.id} className="sys-node-cell">
                    <motion.div
                      className={`sys-chaos-node ${activeStage === idx ? 'sys-chaos-node--active' : ''}`}
                      animate={
                        manualState === 'chaos'
                          ? { x: offset.x, y: offset.y, rotate: offset.rot, scale: 1 }
                          : manualState === 'connected'
                          ? { x: 0, y: 0, rotate: 0, scale: 1.03 }
                          : {
                              x: offset.x * (1 - (chaosProgress.get() || 0)),
                              y: offset.y * (1 - (chaosProgress.get() || 0)),
                              rotate: offset.rot * (1 - (chaosProgress.get() || 0)),
                            }
                      }
                      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                      onClick={() => setActiveStage(idx)}
                    >
                      <div className="sys-node-top">
                        <span className="sys-node-num">{stage.id}</span>
                        <div className="sys-node-icon-wrap"><Icon size={16} /></div>
                      </div>
                      <div className="sys-node-body">
                        <span className="sys-node-name">{stage.name}</span>
                        <span className="sys-node-short">"{stage.shortDesc}"</span>
                      </div>
                      <div className="sys-node-footer">
                        {manualState === 'chaos' ? (
                          <span className="sys-warn-badge">
                            <ShieldAlert size={11} /> {offset.status}
                          </span>
                        ) : (
                          <span className="sys-synced-badge">
                            <CheckCircle2 size={11} /> SYNCED
                          </span>
                        )}
                      </div>
                      {idx < SYSTEM_STAGES.length - 1 && (
                        <div className="sys-node-arrow" aria-hidden="true">
                          <ArrowRight size={14} />
                        </div>
                      )}
                    </motion.div>
                  </div>
                );
              })}
            </div>

            <div className="sys-chaos-footer-bar">
              <div className="sys-footer-flow-preview">
                <span className="sys-flow-tag">DESIGN</span>
                <span className="sys-flow-sep">→</span>
                <span className="sys-flow-tag">DEVELOPMENT</span>
                <span className="sys-flow-sep">→</span>
                <span className="sys-flow-tag">MARKETING</span>
                <span className="sys-flow-sep">→</span>
                <span className="sys-flow-tag">LEADS</span>
                <span className="sys-flow-sep">→</span>
                <span className="sys-flow-tag sys-flow-tag--accent">GROWTH</span>
              </div>
              <div className="sys-footer-tagline">
                CHAOS TRANSFORMS INTO PREDICTABLE REVENUE
              </div>
            </div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════════════
            PROBLEM SECTION — staggered row entrance
           ══════════════════════════════════════════════════════════════════ */}
        <div className="sys-problem-section">
          <div className="sys-problem-grid-layout">

            {/* Left column — slide up */}
            <motion.div
              className="sys-problem-left-col"
              variants={problemLeftVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="sys-section-label">
                <span className="sys-label-dot" />
                THE USUAL APPROACH
              </div>
              <h3 className="sys-problem-heading">
                Businesses keep buying<br />
                <span className="sys-cherry-text">pieces of the puzzle.</span>
              </h3>
              <p className="sys-problem-copy">
                Hiring separate agencies for design, dev, and marketing creates friction, delay, and wasted budget. Every disconnected vendor optimizes for their deliverable — not your bottom line.
              </p>
            </motion.div>

            {/* Right column — rows stagger in */}
            <motion.div
              className="sys-problem-right-col"
              variants={problemContainerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
            >
              <div className="sys-rows-list">
                {PROBLEM_ITEMS.map((item) => {
                  const isHovered = hoveredProblem === item.id;
                  return (
                    <motion.div
                      key={item.id}
                      className={`sys-problem-row ${isHovered ? 'sys-problem-row--active' : ''}`}
                      variants={problemRowVariants}
                      onMouseEnter={() => setHoveredProblem(item.id)}
                      onMouseLeave={() => setHoveredProblem(null)}
                      whileHover={{ x: 6 }}
                      transition={{ duration: 0.22 }}
                    >
                      <div className="sys-row-main">
                        <div className="sys-row-left">
                          <span className={`sys-x-icon ${isHovered ? 'sys-x-icon--active' : ''}`}>
                            <X size={16} />
                          </span>
                          <span className="sys-row-title">{item.title}</span>
                        </div>
                        <div className="sys-row-right">
                          <span className="sys-row-indicator">
                            {isHovered ? 'EXPLAINED' : 'HOVER TO EXPAND'}
                          </span>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            className="sys-row-explanation"
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginTop: 8 }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                          >
                            <span className="sys-arrow-sub">→</span>
                            <span className="sys-explanation-text">{item.explanation}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default SystemTransformationSection;
