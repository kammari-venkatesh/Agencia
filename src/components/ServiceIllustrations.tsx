import React from 'react';

/**
 * Photorealistic 3D Vector & Image Illustrations.
 * Card 1: Bright White 3D Globe Grid Icon.
 * Card 2: User Reference Smartphone held in hands with isolated background.
 */

/* 1. Website Development: Bright White 3D Globe Grid Icon */
export const Cursor3DIllustration: React.FC = () => (
  <svg
    viewBox="0 0 300 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="ssc-3d-illustration"
  >
    <defs>
      <filter id="whiteGlobeShadow" x="-20%" y="-20%" width="160%" height="160%">
        <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#000000" floodOpacity="0.22" />
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#40000A" floodOpacity="0.3" />
      </filter>
    </defs>

    <g filter="url(#whiteGlobeShadow)">
      <circle cx="150" cy="150" r="120" stroke="#FFFFFF" strokeWidth="16" fill="none" />
      <line x1="150" y1="30" x2="150" y2="270" stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" />
      <path d="M 150 30 A 75 120 0 0 0 150 270" stroke="#FFFFFF" strokeWidth="14" fill="none" />
      <path d="M 150 30 A 75 120 0 0 1 150 270" stroke="#FFFFFF" strokeWidth="14" fill="none" />
      <line x1="30" y1="150" x2="270" y2="150" stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" />
      <path d="M 42 105 A 120 60 0 0 1 258 105" stroke="#FFFFFF" strokeWidth="14" fill="none" />
      <path d="M 42 195 A 120 60 0 0 0 258 195" stroke="#FFFFFF" strokeWidth="14" fill="none" />
    </g>
  </svg>
);

/* 2. App Development: User Reference Isolated Smartphone in Hands Image */
export const Phone3DIllustration: React.FC = () => (
  <div className="ssc-3d-image-wrap">
    <img
      src="/images/services-3d/app-development.png"
      alt="App Development Mobile Preview"
      className="ssc-3d-image ssc-3d-phone-image"
      loading="lazy"
    />
  </div>
);

/* 3. AI Chatbots: Photorealistic 3D Chrome & Glass AI Sphere */
export const Bot3DIllustration: React.FC = () => (
  <svg
    viewBox="0 0 340 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="ssc-3d-illustration"
  >
    <defs>
      <radialGradient id="aiOrbGlass" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="35%" stopColor="#FFF0EB" />
        <stop offset="70%" stopColor="#FFC8B8" />
        <stop offset="100%" stopColor="#D9684C" />
      </radialGradient>
      <linearGradient id="aiSilverRing" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#D4C5BC" />
        <stop offset="100%" stopColor="#8C7B70" />
      </linearGradient>
      <filter id="aiOrbShadow">
        <feDropShadow dx="14" dy="22" stdDeviation="16" floodColor="#40000A" floodOpacity="0.4" />
      </filter>
    </defs>

    <g filter="url(#aiOrbShadow)" transform="translate(60, 15)">
      <ellipse cx="110" cy="130" rx="95" ry="32" fill="none" stroke="url(#aiSilverRing)" strokeWidth="12" transform="rotate(-20, 110, 130)" />
      <circle cx="110" cy="120" r="80" fill="url(#aiOrbGlass)" />
      <path d="M110 75 L118 112 L155 120 L118 128 L110 165 L102 128 L65 120 L102 112 Z" fill="#FFFFFF" />
    </g>
  </svg>
);

