import React from 'react';

/**
 * Photorealistic 3D Image & Vector Illustrations.
 * Card 1: User Cloudinary 3D Website Development Graphic.
 * Card 2: User Reference Isolated Smartphone in Hands Image.
 */

/* 1. Website Development: User Cloudinary 3D Graphic */
export const Cursor3DIllustration: React.FC = () => (
  <div className="ssc-3d-image-wrap">
    <img
      src="/images/services-3d/website-development.png"
      alt="Website Development 3D Graphic"
      className="ssc-3d-image ssc-3d-web-image"
      loading="lazy"
    />
  </div>
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

/* 3. AI Chatbots: User Cloudinary 3D Graphic */
export const Bot3DIllustration: React.FC = () => (
  <div className="ssc-3d-image-wrap">
    <img
      src="/images/services-3d/ai-chatbots.png"
      alt="AI Chatbots 3D Graphic"
      className="ssc-3d-image ssc-3d-bot-image"
      loading="lazy"
    />
  </div>
);

/* 4. Workflow Automations: User Cloudinary 3D Graphic */
export const Workflow3DIllustration: React.FC = () => (
  <div className="ssc-3d-image-wrap">
    <img
      src="/images/services-3d/workflow-automations.png"
      alt="Workflow Automations 3D Graphic"
      className="ssc-3d-image ssc-3d-workflow-image"
      loading="lazy"
    />
  </div>
);

/* 5. AI Calling Systems: User Cloudinary 3D Graphic */
export const PhoneCall3DIllustration: React.FC = () => (
  <div className="ssc-3d-image-wrap">
    <img
      src="/images/services-3d/ai-calling-systems.png"
      alt="AI Calling Systems 3D Graphic"
      className="ssc-3d-image ssc-3d-call-image"
      loading="lazy"
    />
  </div>
);

/* 6. Graphic Designing: User Cloudinary 3D Graphic */
export const Pen3DIllustration: React.FC = () => (
  <div className="ssc-3d-image-wrap">
    <img
      src="/images/services-3d/graphic-designing.png"
      alt="Graphic Designing 3D Graphic"
      className="ssc-3d-image ssc-3d-pen-image"
      loading="lazy"
    />
  </div>
);

/* 7. Video Editing: User Cloudinary 3D Graphic */
export const Film3DIllustration: React.FC = () => (
  <div className="ssc-3d-image-wrap">
    <img
      src="/images/services-3d/video-editing.png"
      alt="Video Editing 3D Graphic"
      className="ssc-3d-image ssc-3d-film-image"
      loading="lazy"
    />
  </div>
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

/* 9. Digital Marketing: User Cloudinary 3D Graphic */
export const Target3DIllustration: React.FC = () => (
  <div className="ssc-3d-image-wrap">
    <img
      src="/images/services-3d/digital-marketing.png"
      alt="Digital Marketing 3D Graphic"
      className="ssc-3d-image ssc-3d-target-image"
      loading="lazy"
    />
  </div>
);

/* 10. Influencer Marketing: User Cloudinary 3D Graphic */
export const Star3DIllustration: React.FC = () => (
  <div className="ssc-3d-image-wrap">
    <img
      src="/images/services-3d/influencer-marketing.png"
      alt="Influencer Marketing 3D Graphic"
      className="ssc-3d-image ssc-3d-star-image"
      loading="lazy"
    />
  </div>
);

/* 11. Sales & Growth Systems: User Cloudinary 3D Graphic */
export const Rocket3DIllustration: React.FC = () => (
  <div className="ssc-3d-image-wrap">
    <img
      src="/images/services-3d/sales-growth-systems.png"
      alt="Sales & Growth Systems 3D Graphic"
      className="ssc-3d-image ssc-3d-rocket-image"
      loading="lazy"
    />
  </div>
);

/* 12. Content Marketing: User Cloudinary 3D Graphic */
export const Search3DIllustration: React.FC = () => (
  <div className="ssc-3d-image-wrap">
    <img
      src="/images/services-3d/content-marketing.png"
      alt="Content Marketing 3D Graphic"
      className="ssc-3d-image ssc-3d-search-image"
      loading="lazy"
    />
  </div>
);
