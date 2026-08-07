import React, { useEffect, useMemo, useRef, ReactNode, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollFloat.css';

gsap.registerPlugin(ScrollTrigger);

interface ScrollFloatProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
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
      return node;
    }

    const element = node as React.ReactElement<{ children?: ReactNode }>;
    const children = element.props.children;

    return React.cloneElement(
      element,
      { ...element.props },
      processChildren(children, `${keyPrefix}-elem`)
    );
  }

  if (Array.isArray(node)) {
    return node.map((child, idx) => processChildren(child, `${keyPrefix}-${idx}`));
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

  // @ts-expect-error Tag element ref type
  return (
    <Component ref={containerRef} className={`scroll-float ${containerClassName}`}>
      <span className={`scroll-float-text ${textClassName}`}>{splitText}</span>
    </Component>
  );
};

export default ScrollFloat;