/* 4. Workflow Automations: Photorealistic 3D Interlocking Metallic Gears */
export const Workflow3DIllustration: React.FC = () => (
  <svg
    viewBox="0 0 340 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="ssc-3d-illustration"
  >
    <defs>
      <linearGradient id="gearMetal1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#FFE0D4" />
        <stop offset="100%" stopColor="#B8583B" />
      </linearGradient>
      <linearGradient id="gearMetal2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#D4C5BC" />
        <stop offset="100%" stopColor="#8C7B70" />
      </linearGradient>
      <filter id="gearShadow">
        <feDropShadow dx="12" dy="20" stdDeviation="15" floodColor="#40000A" floodOpacity="0.4" />
      </filter>
    </defs>

    <g filter="url(#gearShadow)" transform="translate(40, 10)">
      <g transform="translate(40, 40) rotate(15, 60, 60)">
        <circle cx="60" cy="60" r="55" fill="url(#gearMetal1)" stroke="#FFFFFF" strokeWidth="3" />
        <circle cx="60" cy="60" r="22" fill="#FFFFFF" />
      </g>
      <g transform="translate(130, 110) rotate(-20, 65, 65)">
        <circle cx="65" cy="65" r="60" fill="url(#gearMetal2)" stroke="#FFFFFF" strokeWidth="3" />
        <circle cx="65" cy="65" r="25" fill="#FFFFFF" />
      </g>
    </g>
  </svg>
);

/* 5. AI Calling Systems: Photorealistic 3D Headphones & Voice Mic */
export const PhoneCall3DIllustration: React.FC = () => (
  <svg
    viewBox="0 0 340 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="ssc-3d-illustration"
  >
    <defs>
      <linearGradient id="headsetGloss" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#FFE3D6" />
        <stop offset="100%" stopColor="#C8583B" />
      </linearGradient>
      <filter id="headsetShadow">
        <feDropShadow dx="12" dy="20" stdDeviation="15" floodColor="#40000A" floodOpacity="0.4" />
      </filter>
    </defs>

    <g filter="url(#headsetShadow)" transform="translate(60, 20)">
      <path d="M 40 140 A 75 75 0 0 1 180 140" fill="none" stroke="url(#headsetGloss)" strokeWidth="22" strokeLinecap="round" />
      <rect x="24" y="120" width="34" height="65" rx="16" fill="url(#headsetGloss)" stroke="#FFFFFF" strokeWidth="2" />
      <rect x="162" y="120" width="34" height="65" rx="16" fill="url(#headsetGloss)" stroke="#FFFFFF" strokeWidth="2" />
    </g>
  </svg>
);

/* 6. Graphic Designing: Photorealistic 3D Stylus & Palette Spheres */
export const Pen3DIllustration: React.FC = () => (
  <svg
    viewBox="0 0 340 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="ssc-3d-illustration"
  >
    <defs>
      <linearGradient id="penGloss" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#FFE0D4" />
        <stop offset="100%" stopColor="#B8482B" />
      </linearGradient>
      <filter id="penShadow">
        <feDropShadow dx="12" dy="20" stdDeviation="15" floodColor="#40000A" floodOpacity="0.4" />
      </filter>
    </defs>

    <g filter="url(#penShadow)" transform="translate(60, 20) rotate(-25, 110, 110)">
      <rect x="95" y="10" width="28" height="210" rx="14" fill="url(#penGloss)" stroke="#FFFFFF" strokeWidth="2" />
      <polygon points="109,240 95,210 123,210" fill="#FFFFFF" />
    </g>
  </svg>
);

/* 7. Video Editing: Photorealistic 3D Vintage Cinema Camera */
export const Film3DIllustration: React.FC = () => (
  <svg
    viewBox="0 0 340 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="ssc-3d-illustration"
  >
    <defs>
      <linearGradient id="camBodyDark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="40%" stopColor="#E0E0E0" />
        <stop offset="80%" stopColor="#333333" />
        <stop offset="100%" stopColor="#1A1A1A" />
      </linearGradient>
      <linearGradient id="camReelSilver" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#D4C5BC" />
        <stop offset="100%" stopColor="#66564C" />
      </linearGradient>
      <filter id="camShadow">
        <feDropShadow dx="14" dy="22" stdDeviation="16" floodColor="#000000" floodOpacity="0.5" />
      </filter>
    </defs>

    <g filter="url(#camShadow)" transform="translate(45, 15)">
      <circle cx="85" cy="70" r="48" fill="url(#camReelSilver)" stroke="#FFFFFF" strokeWidth="3" />
      <circle cx="85" cy="70" r="14" fill="#1A1A1A" />
      <circle cx="65" cy="60" r="10" fill="#1A1A1A" />
      <circle cx="105" cy="60" r="10" fill="#1A1A1A" />
      <circle cx="85" cy="95" r="10" fill="#1A1A1A" />
      <circle cx="165" cy="60" r="40" fill="url(#camReelSilver)" stroke="#FFFFFF" strokeWidth="3" />
      <circle cx="165" cy="60" r="12" fill="#1A1A1A" />
      <rect x="45" y="110" width="135" height="110" rx="20" fill="url(#camBodyDark)" stroke="#FFFFFF" strokeWidth="2" />
      <rect x="180" y="130" width="55" height="70" rx="10" fill="url(#camReelSilver)" stroke="#FFFFFF" strokeWidth="2" />
    </g>
  </svg>
);

