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
      width={895}
      height={830}
      loading="lazy"
      decoding="async"
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
      width={1023}
      height={1478}
      loading="lazy"
      decoding="async"
    />
  </div>
);

/* 3. AI Automation: reused chatbot 3D graphic */
export const Bot3DIllustration: React.FC = () => (
  <div className="ssc-3d-image-wrap">
    <img
      src="/images/services-3d/ai-chatbots.png"
      alt="AI Automation 3D Graphic"
      className="ssc-3d-image ssc-3d-bot-image"
      width={1511}
      height={1024}
      loading="lazy"
      decoding="async"
    />
  </div>
);

/* Reused workflow 3D graphic */
export const Workflow3DIllustration: React.FC = () => (
  <div className="ssc-3d-image-wrap">
    <img
      src="/images/services-3d/workflow-automations.png"
      alt=""
      className="ssc-3d-image ssc-3d-workflow-image"
      width={1500}
      height={1024}
      loading="lazy"
      decoding="async"
    />
  </div>
);

/* Reused calling 3D graphic */
export const PhoneCall3DIllustration: React.FC = () => (
  <div className="ssc-3d-image-wrap">
    <img
      src="/images/services-3d/ai-calling-systems.png"
      alt=""
      className="ssc-3d-image ssc-3d-call-image"
      width={1024}
      height={1530}
      loading="lazy"
      decoding="async"
    />
  </div>
);

/* 4. Graphic Design */
export const Pen3DIllustration: React.FC = () => (
  <div className="ssc-3d-image-wrap">
    <img
      src="/images/services-3d/graphic-designing.png"
      alt="Graphic Design 3D Graphic"
      className="ssc-3d-image ssc-3d-pen-image"
      width={1024}
      height={1478}
      loading="lazy"
      decoding="async"
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
      width={879}
      height={759}
      loading="lazy"
      decoding="async"
    />
  </div>
);

/* Unused camera lens graphic */
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

/* Google Ads: Cloudinary local-services ad mockup */
export const GoogleAds3DIllustration: React.FC = () => (
  <div className="ssc-3d-image-wrap ssc-3d-ads-wrap">
    <img
      src="https://res.cloudinary.com/dwatnpdcy/image/upload/e_trim,c_fit,w_720,h_720,q_auto,f_auto/v1787939019/ChatGPT_Image_Aug_28_2026_11_13_28_PM_cited9.png"
      alt="Google Ads 3D Graphic"
      className="ssc-3d-image ssc-3d-ads-image"
      width={720}
      height={720}
      loading="lazy"
      decoding="async"
    />
  </div>
);

/* Meta Ads: reused advertising 3D graphic */
export const Target3DIllustration: React.FC = () => (
  <div className="ssc-3d-image-wrap">
    <img
      src="/images/services-3d/digital-marketing.png"
      alt=""
      className="ssc-3d-image ssc-3d-target-image"
      width={1023}
      height={1501}
      loading="lazy"
      decoding="async"
    />
  </div>
);

/* Social Media Marketing: reused creator 3D graphic */
export const Star3DIllustration: React.FC = () => (
  <div className="ssc-3d-image-wrap">
    <img
      src="/images/services-3d/influencer-marketing.png"
      alt=""
      className="ssc-3d-image ssc-3d-star-image"
      width={1024}
      height={1501}
      loading="lazy"
      decoding="async"
    />
  </div>
);

/* Lead Generation: reused growth 3D graphic */
export const Rocket3DIllustration: React.FC = () => (
  <div className="ssc-3d-image-wrap">
    <img
      src="/images/services-3d/sales-growth-systems.png"
      alt=""
      className="ssc-3d-image ssc-3d-rocket-image"
      width={1024}
      height={1467}
      loading="lazy"
      decoding="async"
    />
  </div>
);

/* SEO: Cloudinary magnifying-glass infographic */
export const Search3DIllustration: React.FC = () => (
  <div className="ssc-3d-image-wrap ssc-3d-search-wrap">
    <img
      src="https://res.cloudinary.com/dwatnpdcy/image/upload/c_fit,w_720,h_720,q_auto,f_auto/v1787938907/ChatGPT_Image_Aug_28_2026_11_11_04_PM_sd1vrd.png"
      alt=""
      className="ssc-3d-image ssc-3d-search-image"
      width={720}
      height={720}
      loading="lazy"
      decoding="async"
    />
  </div>
);
