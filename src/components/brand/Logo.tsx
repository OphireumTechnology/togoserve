import React from 'react';

export interface LogoProps {
  variant?: 'horizontal' | 'stacked' | 'symbol' | 'business';
  isDark?: boolean;
  className?: string;
  showSlogan?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Official TOGOSERVE Symbol (TS Dynamic Arrow)
 * Represents Speed, Reliability, Delivery, and Growth.
 */
export const BrandMark: React.FC<{
  size?: number;
  className?: string;
  isDark?: boolean;
}> = ({ size = 38, className = '', isDark = false }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="TOGOSERVE Brand Symbol"
    >
      <defs>
        {/* Gradients for TS Arrow ribbon origami depth */}
        <linearGradient id="togoNavyStem" x1="20" y1="20" x2="80" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isDark ? "#E2E8F0" : "#071A2F"} />
          <stop offset="60%" stopColor={isDark ? "#94A3B8" : "#0F2A4A"} />
          <stop offset="100%" stopColor={isDark ? "#64748B" : "#071A2F"} />
        </linearGradient>

        <linearGradient id="togoGoldFold" x1="40" y1="30" x2="110" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFDE59" />
          <stop offset="35%" stopColor="#FFC928" />
          <stop offset="85%" stopColor="#D9A514" />
          <stop offset="100%" stopColor="#B37E00" />
        </linearGradient>

        <linearGradient id="togoSilverTop" x1="30" y1="15" x2="85" y2="45" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isDark ? "#FFFFFF" : "#0F2A4A"} />
          <stop offset="70%" stopColor={isDark ? "#CBD5E1" : "#071A2F"} />
        </linearGradient>
      </defs>

      {/* Speed / Motion Streaks on the Left */}
      <path
        d="M6 46H26L22 52H2L6 46Z"
        fill="#FFC928"
      />
      <path
        d="M12 60H34L30 66H8L12 60Z"
        fill="#FFC928"
      />
      <path
        d="M18 74H38L34 80H14L18 74Z"
        fill="#D9A514"
      />

      {/* Main TS Monogram: Stem and Top Bar (T) */}
      <path
        d="M32 24H86L80 36H56L36 94H20L40 36H26L32 24Z"
        fill="url(#togoNavyStem)"
      />

      {/* Dynamic S-Fold with Upward-Right Arrow Head */}
      <path
        d="M52 46H74L63 76C61 82 66 88 73 88H88L82 72L108 58L104 90L92 84C89 96 76 102 65 100C49 98 44 84 48 72L52 60C44 64 38 72 38 78H26C26 66 36 52 52 46Z"
        fill="url(#togoGoldFold)"
      />

      {/* Arrow Head Accent & Upper Crest */}
      <path
        d="M80 34L108 30L98 58L88 48L80 34Z"
        fill="url(#togoGoldFold)"
      />
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  isDark = false,
  className = '',
  showSlogan = false,
  size = 'md',
}) => {
  // Sizing definitions
  const symbolSizes = {
    sm: 28,
    md: 36,
    lg: 46,
    xl: 60,
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  const sloganSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  if (variant === 'symbol') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <BrandMark size={symbolSizes[size]} isDark={isDark} />
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`inline-flex flex-col items-center text-center ${className}`}>
        <BrandMark size={symbolSizes[size] * 1.3} isDark={isDark} />
        <div className="mt-2 flex items-baseline tracking-tight font-extrabold">
          <span className={isDark ? 'text-white' : 'text-[#071A2F]'}>TOGO</span>
          <span className="text-[#D9A514]">SERVE</span>
        </div>
        {showSlogan && (
          <p className={`mt-0.5 font-medium tracking-wide ${isDark ? 'text-slate-300' : 'text-[#64748B]'} ${sloganSizes[size]}`}>
            Powering Merchants. Delivering Growth.
          </p>
        )}
      </div>
    );
  }

  if (variant === 'business') {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        <BrandMark size={symbolSizes[size]} isDark={isDark} />
        <div className="flex flex-col">
          <div className={`flex items-baseline tracking-tight font-extrabold leading-none ${textSizes[size]}`}>
            <span className={isDark ? 'text-white' : 'text-[#071A2F]'}>TOGO</span>
            <span className="text-[#D9A514]">SERVE</span>
            <span className="ml-1.5 text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#FFC928]/20 text-[#D9A514] border border-[#D9A514]/30">
              BUSINESS
            </span>
          </div>
          {showSlogan && (
            <span className={`mt-1 font-medium tracking-wide ${isDark ? 'text-slate-300' : 'text-[#64748B]'} ${sloganSizes[size]}`}>
              Powering Merchants. Delivering Growth.
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default: Horizontal
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <BrandMark size={symbolSizes[size]} isDark={isDark} />
      <div className="flex flex-col">
        <div className={`flex items-baseline tracking-tight font-extrabold leading-none ${textSizes[size]}`}>
          <span className={isDark ? 'text-white' : 'text-[#071A2F]'}>TOGO</span>
          <span className="text-[#D9A514]">SERVE</span>
        </div>
        {showSlogan && (
          <span className={`mt-0.5 font-medium tracking-wide ${isDark ? 'text-slate-300' : 'text-[#64748B]'} ${sloganSizes[size]}`}>
            Powering Merchants. Delivering Growth.
          </span>
        )}
      </div>
    </div>
  );
};
