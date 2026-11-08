import React, { useState } from 'react';
import { ShoppingBag, Package } from 'lucide-react';

export interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  fallbackIcon?: React.ReactNode;
  containerClassName?: string;
}

/**
 * Production-ready ImageWithFallback component
 * Ensures no broken image icons, handles network errors gracefully,
 * applies proper object-fit (cover/contain) and lazy loading without external dependencies.
 */
export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'TOGOSERVE asset',
  fallbackSrc,
  fallbackIcon,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(src));

  // If no source is provided or error occurred, show the styled fallback container
  if (!src || hasError) {
    if (fallbackSrc && !hasError) {
      return (
        <div className={`relative overflow-hidden ${containerClassName}`}>
          <img
            src={fallbackSrc}
            alt={alt}
            className={`w-full h-full object-cover ${className}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
            {...props}
          />
        </div>
      );
    }

    return (
      <div
        className={`w-full h-full min-h-[140px] flex flex-col items-center justify-center bg-gradient-to-br from-[#FAFAFA] to-[#EBEEEE] dark:from-neutral-900 dark:to-neutral-800 text-neutral-500 dark:text-neutral-400 p-4 text-center border border-[#EBEEEE] dark:border-neutral-700/60 ${containerClassName}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-10 h-10 rounded-full bg-white dark:bg-neutral-800 shadow-2xs flex items-center justify-center text-[#F4B400] mb-2">
          {fallbackIcon || <Package className="w-5 h-5" />}
        </div>
        <span className="text-[11px] font-semibold text-[#2E2E2E] dark:text-neutral-200 line-clamp-1 max-w-[90%]">
          {alt}
        </span>
        <span className="text-[9px] font-mono text-[#D9C39A] dark:text-[#D9C39A] uppercase tracking-wider mt-0.5">
          TOGOSERVE Verified
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-[#EBEEEE] dark:bg-neutral-800 animate-pulse" />
      )}

      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
        loading="lazy"
        referrerPolicy="no-referrer"
        {...props}
      />
    </div>
  );
};
