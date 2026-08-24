import React, { useEffect, useMemo, useRef, type ReactNode, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollFloat.css';

gsap.registerPlugin(ScrollTrigger);

interface ScrollFloatProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement | null>;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
  as?: React.ElementType;
}

function processChildren(node: ReactNode, keyPrefix = ''): ReactNode {
  if (typeof node === 'string' || typeof node === 'number') {
    const text = String(node);
    const words = text.split(/(\s+)/);
    return words.map((word, wordIndex) => {
      if (/^\s+$/.test(word)) {
        return <span key={`${keyPrefix}-space-${wordIndex}`}>&nbsp;</span>;
      }
      return (
        <span className="word" key={`${keyPrefix}-w-${wordIndex}`}>
          {word.split('').map((char, charIndex) => (
            <span className="char" key={`${keyPrefix}-c-${wordIndex}-${charIndex}`}>
              {char}
            </span>
          ))}
        </span>
      );
    });
  }

  if (React.isValidElement(node)) {
    if (node.type === 'br') {
      return React.cloneElement(node, { key: keyPrefix || 'br' });
    }

    const element = node as React.ReactElement<{ children?: ReactNode }>;
    const children = element.props.children;

    return React.cloneElement(
      element,
      { key: keyPrefix || element.key },
      processChildren(children, `${keyPrefix}-elem`)
    );
  }

  if (Array.isArray(node)) {
    return node.map((child, idx) => {
      const prefix = `${keyPrefix}-${idx}`;
      const processed = processChildren(child, prefix);

      // Top-level HomePage children are a mixed list (text, <strong>, <br />).
      // Each mapped item must itself have a stable key for React.
      if (Array.isArray(processed)) {
        return <React.Fragment key={prefix}>{processed}</React.Fragment>;
      }
      if (React.isValidElement(processed)) {
        return processed.key != null
          ? processed
          : React.cloneElement(processed, { key: prefix });
      }
      return <React.Fragment key={prefix}>{processed}</React.Fragment>;
    });
  }

  return node;
}

const ScrollFloat: React.FC<ScrollFloatProps> = ({
  children,
  scrollContainerRef,
  containerClassName = '',
  textClassName = '',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03,
  as: Component = 'h2'
}) => {
  const containerRef = useRef<HTMLElement>(null);

  const splitText = useMemo(() => {
    return processChildren(children);
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    const charElements = el.querySelectorAll('.char');
    if (charElements.length === 0) return;

    const anim = gsap.fromTo(
      charElements,
      {
        willChange: 'opacity, transform',
        opacity: 0,
        yPercent: 120,
        scaleY: 2.3,
        scaleX: 0.7,
        transformOrigin: '50% 0%'
      },
      {
        duration: animationDuration,
        ease: ease,
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        stagger: stagger,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: scrollStart,
          end: scrollEnd,
          scrub: true
        }
      }
    );

    return () => {
      if (anim.scrollTrigger) {
        anim.scrollTrigger.kill();
      }
      anim.kill();
    };
  }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger]);

  return (
    <Component ref={containerRef} className={`scroll-float ${containerClassName}`}>
      <span className={`scroll-float-text ${textClassName}`}>{splitText}</span>
    </Component>
  );
};

export default ScrollFloat;
