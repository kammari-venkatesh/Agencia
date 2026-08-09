import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { vertexShader, fragmentShader } from './shaders';
import './WebGLLoader.css';

interface WebGLLoaderProps {
  onRevealComplete?: () => void;
  accentColor?: string;
}

export const WebGLLoader: React.FC<WebGLLoaderProps> = ({
  onRevealComplete,
  accentColor = '#DC143C',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setIsDone(true);
      if (onRevealComplete) onRevealComplete();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;
    let autoTimer: number;
    let failsafeTimer: number;
    let renderer: THREE.WebGLRenderer | null = null;
    let geometry: THREE.PlaneGeometry | null = null;
    let material: THREE.ShaderMaterial | null = null;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);

      const uniforms = {
        uTransition: { value: 0.0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uTime: { value: 0.0 },
        uBorderColor: { value: new THREE.Color(accentColor) },
      };

      geometry = new THREE.PlaneGeometry(2, 2);
      material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
        depthWrite: false,
        depthTest: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        if (renderer) {
          renderer.setSize(width, height);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
        uniforms.uResolution.value.set(width, height);
      };

      window.addEventListener('resize', handleResize);

      const startTime = performance.now();
      const tick = () => {
        uniforms.uTime.value = (performance.now() - startTime) * 0.001;
        if (renderer) {
          renderer.render(scene, camera);
        }
        animationFrameId = requestAnimationFrame(tick);
      };

      tick();

      let revealed = false;
      const isMobileDevice =
        typeof window !== 'undefined' &&
        (window.innerWidth <= 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0);

      const startAutoReveal = () => {
        if (revealed) return;
        revealed = true;

        gsap.to(uniforms.uTransition, {
          value: 1.0,
          duration: isMobileDevice ? 2.0 : 3.2,
          delay: 0.15,
          ease: 'power2.inOut',
          onComplete: () => {
            if (loaderRef.current) {
              loaderRef.current.style.pointerEvents = 'none';
              loaderRef.current.style.opacity = '0';
            }
            setTimeout(() => {
              setIsDone(true);
              if (onRevealComplete) onRevealComplete();
            }, 150);
          },
        });
      };

      // Automatically start reveal animation after 150ms
      autoTimer = window.setTimeout(startAutoReveal, 150);

      // Hard failsafe timer: guarantee loader unmounts within 4.5s
      failsafeTimer = window.setTimeout(() => {
        setIsDone(true);
        if (onRevealComplete) onRevealComplete();
      }, 4500);

      return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(autoTimer);
        clearTimeout(failsafeTimer);
        cancelAnimationFrame(animationFrameId);
        if (geometry) geometry.dispose();
        if (material) material.dispose();
        if (renderer) renderer.dispose();
      };
    } catch {
      // Fallback if WebGL fails or context is lost
      setIsDone(true);
      if (onRevealComplete) onRevealComplete();
    }
  }, [accentColor, onRevealComplete]);

  if (isDone) return null;

  return (
    <div ref={loaderRef} id="loader">
      <canvas ref={canvasRef} id="loader-canvas" />
    </div>
  );
};

export default WebGLLoader;
