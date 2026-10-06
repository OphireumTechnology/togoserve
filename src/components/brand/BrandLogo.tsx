import React from 'react';

export interface BrandLogoProps {
  variant?: 'horizontal' | 'stacked' | 'symbol' | 'app-icon';
  theme?: 'light' | 'dark';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showSlogan?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * TOGOSERVE Brand Symbol Mark
 * Strict geometric vectors with metallic Chrome-White & Warm Gold folds
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
        <linearGradient id="togoStemGrad" x1="20" y1="20" x2="80" y2="100" gradientUnits="userSpaceOnUse">
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
        fill="url(#togoStemGrad)"
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
 * Official Centralized TOGOSERVE BrandLogo Component
 * Single Source of Truth for brand representation across all screens.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'horizontal',
  theme = 'light',
  size = 'md',
  showSlogan = false,
  className = '',
  onClick,
}) => {
  const isDark = theme === 'dark';

  const symbolPixelSizes = {
    xs: 22,
    sm: 28,
    md: 36,
    lg: 44,
    xl: 56,
  };

  const textSizes = {
    xs: 'text-base',
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  const sloganSizes = {
    xs: 'text-[8px]',
    sm: 'text-[9.5px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  // APP ICON VARIANT (Squircle badge)
  if (variant === 'app-icon') {
    const iconDim = symbolPixelSizes[size] * 1.5;
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
        <BrandMark size={symbolPixelSizes[size]} isDark={true} />
      </div>
    );
  }

  // SYMBOL ONLY VARIANT
  if (variant === 'symbol') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
        role="img"
        aria-label="TOGOSERVE Symbol"
      >
        <BrandMark size={symbolPixelSizes[size]} isDark={isDark} />
      </div>
    );
  }

  // STACKED VARIANT (Vertical)
  if (variant === 'stacked') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex flex-col items-center text-center shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
        role="img"
        aria-label="TOGOSERVE Stacked Logo"
      >
        <BrandMark size={symbolPixelSizes[size] * 1.25} isDark={isDark} />
        <div className={`mt-2 flex items-baseline tracking-tight font-extrabold leading-none ${textSizes[size]}`}>
          <span className={isDark ? 'text-white' : 'text-[#071A2F]'}>TOGO</span>
          <span className="text-[#D9A514]">SERVE</span>
        </div>
        {showSlogan && (
          <p className={`mt-1 font-medium tracking-wide ${isDark ? 'text-slate-300' : 'text-[#64748B]'} ${sloganSizes[size]}`}>
            Powering Merchants. Delivering Growth.
          </p>
        )}
      </div>
    );
  }

  // DEFAULT: HORIZONTAL VARIANT
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      role="img"
      aria-label="TOGOSERVE Horizontal Logo"
    >
      <BrandMark size={symbolPixelSizes[size]} isDark={isDark} />
      <div className="flex flex-col">
        <div className={`flex items-baseline tracking-tight font-extrabold leading-none ${textSizes[size]}`}>
          <span className={isDark ? 'text-white' : 'text-[#071A2F]'}>TOGO</span>
          <span className="text-[#D9A514]">SERVE</span>
        </div>
        {showSlogan && (
          <span className={`mt-0.5 font-medium tracking-wide whitespace-nowrap ${isDark ? 'text-slate-300' : 'text-[#64748B]'} ${sloganSizes[size]}`}>
            Powering Merchants. Delivering Growth.
          </span>
        )}
      </div>
    </div>
  );
};
