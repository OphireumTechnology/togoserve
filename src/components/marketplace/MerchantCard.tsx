import React from 'react';
import { DemoMerchantProfile } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';
import {
  MapPin,
  Clock,
  Heart,
  Store,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Bike
} from 'lucide-react';

interface MerchantCardProps {
  merchant: DemoMerchantProfile;
  isFavorite: boolean;
  onToggleFavorite: (merchantId: string) => void;
  onViewStore: (merchant: DemoMerchantProfile) => void;
}

export const MerchantCard: React.FC<MerchantCardProps> = ({
  merchant,
  isFavorite,
  onToggleFavorite,
  onViewStore,
}) => {
  return (
    <article
      className="group relative flex flex-col bg-white dark:bg-[#1C1C1C] rounded-2xl border border-[#EBEEEE] dark:border-neutral-800 shadow-2xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      {/* ======================================================== */}
      {/* STOREFRONT IMAGE & STATUS OVERLAYS                       */}
      {/* ======================================================== */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <ImageWithFallback
          src={merchant.storefrontImage}
          alt={merchant.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Scrim for contrast */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

        {/* Prominent Demo Indicator Badge (Strict Rule: Demo merchants must never receive a VERIFIED badge) */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase bg-amber-500/90 text-white backdrop-blur-md shadow-xs border border-amber-300/40">
            <ShieldAlert className="w-3 h-3 text-white" />
            <span>DEMO STORE</span>
          </span>
          {merchant.isOpen ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600/90 text-white backdrop-blur-md shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse" />
              <span>Open Now</span>
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-neutral-800/80 text-neutral-300 backdrop-blur-md shadow-xs">
              Closed
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(merchant.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
            isFavorite
              ? 'bg-rose-500 text-white shadow-md scale-105'
              : 'bg-black/40 text-white/90 hover:bg-black/60 hover:text-white'
          }`}
          title={isFavorite ? 'Remove from saved stores' : 'Save store to favorites'}
          aria-label={isFavorite ? 'Remove favorite' : 'Add favorite'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Bottom Image Metadata Overlay: Operating Hours & Delivery Estimate */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] font-medium drop-shadow-md">
          <div className="flex items-center gap-1 text-white/95">
            <Clock className="w-3.5 h-3.5 text-[#F4B400]" />
            <span className="truncate max-w-[170px]">{merchant.operatingHours}</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-[#FFD54F]">
            <Bike className="w-3.5 h-3.5" />
            <span>~{merchant.estimatedDeliveryMin} min</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MERCHANT DETAILS & BRANDING BODY                         */}
      {/* ======================================================== */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Indicative Rating Header */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#F4B400] dark:text-[#FFD54F]">
              {merchant.category}
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-neutral-700 dark:text-neutral-300">
              <span className="text-amber-500 font-black">★</span>
              <span>{merchant.indicativeRating.toFixed(1)}</span>
              <span className="text-[10px] text-neutral-400 font-normal">(demo)</span>
            </div>
          </div>

          {/* Merchant Name */}
          <h3 className="text-base sm:text-lg font-black text-[#2E2E2E] dark:text-white group-hover:text-[#F4B400] transition-colors line-clamp-1">
            {merchant.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
            {merchant.description}
          </p>

          {/* Location details */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mt-2.5">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">{merchant.city}</span>
          </div>

          {/* Featured tags */}
          {merchant.featuredTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {merchant.featuredTags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#EBEEEE] dark:bg-neutral-800 text-[#2E2E2E] dark:text-neutral-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* CARD FOOTER & VIEW STORE ACTION                          */}
        {/* ======================================================== */}
        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-2">
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
            <span>Min ₱{merchant.minimumOrder}</span>
            <span className="mx-1.5">•</span>
            <span>Fee ₱{merchant.deliveryFee}</span>
          </div>

          <button
            type="button"
            onClick={() => onViewStore(merchant)}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-black bg-[#2E2E2E] dark:bg-white text-white dark:text-[#2E2E2E] hover:bg-[#F4B400] dark:hover:bg-[#F4B400] hover:text-[#2E2E2E] dark:hover:text-[#2E2E2E] transition-all cursor-pointer shadow-2xs group-hover:shadow-xs"
          >
            <Store className="w-3.5 h-3.5" />
            <span>View Store</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
