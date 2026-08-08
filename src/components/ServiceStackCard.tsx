import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import './ServiceStackCard.css';

interface ServiceStackCardProps {
  title: string;
  subtitle?: string;
  points?: string[];
  illustration?: React.ReactNode;
  variant?: number;
  onLearnMore?: () => void;
}

/**
 * ServiceStackCard — Enlarged card with 100% visible context, hyper-vibrant Cherry Red styling,
 * 3D vector illustration, tag pills, and white circle action button.
 */
const ServiceStackCard: React.FC<ServiceStackCardProps> = ({
  title,
  subtitle,
  points,
  illustration,
  variant = 1,
  onLearnMore,
}) => {
  return (
    <div className={`ssc-card ssc-variant-${((variant - 1) % 4) + 1}`}>
      {/* Specular glass glare reflection */}
      <div className="ssc-glass-highlight" aria-hidden="true" />
      <div className="ssc-ambient-glow" aria-hidden="true" />

      {/* Content Side */}
      <div className="ssc-content">
        <div className="ssc-text-group">
          <h3 className="ssc-title">{title}</h3>
          {subtitle && <p className="ssc-subtitle">{subtitle}</p>}
          {points && points.length > 0 && (
            <div className="ssc-tags">
              {points.map((point) => (
                <span key={point} className="ssc-tag">
                  {point}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Button: White circle arrow + "LEARN MORE" text */}
        <div className="ssc-action-row">
          <button type="button" className="ssc-learn-more-btn" onClick={onLearnMore}>
            <span className="ssc-arrow-circle">
              <ArrowUpRight size={20} strokeWidth={2.5} />
            </span>
            <span className="ssc-btn-text">LEARN MORE</span>
          </button>
        </div>
      </div>

      {/* Right Side: 3D Vector Illustration / Graphic */}
      <div className="ssc-graphic-side" aria-hidden="true">
        {illustration}
      </div>
    </div>
  );
};

export default ServiceStackCard;
