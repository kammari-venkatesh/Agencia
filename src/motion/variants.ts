import type { Variants } from 'framer-motion';

export const easeIOS = [0.22, 1, 0.36, 1] as const;

export const dur = {
  sm: 0.55,
  md: 0.75,
  lg: 0.95,
} as const;

export const sectionReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.98,
    filter: 'blur(8px)',
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: dur.md, ease: easeIOS },
  },
};

export const sectionRevealLg: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.98,
    filter: 'blur(8px)',
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: dur.lg, ease: easeIOS },
  },
};

export const staggerParent: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.08,
    },
  },
};

export const staggerParentFast: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

export const staggerParentSlow: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: dur.md, ease: easeIOS },
  },
};

export const fadeUpSoft: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: dur.sm, ease: easeIOS },
  },
};

export const imageReveal: Variants = {
  hidden: {
    opacity: 0,
    scale: 1.04,
    filter: 'blur(6px)',
  },
  show: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: dur.md, ease: easeIOS },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: dur.md, ease: easeIOS },
  },
};

export const menuOverlay: Variants = {
  hidden: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
  },
  show: {
    opacity: 1,
    backdropFilter: 'blur(24px)',
    transition: { duration: 0.45, ease: easeIOS },
  },
  exit: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    transition: { duration: 0.35, ease: easeIOS },
  },
};

export const menuContainer: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: easeIOS,
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: 8,
    scale: 0.97,
    transition: { duration: 0.35, ease: easeIOS },
  },
};

export const menuItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 0.85,
    y: 0,
    transition: { duration: 0.5, ease: easeIOS },
  },
  exit: {
    opacity: 0,
    y: 6,
    transition: { duration: 0.25, ease: easeIOS },
  },
};

/**
 * Scales a variant's `hidden` distances/blur/scale by a factor (used for
 * mobile intensity reduction per spec: "reduce motion intensity by 30%").
 */
export function scaleVariant(variant: Variants, factor: number): Variants {
  const scaleField = (obj: Record<string, unknown> | undefined) => {
    if (!obj) return obj;
    const next: Record<string, unknown> = { ...obj };
    if (typeof next.y === 'number') next.y = (next.y as number) * factor;
    if (typeof next.x === 'number') next.x = (next.x as number) * factor;
    if (typeof next.scale === 'number') {
      const s = next.scale as number;
      next.scale = 1 - (1 - s) * factor;
    }
    if (typeof next.filter === 'string') {
      const m = /blur\(([\d.]+)px\)/.exec(next.filter as string);
      if (m) {
        const px = parseFloat(m[1]) * factor;
        next.filter = `blur(${px}px)`;
      }
    }
    return next;
  };
  return {
    ...variant,
    hidden: scaleField(variant.hidden as Record<string, unknown>) as Variants['hidden'],
    show: variant.show,
    exit: scaleField(variant.exit as Record<string, unknown>) as Variants['exit'],
  };
}
