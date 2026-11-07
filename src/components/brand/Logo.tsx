import React, { useState } from 'react';

export interface LogoProps {
  variant?: 'default' | 'light' | 'dark' | 'symbol' | 'horizontal' | 'stacked' | 'app-icon' | 'circular' | 'header' | 'footer';
  theme?: 'light' | 'dark';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showSlogan?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Official TOGOSERVE Brand Symbol Mark
 * Strict vector geometry with Stylized Metallic Gold T (#F4B400 - #FFD54F)
 * and Charcoal Accent Wing (#2E2E2E).
 */
export const BrandMark: React.FC<{
  size?: number;
  className?: string;
  isDark?: boolean;
}> = ({ size = 36, className = '', isDark = false }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`togoGoldGrad-${isDark ? 'dark' : 'light'}`} x1="15" y1="15" x2="95" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFD54F" />
          <stop offset="55%" stopColor="#F4B400" />
          <stop offset="100%" stopColor="#D9A514" />
        </linearGradient>
        <linearGradient id={`togoWingGrad-${isDark ? 'dark' : 'light'}`} x1="60" y1="30" x2="95" y2="75" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isDark ? "#FAFAFA" : "#383838"} />
          <stop offset="100%" stopColor={isDark ? "#D9C39A" : "#222222"} />
        </linearGradient>
      </defs>

      {/* Stylized Gold T */}
      <path
        d="M18 22C18 17.58 21.58 14 26 14H94C98.42 14 102 17.58 102 22V28C102 32.42 98.42 36 94 36H70V96C70 101.52 65.52 106 60 106C54.48 106 50 101.52 50 96V36H26C21.58 36 18 32.42 18 28V22Z"
        fill={`url(#togoGoldGrad-${isDark ? 'dark' : 'light'})`}
      />

      {/* Dark Charcoal Geometric Wing Accent */}
      <path
        d="M72 40C72 37.79 73.79 36 76 36H94C96.21 36 98 37.79 98 40V70C98 74.42 94.42 78 90 78H76C73.79 78 72 76.21 72 74V40Z"
        fill={`url(#togoWingGrad-${isDark ? 'dark' : 'light'})`}
      />
    </svg>
  );
};

/**
 * Official TOGOSERVE Logo Component
 * Single centralized corporate logo implementation across all portals.
 */
export const Logo: React.FC<LogoProps> = ({
  variant = 'default',
  theme,
  size = 'md',
  showSlogan = false,
  className = '',
  onClick,
}) => {
  const [imgError, setImgError] = useState(false);

  const isDark = theme === 'dark' || variant === 'dark';

  // Height mappings in px to preserve exact aspect ratio
  const heightPixels = {
    xs: 26,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 60,
  };

  const symbolPixels = {
    xs: 24,
    sm: 30,
    md: 38,
    lg: 46,
    xl: 58,
  };

  const h = heightPixels[size] || 40;
  const symH = symbolPixels[size] || 38;

  // 1. CIRCULAR EMBLEM
  if (variant === 'circular') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center shrink-0 ${onClick ? 'cursor-pointer hover:opacity-95' : ''} ${className}`}
        role="img"
        aria-label="TOGOSERVE Circular Corporate Emblem"
      >
        <img
          src="/branding/togoserve/logo-circular.png"
          alt="TOGOSERVE Emblem"
          style={{ width: `${symH * 1.5}px`, height: `${symH * 1.5}px` }}
          className="shrink-0 object-contain drop-shadow-md"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // 2. APP ICON VARIANT
  if (variant === 'app-icon') {
    const iconDim = Math.round(symH * 1.3);
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center rounded-2xl overflow-hidden shrink-0 shadow-md ${
          onClick ? 'cursor-pointer hover:opacity-95' : ''
        } ${className}`}
        style={{ width: iconDim, height: iconDim }}
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

  // 3. SYMBOL ONLY
  if (variant === 'symbol') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center shrink-0 ${onClick ? 'cursor-pointer hover:opacity-90' : ''} ${className}`}
        role="img"
        aria-label="TOGOSERVE Symbol"
      >
        <BrandMark size={symH} isDark={isDark} />
      </div>
    );
  }

  // 4. STACKED VARIANT
  if (variant === 'stacked') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex flex-col items-center text-center shrink-0 select-none ${
          onClick ? 'cursor-pointer hover:opacity-95' : ''
        } ${className}`}
        role="img"
        aria-label="TOGOSERVE Stacked Logo"
      >
        <BrandMark size={Math.round(symH * 1.15)} isDark={isDark} />
        <div className="mt-1 flex items-baseline tracking-tight font-black leading-none text-xl sm:text-2xl font-['Inter']">
          <span className={isDark ? 'text-white' : 'text-[#2E2E2E]'}>TOGO</span>
          <span className="text-[#F4B400]">SERVE</span>
        </div>
        <p className={`mt-1 font-bold tracking-widest text-[9px] uppercase ${isDark ? 'text-[#D9C39A]' : 'text-[#2E2E2E]'}`}>
          COMMERCE <span className="text-[#F4B400]">•</span> LOGISTICS <span className="text-[#F4B400]">•</span> AI
        </p>
      </div>
    );
  }

  // 5. HORIZONTAL / DEFAULT / HEADER / FOOTER LOGO
  const assetSrc = isDark
    ? '/branding/togoserve/logo-dark.png'
    : (variant === 'header' ? '/branding/togoserve/logo-header.png' : '/branding/togoserve/logo-horizontal.png');

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center shrink-0 select-none ${
        onClick ? 'cursor-pointer hover:opacity-95' : ''
      } ${className}`}
      role="img"
      aria-label="TOGOSERVE Official Logo"
    >
      {!imgError ? (
        <img
          src={assetSrc}
          alt="TOGOSERVE – Commerce • Logistics • AI"
          style={{ height: `${h}px`, width: 'auto', maxHeight: `${h}px` }}
          className="object-contain shrink-0"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="inline-flex items-center gap-2.5">
          <BrandMark size={symH} isDark={isDark} />
          <div className="flex flex-col justify-center">
            <div className="flex items-baseline tracking-tight font-black leading-none text-xl sm:text-2xl font-['Inter']">
              <span className={isDark ? 'text-white' : 'text-[#2E2E2E]'}>TOGO</span>
              <span className="text-[#F4B400]">SERVE</span>
            </div>
            <span className={`mt-0.5 font-bold tracking-widest text-[9px] uppercase ${isDark ? 'text-[#D9C39A]' : 'text-[#2E2E2E]'}`}>
              COMMERCE <span className="text-[#F4B400]">•</span> LOGISTICS <span className="text-[#F4B400]">•</span> AI
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export const BrandLogo = Logo;
export type BrandLogoProps = LogoProps;
