import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import './FlowingMenu.css';

export interface ProcessItemData {
  num: string;
  text: string;
  desc: string;
  link?: string;
}

export interface FlowingMenuProps {
  items?: ProcessItemData[];
  bgColor?: string;
  accentColor?: string;
  textColor?: string;
  borderColor?: string;
  onItemClick?: (item: ProcessItemData) => void;
}

interface MenuItemProps extends ProcessItemData {
  index: number;
  accentColor: string;
  textColor: string;
  borderColor: string;
  isFirst: boolean;
  isActiveMobile: boolean;
  onMobileToggle: () => void;
  onItemClick?: (item: ProcessItemData) => void;
}

const FlowingMenu: React.FC<FlowingMenuProps> = ({
  items = [],
  bgColor = '#ffffff',
  accentColor = '#D90445',
  textColor = '#1a1a1a',
  borderColor = 'rgba(0, 0, 0, 0.08)',
  onItemClick,
}) => {
  const [activeMobileIndex, setActiveMobileIndex] = useState<number | null>(null);

  const handleMobileToggle = (idx: number) => {
    setActiveMobileIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="process-menu-wrap" style={{ backgroundColor: bgColor }}>
      <nav className="process-menu" aria-label="Our Process">
        {items.map((item, idx) => (
          <MenuItem
            key={item.num || idx}
            index={idx}
            {...item}
            accentColor={accentColor}
            textColor={textColor}
            borderColor={borderColor}
            isFirst={idx === 0}
            isActiveMobile={activeMobileIndex === idx}
            onMobileToggle={() => handleMobileToggle(idx)}
            onItemClick={onItemClick}
          />
        ))}
      </nav>
    </div>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({
  index,
  num,
  text,
  desc,
  link = '#contact',
  accentColor,
  textColor,
  borderColor,
  isFirst,
  isActiveMobile,
  onMobileToggle,
  onItemClick,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const overlayInnerRef = useRef<HTMLDivElement>(null);
  const marqueeContainerRef = useRef<HTMLDivElement>(null);

  const sweepTlRef = useRef<gsap.core.Timeline | null>(null);

  // Direction-aware 4-edge detection (top, bottom, left, right)
  const findClosestEdge = (
    mouseX: number,
    mouseY: number,
    width: number,
    height: number
  ): 'top' | 'bottom' | 'left' | 'right' => {
    const distTop = mouseY;
    const distBottom = height - mouseY;
    const distLeft = mouseX;
    const distRight = width - mouseX;

    const min = Math.min(distTop, distBottom, distLeft, distRight);
    if (min === distTop) return 'top';
    if (min === distBottom) return 'bottom';
    if (min === distLeft) return 'left';
    return 'right';
  };

  const handleMouseEnter = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth <= 768) return;
    if (!itemRef.current || !overlayRef.current || !overlayInnerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set(overlayRef.current, { x: '0%', y: '0%', opacity: 1 });
      gsap.set(overlayInnerRef.current, { x: '0%', y: '0%' });
      return;
    }

    const rect = itemRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    let startOverlay = { x: '0%', y: '0%' };
    let startInner = { x: '0%', y: '0%' };

    if (edge === 'top') {
      startOverlay = { x: '0%', y: '-101%' };
      startInner = { x: '0%', y: '101%' };
    } else if (edge === 'bottom') {
      startOverlay = { x: '0%', y: '101%' };
      startInner = { x: '0%', y: '-101%' };
    } else if (edge === 'left') {
      startOverlay = { x: '-101%', y: '0%' };
      startInner = { x: '101%', y: '0%' };
    } else if (edge === 'right') {
      startOverlay = { x: '101%', y: '0%' };
      startInner = { x: '-101%', y: '0%' };
    }

    if (sweepTlRef.current) {
      sweepTlRef.current.kill();
    }

    const tl = gsap.timeline({ defaults: { duration: 0.65, ease: 'expo.out' } });

    tl.set(overlayRef.current, { ...startOverlay, opacity: 1 }, 0)
      .set(overlayInnerRef.current, startInner, 0)
      .to([overlayRef.current, overlayInnerRef.current], { x: '0%', y: '0%' }, 0);

    if (marqueeContainerRef.current) {
      tl.fromTo(
        marqueeContainerRef.current,
        { opacity: 0.2, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' },
        0.1
      );
    }

    sweepTlRef.current = tl;
  };

  const handleMouseLeave = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth <= 768) return;
    if (!itemRef.current || !overlayRef.current || !overlayInnerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set(overlayRef.current, { opacity: 0 });
      return;
    }

    const rect = itemRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    let exitOverlay = { x: '0%', y: '0%' };
    let exitInner = { x: '0%', y: '0%' };

    if (edge === 'top') {
      exitOverlay = { x: '0%', y: '-101%' };
      exitInner = { x: '0%', y: '101%' };
    } else if (edge === 'bottom') {
      exitOverlay = { x: '0%', y: '101%' };
      exitInner = { x: '0%', y: '-101%' };
    } else if (edge === 'left') {
      exitOverlay = { x: '-101%', y: '0%' };
      exitInner = { x: '101%', y: '0%' };
    } else if (edge === 'right') {
      exitOverlay = { x: '101%', y: '0%' };
      exitInner = { x: '-101%', y: '0%' };
    }

    if (sweepTlRef.current) {
      sweepTlRef.current.kill();
    }

    sweepTlRef.current = gsap
      .timeline({ defaults: { duration: 0.5, ease: 'power3.inOut' } })
      .to(overlayRef.current, exitOverlay, 0)
      .to(overlayInnerRef.current, exitInner, 0);
  };

  useEffect(() => {
    return () => {
      if (sweepTlRef.current) {
        sweepTlRef.current.kill();
      }
    };
  }, []);

  const handleClick = (ev: React.MouseEvent) => {
    if (window.innerWidth <= 768) {
      onMobileToggle();
    } else if (onItemClick) {
      ev.preventDefault();
      onItemClick({ num, text, desc, link });
    }
  };

  return (
    <motion.div
      ref={itemRef}
      className={`process-menu__item ${isActiveMobile ? 'is-mobile-active' : ''}`}
      style={{
        borderBottom: `1px solid ${borderColor}`,
        borderTop: isFirst ? `1px solid ${borderColor}` : undefined,
      }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5% 0px', amount: 0.2 }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-expanded={isActiveMobile}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (window.innerWidth <= 768) {
            onMobileToggle();
          } else if (onItemClick) {
            onItemClick({ num, text, desc, link });
          }
        }
      }}
    >
      {/* Base Resting State (Clean white background: Number, Title, Arrow) */}
      <div className="process-menu__base">
        <span className="process-menu__num" style={{ color: accentColor }}>
          {num}
        </span>
        <h3 className="process-menu__title" style={{ color: textColor }}>
          {text}
        </h3>
        <div className="process-menu__arrow-wrap" aria-hidden="true">
          <svg
            className="process-menu__arrow"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </div>

      {/* Cherry-Red Flowing Overlay State (100% GPU-Accelerated Endless Moving Marquee) */}
      <div
        ref={overlayRef}
        className="process-menu__overlay"
        style={{ backgroundColor: accentColor }}
        aria-hidden="true"
      >
        <div ref={overlayInnerRef} className="process-menu__overlay-inner">
          <div ref={marqueeContainerRef} className="process-menu__marquee-container">
            <div className="process-menu__marquee-track">
              {/* Half 1 */}
              <div className="process-menu__marquee-part">
                <span className="process-menu__marquee-text">{desc}</span>
                <span className="process-menu__marquee-sep">✦</span>
                <span className="process-menu__marquee-text">{desc}</span>
                <span className="process-menu__marquee-sep">✦</span>
              </div>
              {/* Half 2 */}
              <div className="process-menu__marquee-part">
                <span className="process-menu__marquee-text">{desc}</span>
                <span className="process-menu__marquee-sep">✦</span>
                <span className="process-menu__marquee-text">{desc}</span>
                <span className="process-menu__marquee-sep">✦</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FlowingMenu;