/* 8. Multimedia Production: Photorealistic 3D Camera Lens */
export const Camera3DIllustration: React.FC = () => (
  <svg
    viewBox="0 0 340 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="ssc-3d-illustration"
  >
    <defs>
      <radialGradient id="lensGlass" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="40%" stopColor="#EBE0FF" />
        <stop offset="75%" stopColor="#4A2B80" />
        <stop offset="100%" stopColor="#1A0D33" />
      </radialGradient>
      <linearGradient id="lensRim" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#D4C5BC" />
        <stop offset="100%" stopColor="#42352B" />
      </linearGradient>
      <filter id="lensShadow">
        <feDropShadow dx="14" dy="22" stdDeviation="16" floodColor="#000000" floodOpacity="0.45" />
      </filter>
    </defs>

    <g filter="url(#lensShadow)" transform="translate(60, 20)">
      <circle cx="110" cy="120" r="90" fill="url(#lensRim)" stroke="#FFFFFF" strokeWidth="3" />
      <circle cx="110" cy="120" r="72" fill="url(#lensGlass)" stroke="#FFFFFF" strokeWidth="2" />
      <ellipse cx="85" cy="95" rx="35" ry="18" fill="#FFFFFF" opacity="0.6" transform="rotate(-30, 85, 95)" />
    </g>
  </svg>
);

/* 9. Digital Marketing: Photorealistic 3D Darts & Bullseye Target */
export const Target3DIllustration: React.FC = () => (
  <svg
    viewBox="0 0 340 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="ssc-3d-illustration"
  >
    <defs>
      <linearGradient id="dartRed" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="40%" stopColor="#FF0033" />
        <stop offset="100%" stopColor="#800016" />
      </linearGradient>
      <linearGradient id="targetWhite" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E0E0E0" />
      </linearGradient>
      <filter id="targetShadow">
        <feDropShadow dx="14" dy="22" stdDeviation="16" floodColor="#40000A" floodOpacity="0.45" />
      </filter>
    </defs>

    <g filter="url(#targetShadow)" transform="translate(50, 15)">
      <ellipse cx="140" cy="180" rx="100" ry="55" fill="url(#targetWhite)" stroke="#FFFFFF" strokeWidth="4" />
      <ellipse cx="140" cy="180" rx="70" ry="38" fill="#1A1A1A" />
      <ellipse cx="140" cy="180" rx="42" ry="23" fill="url(#targetWhite)" />
      <ellipse cx="140" cy="180" rx="18" ry="10" fill="url(#dartRed)" />
      <g transform="translate(100, 40) rotate(35, 40, 70)">
        <path d="M 30 10 L 50 50 L 30 45 L 10 50 Z" fill="url(#dartRed)" />
        <rect x="27" y="45" width="6" height="85" fill="#FFFFFF" />
        <polygon points="30,140 25,130 35,130" fill="#D4C5BC" />
      </g>
      <g transform="translate(145, 10) rotate(20, 40, 70)">
        <path d="M 30 10 L 50 50 L 30 45 L 10 50 Z" fill="url(#dartRed)" />
        <rect x="27" y="45" width="6" height="95" fill="#FFFFFF" />
      </g>
    </g>
  </svg>
);

