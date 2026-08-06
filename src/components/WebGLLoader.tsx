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
  const promptRef = useRef<HTMLParagraphElement | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
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

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
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
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      uniforms.uResolution.value.set(width, height);
    };

    window.addEventListener('resize', handleResize);

    let animationFrameId: number;
    const startTime = performance.now();

    const tick = () => {
      uniforms.uTime.value = (performance.now() - startTime) * 0.001;
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    let revealed = false;

    const handleClick = () => {
      if (revealed) return;
      revealed = true;

      // Fade out "CLICK TO REVEAL" prompt
      if (promptRef.current) {
        gsap.to(promptRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          ease: 'power2.inOut',
        });
      }

      // Drive the shader transition: noise dissolves from center outward
      gsap.to(uniforms.uTransition, {
        value: 1.0,
        duration: 3.0,
        ease: 'power2.inOut',
        onComplete: () => {
          if (loaderRef.current) {
            loaderRef.current.style.pointerEvents = 'none';
          }
          setIsDone(true);
          if (onRevealComplete) onRevealComplete();
        },
      });
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [accentColor, onRevealComplete]);

  if (isDone) return null;

  return (
    <div ref={loaderRef} id="loader">
      <canvas ref={canvasRef} id="loader-canvas" />
      <p ref={promptRef} className="click-prompt">CLICK TO REVEAL</p>
    </div>
  );
};

export default WebGLLoader;
