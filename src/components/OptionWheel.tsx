import React, { useRef, useState, useEffect, useCallback } from 'react';
import './OptionWheel.css';

export interface OptionWheelProps {
  items: string[];
  defaultSelected?: number;
  textColor?: string;
  activeColor?: string;
  side?: 'left' | 'right';
  fontSize?: number; // rem
  spacing?: number;
  curve?: number;
  tilt?: number;
  blur?: number; // px
  fade?: number;
  smoothing?: number; // ms
  inset?: number; // px
  loop?: boolean;
  draggable?: boolean;
  onChange?: (index: number, item: string) => void;
  className?: string;
}

export const OptionWheel: React.FC<OptionWheelProps> = ({
  items,
  defaultSelected = 0,
  textColor = '#a6a6a6',
  activeColor = '#DC143C',
  side = 'left',
  fontSize = 2.4,
  spacing = 1.4,
  curve = 1,
  tilt = 6,
  blur = 1.5,
  fade = 0.25,
  smoothing = 200,
  inset = 45,
  loop = false,
  draggable = true,
  onChange,
  className = '',
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(defaultSelected);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number>(0);
  const currentDragYRef = useRef<number>(0);
  const lastWheelTimeRef = useRef<number>(0);

  const selectIndex = useCallback(
    (newIndex: number) => {
      let target = newIndex;
      if (loop) {
        target = (newIndex + items.length) % items.length;
      } else {
        target = Math.max(0, Math.min(items.length - 1, newIndex));
      }
      setSelectedIndex(target);
      if (onChange) {
        onChange(target, items[target]);
      }
    },
    [items, loop, onChange]
  );

  // Sync with defaultSelected if it updates externally
  useEffect(() => {
    if (defaultSelected !== selectedIndex && defaultSelected >= 0 && defaultSelected < items.length) {
      setSelectedIndex(defaultSelected);
    }
  }, [defaultSelected]);

  // Handle Dragging
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable) return;
    setIsDragging(true);
    startYRef.current = e.clientY;
    currentDragYRef.current = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !draggable) return;
    const deltaY = e.clientY - startYRef.current;
    currentDragYRef.current = deltaY;
    setDragOffset(deltaY);
  };

  const handlePointerUp = () => {
    if (!isDragging || !draggable) return;
    setIsDragging(false);

    const deltaY = currentDragYRef.current;
    setDragOffset(0);

    const threshold = 40; // px displacement to trigger index change
    if (Math.abs(deltaY) > threshold) {
      const steps = Math.round(-deltaY / 50);
      if (steps !== 0) {
        selectIndex(selectedIndex + (steps > 0 ? 1 : -1));
      }
    }
  };

  // Handle Wheel Scroll
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (now - lastWheelTimeRef.current < 120) return; // Throttling scroll wheel
    lastWheelTimeRef.current = now;

    if (e.deltaY > 15) {
      selectIndex(selectedIndex + 1);
    } else if (e.deltaY < -15) {
      selectIndex(selectedIndex - 1);
    }
  };

  const itemHeight = fontSize * 16 * spacing;

  return (
    <div
      ref={containerRef}
      className={`option-wheel-container side-${side} ${isDragging ? 'is-dragging' : ''} ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      role="region"
      aria-label="Option Wheel Selection"
    >
      <div className="option-wheel-track">
        {items.map((item, index) => {
          const rawOffset = index - selectedIndex;
          const dragFraction = isDragging ? dragOffset / itemHeight : 0;
          const effectiveOffset = rawOffset + dragFraction;

          const isSelected = index === selectedIndex;
          const absOffset = Math.abs(effectiveOffset);

          // 3D Geometry calculations
          const yPos = effectiveOffset * itemHeight;
          
          // Curved X displacement based on side and distance from center
          const curveFactor = Math.sin((effectiveOffset * Math.PI) / 8);
          const xPos =
            side === 'left'
              ? (1 - Math.cos((effectiveOffset * Math.PI) / 6)) * inset * curve
              : -(1 - Math.cos((effectiveOffset * Math.PI) / 6)) * inset * curve;

          const rotateX = -effectiveOffset * 18 * curve;
          const rotateY = side === 'left' ? -tilt * curveFactor : tilt * curveFactor;

          const opacity = Math.max(0.12, 1 - absOffset * fade);
          const blurVal = Math.min(6, absOffset * blur);
          const scale = Math.max(0.82, 1 - absOffset * 0.06);

          return (
            <div
              key={`${item}-${index}`}
              className={`option-wheel-item ${isSelected ? 'is-active' : ''}`}
              style={{
                transform: `translate3d(${xPos}px, ${yPos}px, 0px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                filter: blurVal > 0.2 ? `blur(${blurVal}px)` : 'none',
                color: isSelected ? activeColor : textColor,
                fontSize: `${fontSize}rem`,
                transition: isDragging ? 'none' : `all ${smoothing}ms cubic-bezier(0.16, 1, 0.3, 1)`,
              }}
              onClick={() => selectIndex(index)}
            >
              <span className="option-wheel-item-text">{item}</span>
              {isSelected && <span className="option-wheel-active-indicator" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OptionWheel;