/* 10. Influencer Marketing: Photorealistic 3D Star Trophy */
export const Star3DIllustration: React.FC = () => (
  <svg
    viewBox="0 0 340 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="ssc-3d-illustration"
  >
    <defs>
      <linearGradient id="starSilver" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#D4C5BC" />
        <stop offset="100%" stopColor="#8C7B70" />
      </linearGradient>
      <filter id="starShadow">
        <feDropShadow dx="14" dy="22" stdDeviation="16" floodColor="#40000A" floodOpacity="0.4" />
      </filter>
    </defs>

    <g filter="url(#starShadow)" transform="translate(60, 15) rotate(10, 110, 110)">
      <polygon
        points="110,15 138,78 206,85 155,130 170,196 110,160 50,196 65,130 14,85 82,78"
        fill="url(#starSilver)"
        stroke="#FFFFFF"
        strokeWidth="3"
      />
    </g>
  </svg>
);

/* 11. Sales & Growth Systems: Photorealistic 3D Rocket Launch */
export const Rocket3DIllustration: React.FC = () => (
  <svg
    viewBox="0 0 340 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="ssc-3d-illustration"
  >
    <defs>
      <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#FFEFE6" />
        <stop offset="100%" stopColor="#D9583B" />
      </linearGradient>
      <linearGradient id="rocketFin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#D4C5BC" />
        <stop offset="100%" stopColor="#7A685D" />
      </linearGradient>
      <filter id="rocketShadow">
        <feDropShadow dx="14" dy="22" stdDeviation="16" floodColor="#40000A" floodOpacity="0.45" />
      </filter>
    </defs>

    <g filter="url(#rocketShadow)" transform="translate(60, 15) rotate(-35, 110, 120)">
      <path d="M 65 150 L 30 190 L 75 180 Z" fill="url(#rocketFin)" />
      <path d="M 155 150 L 190 190 L 145 180 Z" fill="url(#rocketFin)" />
      <path d="M 110 20 C 140 70 145 140 140 185 L 80 185 C 75 140 80 70 110 20 Z" fill="url(#rocketBody)" stroke="#FFFFFF" strokeWidth="2" />
      <circle cx="110" cy="95" r="22" fill="url(#rocketFin)" stroke="#FFFFFF" strokeWidth="3" />
      <circle cx="110" cy="95" r="14" fill="#FFFFFF" opacity="0.9" />
    </g>
  </svg>
);

/* 12. Content Marketing: Photorealistic 3D Magnifying Glass */
export const Search3DIllustration: React.FC = () => (
  <svg
    viewBox="0 0 340 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="ssc-3d-illustration"
  >
    <defs>
      <linearGradient id="searchRim" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="35%" stopColor="#666666" />
        <stop offset="70%" stopColor="#222222" />
        <stop offset="100%" stopColor="#050505" />
      </linearGradient>
      <radialGradient id="searchLens" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="40%" stopColor="#F5F5F5" stopOpacity="0.8" />
        <stop offset="85%" stopColor="#D0D0D0" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#A0A0A0" stopOpacity="0.3" />
      </radialGradient>
      <filter id="searchShadow">
        <feDropShadow dx="14" dy="22" stdDeviation="16" floodColor="#000000" floodOpacity="0.5" />
      </filter>
    </defs>

    <g filter="url(#searchShadow)" transform="translate(60, 15) rotate(22, 110, 110)">
      <rect x="98" y="160" width="28" height="115" rx="14" fill="url(#searchRim)" stroke="#FFFFFF" strokeWidth="1.5" />
      <circle cx="112" cy="100" r="78" fill="url(#searchRim)" stroke="#FFFFFF" strokeWidth="3" />
      <circle cx="112" cy="100" r="60" fill="url(#searchLens)" />
      <ellipse cx="90" cy="78" rx="28" ry="14" fill="#FFFFFF" opacity="0.75" transform="rotate(-30, 90, 78)" />
    </g>
  </svg>
);
