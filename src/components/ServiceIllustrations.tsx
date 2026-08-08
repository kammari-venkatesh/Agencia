import React from 'react';

/**
 * Custom 3D glossy translucent vector illustrations inspired by the reference image.
 * Gives each service card a distinct 3D visual element with gradients and drop shadows.
 */

/* 1. Website Development: 3D Glossy Cursor Arrow (Exactly as in reference image!) */
export const Cursor3DIllustration: React.FC = () => (
  <svg
    viewBox="0 0 300 260"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="ssc-3d-illustration"
  >
    <defs>
      <linearGradient id="cursorGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
        <stop offset="60%" stopColor="#FFE0D5" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#FFC4B0" stopOpacity="0.85" />
      </linearGradient>
      <linearGradient id="cursorGradBevel" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#E6957D" stopOpacity="0.6" />
      </linearGradient>
      <linearGradient id="cursorGradInner" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF2EE" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#F5A38B" stopOpacity="0.7" />
      </linearGradient>
      <filter id="cursorShadow" x="-20%" y="-20%" width="150%" height="150%">
        <feDropShadow dx="10" dy="18" stdDeviation="12" floodColor="#8B0018" floodOpacity="0.35" />
      </filter>
    </defs>
    {/* Main 3D Arrow Cursor */}
    <g filter="url(#cursorShadow)" transform="translate(30, 10) rotate(-12, 120, 120)">
      {/* Outer 3D Extrusion Layer */}
      <path
        d="M60 20 L210 120 L140 140 L175 220 L135 235 L100 155 L40 190 Z"
        fill="url(#cursorGradBevel)"
      />
      {/* Top Face */}
      <path
        d="M60 10 L210 110 L140 130 L175 210 L135 225 L100 145 L40 180 Z"
        fill="url(#cursorGradMain)"
      />
      {/* Inset Specular Highlight */}
      <path
        d="M75 35 L180 105 L135 118 L100 132 L58 158 Z"
        fill="url(#cursorGradInner)"
      />
    </g>
  </svg>
);

/* 2. App Development: 3D Smartphone Frame */
export const Phone3DIllustration: React.FC = () => (
  <svg
    viewBox="0 0 300 260"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="ssc-3d-illustration"
  >
    <defs>
      <linearGradient id="phoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#FFD4C8" stopOpacity="0.8" />
      </linearGradient>
      <filter id="phoneShadow" x="-20%" y="-20%" width="150%" height="150%">
        <feDropShadow dx="12" dy="16" stdDeviation="14" floodColor="#8B0018" floodOpacity="0.35" />
      </filter>
    </defs>
    <g filter="url(#phoneShadow)" transform="translate(60, 20) rotate(15, 100, 110)">
      <rect x="20" y="10" width="130" height="220" rx="28" fill="url(#phoneGrad)" stroke="#FFFFFF" strokeWidth="4" />
      <rect x="32" y="28" width="106" height="184" rx="18" fill="rgba(255, 255, 255, 0.3)" />
      <circle cx="85" cy="20" r="4" fill="rgba(217, 20, 56, 0.4)" />
    </g>
  </svg>
);

/* 3. AI Chatbots: 3D Sphere Orb & Sparkle */
export const Bot3DIllustration: React.FC = () => (
  <svg
    viewBox="0 0 300 260"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="ssc-3d-illustration"
  >
    <defs>
      <radialGradient id="botOrbGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
        <stop offset="50%" stopColor="#FFE4DC" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#F89D82" stopOpacity="0.7" />
      </radialGradient>
      <filter id="botShadow">
        <feDropShadow dx="10" dy="16" stdDeviation="12" floodColor="#8B0018" floodOpacity="0.35" />
      </filter>
    </defs>
    <g filter="url(#botShadow)" transform="translate(50, 10)">
      <circle cx="120" cy="110" r="75" fill="url(#botOrbGrad)" />
      <path d="M120 70 L126 100 L156 106 L126 112 L120 142 L114 112 L84 106 L114 100 Z" fill="#FFFFFF" />
      <circle cx="170" cy="50" r="14" fill="#FFFFFF" opacity="0.9" />
    </g>
  </svg>
);

/* 4. Workflow Automations: 3D Interlocking Gear & Nodes */
export const Workflow3DIllustration: React.FC = () => (
  <svg
    viewBox="0 0 300 260"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="ssc-3d-illustration"
  >
    <defs>
      <linearGradient id="wfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#FFC8B8" stopOpacity="0.8" />
      </linearGradient>
      <filter id="wfShadow">
        <feDropShadow dx="10" dy="16" stdDeviation="12" floodColor="#8B0018" floodOpacity="0.3" />
      </filter>
    </defs>
    <g filter="url(#wfShadow)" transform="translate(50, 20) rotate(-10, 110, 110)">
      <rect x="30" y="30" width="70" height="70" rx="20" fill="url(#wfGrad)" />
      <rect x="130" y="110" width="70" height="70" rx="20" fill="url(#wfGrad)" />
      <path d="M100 65 Q 130 65 165 110" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
    </g>
  </svg>
);

/* 5. AI Calling Systems: 3D Headset / Waveform */
export const PhoneCall3DIllustration: React.FC = () => (
  <svg
    viewBox="0 0 300 260"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="ssc-3d-illustration"
  >
    <defs>
      <linearGradient id="callGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#FFC4B4" stopOpacity="0.8" />
      </linearGradient>
      <filter id="callShadow">
        <feDropShadow dx="10" dy="16" stdDeviation="12" floodColor="#8B0018" floodOpacity="0.3" />
      </filter>
    </defs>
    <g filter="url(#callShadow)" transform="translate(50, 20)">
      <circle cx="120" cy="110" r="60" fill="none" stroke="url(#callGrad)" strokeWidth="16" />
      <rect x="50" y="90" width="30" height="60" rx="12" fill="url(#callGrad)" />
      <rect x="160" y="90" width="30" height="60" rx="12" fill="url(#callGrad)" />
    </g>
  </svg>
);

/* 6. Generic/Fallback: 3D Star / Crystal */
export const Generic3DIllustration: React.FC = () => (
  <svg
    viewBox="0 0 300 260"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="ssc-3d-illustration"
  >
    <defs>
      <linearGradient id="genGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#FFC2B0" stopOpacity="0.85" />
      </linearGradient>
      <filter id="genShadow">
        <feDropShadow dx="10" dy="16" stdDeviation="12" floodColor="#8B0018" floodOpacity="0.3" />
      </filter>
    </defs>
    <g filter="url(#genShadow)" transform="translate(60, 20) rotate(12, 100, 100)">
      <polygon points="100,20 125,75 180,80 140,120 150,175 100,145 50,175 60,120 20,80 75,75" fill="url(#genGrad)" />
    </g>
  </svg>
);
