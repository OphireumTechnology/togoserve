import React, { useState } from 'react';

export interface LogoProps {
  variant?: 'default' | 'circular' | 'header' | 'footer' | 'dashboard' | 'mobile' | 'stacked' | 'horizontal' | 'app-icon' | 'original' | 'dark' | 'light' | 'symbol';
  theme?: 'light' | 'dark';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showWordmark?: boolean;
  showSlogan?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Official Authoritative TOGOSERVE Logo Component
 * Source of truth for corporate branding across all portals, dashboards, and documents.
 * Directly renders the official circular gold corporate emblem and typography.
 */
export const Logo: React.FC<LogoProps> = ({
  variant = 'default',
  theme,
  size = 'md',
  showWordmark = true,
  className = '',
  onClick,
}) => {
  const [imgError, setImgError] = useState(false);

  const isDark = theme === 'dark' || variant === 'dark';

  // Pixel heights for the circular emblem
  const emblemSizes = {
    xs: 28,
    sm: 36,
    md: 44,
    lg: 56,
    xl: 72,
    '2xl': 96,
  };

  const dim = emblemSizes[size] || 44;

  // Asset routing according to directive specification
  let emblemSrc = '/branding/togoserve/logo-transparent.png';
  if (variant === 'header') {
    emblemSrc = '/branding/togoserve/logo-header.png';
  } else if (variant === 'dashboard') {
    emblemSrc = '/branding/togoserve/logo-dashboard.png';
  } else if (variant === 'footer') {
    emblemSrc = '/branding/togoserve/logo-footer.png';
  } else if (variant === 'mobile') {
    emblemSrc = '/branding/togoserve/logo-mobile.png';
  } else if (variant === 'original') {
    emblemSrc = '/branding/togoserve/logo-original.png';
  } else if (isDark) {
    emblemSrc = '/branding/togoserve/logo-dark-background.png';
  }

  // 1. STANDALONE CIRCULAR EMBLEM ONLY
  if (variant === 'circular' || variant === 'original' || variant === 'symbol') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center shrink-0 select-none ${
          onClick ? 'cursor-pointer hover:opacity-95' : ''
        } ${className}`}
        role="img"
        aria-label="TOGOSERVE Official Circular Gold Logo"
      >
        <img
          src={emblemSrc}
          alt="TOGOSERVE Circular Corporate Emblem"
          style={{ width: `${dim}px`, height: `${dim}px` }}
          className="shrink-0 object-contain drop-shadow-sm transition-transform duration-200"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // 2. APP ICON (Squircle)
  if (variant === 'app-icon') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center rounded-2xl overflow-hidden shrink-0 shadow-md ${
          onClick ? 'cursor-pointer hover:opacity-95' : ''
        } ${className}`}
        style={{ width: `${dim}px`, height: `${dim}px` }}
        role="img"
        aria-label="TOGOSERVE Application Icon"
      >
        <img
          src="/icons/app-icon-512.png"
          alt="TOGOSERVE App Icon"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // 3. STACKED VARIANT (Center-aligned emblem with wordmark below)
  if (variant === 'stacked') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex flex-col items-center text-center shrink-0 select-none ${
          onClick ? 'cursor-pointer hover:opacity-95' : ''
        } ${className}`}
        role="img"
        aria-label="TOGOSERVE Stacked Corporate Logo"
      >
        <img
          src={emblemSrc}
          alt="TOGOSERVE Emblem"
          style={{ width: `${dim * 1.3}px`, height: `${dim * 1.3}px` }}
          className="shrink-0 object-contain drop-shadow-sm"
          onError={() => setImgError(true)}
        />
        <div className="mt-2 flex items-baseline tracking-tight font-black leading-none text-xl sm:text-2xl font-['Inter']">
          <span className={isDark ? 'text-white' : 'text-[#2E2E2E]'}>TOGO</span>
          <span className="text-[#F4B400]">SERVE</span>
        </div>
        <p className={`mt-1 font-bold tracking-widest text-[9px] uppercase ${isDark ? 'text-[#D9C39A]' : 'text-[#2E2E2E]'}`}>
          COMMERCE <span className="text-[#F4B400]">•</span> LOGISTICS <span className="text-[#F4B400]">•</span> AI
        </p>
      </div>
    );
  }

  // 4. HEADER, DASHBOARD, FOOTER, AND DEFAULT HORIZONTAL (Emblem + Wordmark)
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 shrink-0 select-none ${
        onClick ? 'cursor-pointer hover:opacity-95' : ''
      } ${className}`}
      role="img"
      aria-label="TOGOSERVE Official Corporate Logo"
    >
      <img
        src={emblemSrc}
        alt="TOGOSERVE Circular Gold Emblem"
        style={{ width: `${dim}px`, height: `${dim}px` }}
        className="shrink-0 object-contain drop-shadow-sm"
        onError={() => setImgError(true)}
      />

      {showWordmark && (
        <div className="flex flex-col justify-center text-left leading-none">
          <div className="flex items-baseline tracking-tight font-black leading-none text-lg sm:text-xl font-['Inter']">
            <span className={isDark ? 'text-white' : 'text-[#2E2E2E]'}>TOGO</span>
            <span className="text-[#F4B400]">SERVE</span>
          </div>
          <span className={`mt-1 font-bold tracking-widest text-[8px] sm:text-[9px] uppercase ${isDark ? 'text-[#D9C39A]' : 'text-[#2E2E2E]'}`}>
            COMMERCE <span className="text-[#F4B400]">•</span> LOGISTICS <span className="text-[#F4B400]">•</span> AI
          </span>
        </div>
      )}
    </div>
  );
};

export const BrandMark: React.FC<{
  size?: number;
  className?: string;
  isDark?: boolean;
}> = ({ size = 36, className = '' }) => {
  return (
    <Logo variant="circular" size="sm" className={className} />
  );
};

export const BrandLogo = Logo;
export type BrandLogoProps = LogoProps;
