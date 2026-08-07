import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useInView } from 'framer-motion';

interface AnimatedNumberProps {
  value: string | number;
  className?: string;
  trigger?: boolean;
  duration?: number;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  className = '',
  trigger = true,
  duration = 1.6,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const valueStr = String(value);
  const match = valueStr.match(/^([^\d,.]*)([\d,. ]+)(.*)$/);

  const prefix = match ? match[1] : '';
  const rawNumStr = match ? match[2].trim() : '0';
  const suffix = match ? match[3] : '';

  const hasComma = rawNumStr.includes(',');
  const targetNum = parseFloat(rawNumStr.replace(/,/g, '')) || 0;
  const decimalMatch = rawNumStr.split('.')[1];
  const decimals = decimalMatch ? decimalMatch.length : 0;

  const [displayValue, setDisplayValue] = useState(() => {
    return `${prefix}0${suffix}`;
  });

  const shouldAnimate = trigger && isInView;
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!shouldAnimate || animatedRef.current) return;

    if (isNaN(targetNum)) {
      setDisplayValue(valueStr);
      return;
    }

    animatedRef.current = true;

    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: targetNum,
      duration: duration,
      ease: 'power3.out',
      onUpdate: () => {
        let currentFormatted = obj.val.toFixed(decimals);
        if (hasComma) {
          const parts = currentFormatted.split('.');
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          currentFormatted = parts.join('.');
        }
        setDisplayValue(`${prefix}${currentFormatted}${suffix}`);
      },
    });

    return () => {
      tween.kill();
    };
  }, [shouldAnimate, targetNum, decimals, prefix, suffix, duration, hasComma, valueStr]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
};

export default AnimatedNumber;
