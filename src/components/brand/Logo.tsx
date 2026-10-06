import React, { useState } from 'react';

export interface LogoProps {
  variant?: 'default' | 'light' | 'symbol' | 'horizontal' | 'stacked' | 'app-icon';
  theme?: 'light' | 'dark';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showSlogan?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Official TOGOSERVE Brand Symbol Mark
 * Originates directly from the official TOGOSERVE Brand Identity Guidelines.
 * Strict vector geometry with Navy Stem (#071A2F), Radiant Gold Fold (#D9A514 - #FFC928),
 * and dynamic 3-streak motion arrows.
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
        <linearGradient id={`togoStemGrad-${isDark ? 'dark' : 'light'}`} x1="20" y1="20" x2="80" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isDark ? "#FFFFFF" : "#071A2F"} />
          <stop offset="50%" stopColor={isDark ? "#E2E8F0" : "#0F2A4A"} />
          <stop offset="100%" stopColor={isDark ? "#94A3B8" : "#071A2F"} />
        </linearGradient>

        <linearGradient id="togoGoldFoldGrad" x1="40" y1="30" x2="110" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFDE59" />
          <stop offset="35%" stopColor="#FFC928" />
          <stop offset="85%" stopColor="#D9A514" />
          <stop offset="100%" stopColor="#B37E00" />
        </linearGradient>
      </defs>

      {/* Speed / Motion Streaks on Left */}
      <path d="M6 46H26L22 52H2L6 46Z" fill="#FFC928" />
      <path d="M12 60H34L30 66H8L12 60Z" fill="#FFC928" />
      <path d="M18 74H38L34 80H14L18 74Z" fill="#D9A514" />

      {/* Main TS Stem and Top Bar (T) */}
      <path
        d="M32 24H86L80 36H56L36 94H20L40 36H26L32 24Z"
        fill={`url(#togoStemGrad-${isDark ? 'dark' : 'light'})`}
      />

      {/* Dynamic S-Fold with Upward-Right Growth Arrow */}
      <path
        d="M52 46H74L63 76C61 82 66 88 73 88H88L82 72L108 58L104 90L92 84C89 96 76 102 65 100C49 98 44 84 48 72L52 60C44 64 38 72 38 78H26C26 66 36 52 52 46Z"
        fill="url(#togoGoldFoldGrad)"
      />

      {/* Arrow Crest */}
      <path d="M80 34L108 30L98 58L88 48L80 34Z" fill="url(#togoGoldFoldGrad)" />
    </svg>
  );
};

/**
 * Single Reusable Official TOGOSERVE Logo Component
 * 
 * Supports:
 * - <Logo variant="default" /> : Official horizontal logo on Primary Navy (#071A2F)
 * - <Logo variant="light" />   : Official horizontal logo on White / Light background
 * - <Logo variant="symbol" />  : Official TS Dynamic Arrow monogram
 * 
 * Centralized Single Source of Truth for brand representation across all screens.
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

  // Normalize effective theme:
  // - variant="default" is intended for deep navy background (#071A2F), using white text & gold
  // - variant="light" is intended for white/light background, using navy text & gold
  const isDark =
    theme === 'dark' ||
    variant === 'default' ||
    (variant !== 'light' && theme !== 'light');

  // Height mappings in px to preserve exact aspect ratio (360x80 = 4.5:1)
  const heightPixels = {
    xs: 26,
    sm: 32,
    md: 38,
    lg: 46,
    xl: 56,
  };

  const symbolPixels = {
    xs: 24,
    sm: 30,
    md: 36,
    lg: 44,
    xl: 56,
  };

  const h = heightPixels[size] || 38;
  const symH = symbolPixels[size] || 36;

  // Asset selection
  let assetPath = '/brand/togoserve-logo-white.svg';
  if (variant === 'light' || (!isDark && variant === 'horizontal')) {
    assetPath = '/brand/togoserve-logo.svg';
  } else if (variant === 'symbol') {
    assetPath = isDark ? '/brand/togoserve-symbol-white.svg' : '/brand/togoserve-symbol.svg';
  }

  // 1. SYMBOL VARIANT
  if (variant === 'symbol') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center shrink-0 ${onClick ? 'cursor-pointer hover:opacity-90' : ''} ${className}`}
        role="img"
        aria-label="TOGOSERVE Official Symbol"
      >
        {!imgError ? (
          <img
            src={assetPath}
            alt="TOGOSERVE Symbol"
            width={symH}
            height={symH}
            className="shrink-0 object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <BrandMark size={symH} isDark={isDark} />
        )}
      </div>
    );
  }

  // 2. STACKED VARIANT
  if (variant === 'stacked') {
    const textSizes = {
      xs: 'text-base',
      sm: 'text-lg',
      md: 'text-xl',
      lg: 'text-2xl',
      xl: 'text-3xl',
    };
    return (
      <div
        onClick={onClick}
        className={`inline-flex flex-col items-center text-center shrink-0 select-none ${
          onClick ? 'cursor-pointer hover:opacity-90' : ''
        } ${className}`}
        role="img"
        aria-label="TOGOSERVE Official Stacked Logo"
      >
        <BrandMark size={Math.round(symH * 1.2)} isDark={isDark} />
        <div className={`mt-1.5 flex items-baseline tracking-tight font-extrabold leading-none ${textSizes[size]}`}>
          <span className={isDark ? 'text-white' : 'text-[#071A2F]'}>TOGO</span>
          <span className="text-[#D9A514]">SERVE</span>
        </div>
        {showSlogan && (
          <p className={`mt-1 font-medium tracking-wide ${isDark ? 'text-slate-300' : 'text-[#64748B]'} text-[11px]`}>
            Powering Merchants. Delivering Growth.
          </p>
        )}
      </div>
    );
  }

  // 3. APP ICON VARIANT
  if (variant === 'app-icon') {
    const iconDim = Math.round(symH * 1.4);
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center rounded-2xl bg-[#071A2F] border border-white/10 shadow-md p-2 shrink-0 ${
          onClick ? 'cursor-pointer' : ''
        } ${className}`}
        style={{ width: iconDim, height: iconDim }}
        role="img"
        aria-label="TOGOSERVE App Icon"
      >
        <BrandMark size={symH} isDark={true} />
      </div>
    );
  }

  // 4. DEFAULT, LIGHT, OR HORIZONTAL (PRIMARY OFFICIAL LOGO)
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center shrink-0 select-none ${
        onClick ? 'cursor-pointer hover:opacity-90' : ''
      } ${className}`}
      role="img"
      aria-label="TOGOSERVE Official Logo"
    >
      {!imgError ? (
        <img
          src={assetPath}
          alt="TOGOSERVE"
          style={{ height: `${h}px`, width: 'auto', maxHeight: `${h}px` }}
          className="object-contain shrink-0"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="inline-flex items-center gap-2.5">
          <BrandMark size={symH} isDark={isDark} />
          <div className="flex flex-col justify-center">
            <div className="flex items-baseline tracking-tight font-extrabold leading-none text-xl sm:text-2xl">
              <span className={isDark ? 'text-white' : 'text-[#071A2F]'}>TOGO</span>
              <span className="text-[#D9A514]">SERVE</span>
            </div>
            {showSlogan && (
              <span className={`mt-0.5 font-medium tracking-wide text-[10px] ${isDark ? 'text-slate-300' : 'text-[#64748B]'}`}>
                Powering Merchants. Delivering Growth.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Aliases for backwards compatibility with any existing files
export const BrandLogo = Logo;
export type BrandLogoProps = LogoProps;
