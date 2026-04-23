import { useEffect, useMemo, useRef, useState } from 'react';
import type { ElementType, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { HTMLMotionProps, Variants } from 'framer-motion';
import { sectionReveal, scaleVariant, easeIOS, dur } from './variants';

interface RevealProps extends Omit<HTMLMotionProps<'div'>, 'variants' | 'initial' | 'animate' | 'whileInView' | 'viewport'> {
  children: ReactNode;
  variants?: Variants;
  as?: ElementType;
  /** Override the viewport margin (CSS shorthand). */
  viewportMargin?: string;
  /** Fire the animation every time it enters the viewport. Defaults to false. */
  repeat?: boolean;
  /** Optional additional delay (seconds). */
  delay?: number;
  className?: string;
}

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);
  return isMobile;
}

/**
 * Standardized on-scroll reveal wrapper. Every section using this will animate
 * with the same iOS cubic-bezier and timing so motion feels unified.
 *
 * - On `prefers-reduced-motion: reduce`, collapses to opacity-only fade.
 * - On mobile (<=768px), motion intensity is reduced by ~30%.
 */
export function Reveal({
  children,
  variants = sectionReveal,
  as,
  viewportMargin = '-10% 0px -5% 0px',
  repeat = false,
  delay,
  className,
  style,
  ...rest
}: RevealProps) {
  const shouldReduce = useReducedMotion();
  const isMobile = useIsMobile();

  const finalVariants = useMemo<Variants>(() => {
    if (shouldReduce) {
      return {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.01, ease: easeIOS } },
      };
    }
    if (isMobile) return scaleVariant(variants, 0.7);
    return variants;
  }, [variants, shouldReduce, isMobile]);

  const transitionOverride = delay !== undefined
    ? { transition: { duration: dur.md, ease: easeIOS, delay } }
    : undefined;

  // motion() is deprecated in framer-motion v12; use motion.create() instead.
  // Memoized on `as` so a new component type isn't created on every render.
  const asRef = useRef(as)
  asRef.current = as
  const MotionTag = useMemo(
    () => (as ? motion.create(as as Parameters<typeof motion.create>[0]) : motion.div),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [as],
  );

  return (
    <MotionTag
      className={className}
      style={style}
      variants={finalVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: !repeat, margin: viewportMargin, amount: 0.15 }}
      {...(transitionOverride as object)}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

export default Reveal;
