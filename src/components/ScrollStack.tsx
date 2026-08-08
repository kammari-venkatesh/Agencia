import React, { useLayoutEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import './ScrollStack.css';

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, itemClassName = '' }) => (
  <div className={`services-stack-card-layer ${itemClassName}`.trim()}>{children}</div>
);

interface ScrollStackProps {
  className?: string;
  children: ReactNode;
}

/**
 * ScrollStack — High-Precision Pinned Card Overlay Engine.
 *
 * 1. Viewport pins at top: 0 when entering section. Header & Card 0 stay 100% frozen.
 * 2. Only the active base card and incoming overlay card are visible during scroll.
 * 3. Covered cards transition to opacity: 0 so no text peeks out or overlaps underneath.
 * 4. Cards slide smoothly from translateY(105%) -> translateY(0%) with zero whitespace gaps.
 */
const ScrollStack: React.FC<ScrollStackProps> = ({ children, className = '' }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const isUpdatingRef = useRef(false);
  const rafIdRef = useRef<number>(0);

  const updateCardTransforms = useCallback(() => {
    const section = sectionRef.current;
    if (!section || !cardsRef.current.length || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalHeight = rect.height - windowHeight;

    if (totalHeight <= 0) {
      isUpdatingRef.current = false;
      return;
    }

    // Scroll progress from 0 (section top) to 1 (section exit)
    const rawProgress = -rect.top / totalHeight;
    const progress = Math.min(Math.max(rawProgress, 0), 1);

    const cards = cardsRef.current;
    const totalCards = cards.length;
    if (totalCards === 0) {
      isUpdatingRef.current = false;
      return;
    }

    const totalIntervals = Math.max(totalCards - 1, 1);
    const step = 1 / totalIntervals;

    // Calculate current base card index (0 to totalCards - 1)
    const activeIndex = Math.min(Math.floor(progress * totalIntervals), totalCards - 1);

    cards.forEach((card, i) => {
      if (!card) return;

      if (i < activeIndex) {
        // Covered card behind active layer -> hidden to prevent peeking text/shadow overlap
        card.style.transform = 'translate3d(0, 0%, 0) scale(0.96)';
        card.style.opacity = '0';
        card.style.pointerEvents = 'none';
      } else if (i === activeIndex) {
        // Current active base pinned card
        card.style.transform = 'translate3d(0, 0%, 0) scale(1)';
        card.style.opacity = '1';
        card.style.pointerEvents = 'auto';
      } else if (i === activeIndex + 1) {
        // Incoming card sliding UP over active base card
        const intervalStart = activeIndex * step;
        const cardProgress = Math.min(Math.max((progress - intervalStart) / step, 0), 1);

        // Smooth cubic ease-out for natural gliding motion
        const easedProgress = 1 - Math.pow(1 - cardProgress, 2.5);
        const translateY = (1 - easedProgress) * 105;

        card.style.transform = `translate3d(0, ${translateY.toFixed(2)}%, 0) scale(1)`;
        card.style.opacity = '1';
        card.style.pointerEvents = 'auto';
      } else {
        // Future cards waiting below off-screen
        card.style.transform = 'translate3d(0, 105%, 0) scale(1)';
        card.style.opacity = '0';
        card.style.pointerEvents = 'none';
      }
    });

    isUpdatingRef.current = false;
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = Array.from(
      section.querySelectorAll('.services-stack-card-layer')
    ) as HTMLElement[];

    cardsRef.current = cards;

    cards.forEach((card, i) => {
      card.style.willChange = 'transform, opacity';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.zIndex = `${i + 1}`;
    });

    updateCardTransforms();

    let pending = false;
    const onScroll = () => {
      if (pending) return;
      pending = true;
      rafIdRef.current = requestAnimationFrame(() => {
        pending = false;
        updateCardTransforms();
      });
    };

    const onResize = () => {
      updateCardTransforms();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      cardsRef.current = [];
      isUpdatingRef.current = false;
    };
  }, [updateCardTransforms]);

  return (
    <div className={`services-pinned-section ${className}`.trim()} ref={sectionRef}>
      <div className="services-sticky-viewport">
        {children}
      </div>
    </div>
  );
};

export default ScrollStack;
