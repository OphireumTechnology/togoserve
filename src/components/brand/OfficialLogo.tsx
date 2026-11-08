import React from 'react';

export interface OfficialLogoProps {
  className?: string;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
}

/**
 * Official Authoritative TOGOSERVE Circular Logo Component
 * Renders the approved circular gold-and-charcoal emblem with original typography,
 * skyline, and highway curve. Adheres strictly to official branding guidelines.
 */
export const OfficialLogo: React.FC<OfficialLogoProps> = ({
  className = '',
  onClick,
  size = 'md',
  theme,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  // Canonical approved circular logo asset
  const logoSrc = '/branding/togoserve-official-circular.png';

  return (
    <a
      href="/"
      onClick={handleClick}
      className={`inline-flex items-center shrink-0 select-none group focus:outline-none focus:ring-2 focus:ring-[#F4B400] rounded-2xl transition-transform active:scale-[0.98] ${className}`}
      aria-label="TOGOSERVE Official Circular Logo Home"
    >
      <img
        src={logoSrc}
        alt="TOGOSERVE Official Circular Logo"
        className="togoserve-official-logo drop-shadow-sm group-hover:opacity-95 transition-opacity"
        decoding="async"
      />
    </a>
  );
};
