import React, { useEffect } from 'react';
import { DemoMerchantProfile, DemoProductItem } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';
import {
  X,
  MapPin,
  Clock,
  Bike,
  ShieldAlert,
  ShoppingBag,
  Plus,
  Check,
  AlertTriangle,
  Heart,
  Car,
  Truck
} from 'lucide-react';

interface MerchantStorefrontModalProps {
  merchant: DemoMerchantProfile | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (merchantId: string) => void;
  onAddToCart: (product: DemoProductItem) => void;
}

export const MerchantStorefrontModal: React.FC<MerchantStorefrontModalProps> = ({
  merchant,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
}) => {
  const [addedItems, setAddedItems] = React.useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !merchant) return null;

  const handleAdd = (product: DemoProductItem) => {
    if (product.isSample) {
      return;
    }
    onAddToCart(product);
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="storefront-modal-title"
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-[#1A1A1A] rounded-3xl shadow-2xl border border-[#EBEEEE] dark:border-neutral-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ======================================================== */}
        {/* STOREFRONT HERO BANNER & HEADER                          */}
        {/* ======================================================== */}
        <div className="relative h-48 sm:h-64 w-full bg-neutral-900 shrink-0 overflow-hidden">
          <ImageWithFallback
            src={merchant.storefrontImage}
            alt={merchant.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/30" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/50 text-white/90 hover:text-white hover:bg-black/75 transition-all duration-150 backdrop-blur-md cursor-pointer z-10"
            aria-label="Close store preview"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Storefront Floating Header Content */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black tracking-wider uppercase bg-amber-500 text-white border border-amber-300/40">
                  DEMO STORE PROFILE
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-neutral-800/80 text-neutral-300">
                  {merchant.category}
                </span>
                {merchant.isOpen && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600/90 text-white flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Open Now
                  </span>
                )}
              </div>
              <h2
                id="storefront-modal-title"
                className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-md"
              >
                {merchant.name}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl line-clamp-2">
                {merchant.description}
              </p>
            </div>

            {/* Favorite action button */}
            <button
              type="button"
              onClick={() => onToggleFavorite(merchant.id)}
              className={`self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold backdrop-blur-md transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-black/40 text-white/90 hover:bg-black/60 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              <span>{isFavorite ? 'Saved Store' : 'Favorite'}</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COMPLIANCE WARNING BANNER (STRICT DIRECTIVE MANDATE)     */}
        {/* ======================================================== */}
        <div className="px-4 py-2.5 sm:px-6 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/60 flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <p className="font-medium">
            <strong className="font-bold">Demonstration Showcase Profile:</strong> This is a curated sample merchant preview. Real customer accreditation requires administrative business document review. Sample products cannot be charged to live payment gateways.
          </p>
        </div>

        {/* ======================================================== */}
        {/* OPERATIONAL METADATA STRIP                               */}
        {/* ======================================================== */}
        <div className="px-4 sm:px-6 py-3 bg-[#FAFAFA] dark:bg-neutral-900/70 border-b border-[#EBEEEE] dark:border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <Clock className="w-4 h-4 text-[#F4B400] shrink-0" />
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-400">Hours</p>
              <p className="font-semibold text-neutral-800 dark:text-neutral-200">{merchant.operatingHours}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <MapPin className="w-4 h-4 text-[#F4B400] shrink-0" />
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-400">Location</p>
              <p className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">{merchant.city}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <Bike className="w-4 h-4 text-[#F4B400] shrink-0" />
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-400">Delivery Est.</p>
              <p className="font-semibold text-neutral-800 dark:text-neutral-200">~{merchant.estimatedDeliveryMin} mins (₱{merchant.deliveryFee})</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <ShoppingBag className="w-4 h-4 text-[#F4B400] shrink-0" />
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-400">Minimum Order</p>
              <p className="font-semibold text-neutral-800 dark:text-neutral-200">₱{merchant.minimumOrder}</p>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SAMPLE CATALOG & PRODUCTS LIST                           */}
        {/* ======================================================== */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-black text-[#2E2E2E] dark:text-white">
              Demonstration Catalog ({merchant.products.length} Items)
            </h3>
            <span className="text-xs text-neutral-500 font-medium">
              Indicative Philippine Peso (₱) Pricing
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {merchant.products.map((product) => {
              const isAdded = !!addedItems[product.id];

              return (
                <div
                  key={product.id}
                  className="flex flex-col justify-between bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#EBEEEE] dark:border-neutral-800 p-3 sm:p-4 shadow-2xs hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-black uppercase bg-neutral-900/80 text-white backdrop-blur-md">
                        SAMPLE ITEM
                      </span>
                      {product.popular && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-bold bg-[#F4B400] text-[#2E2E2E]">
                          POPULAR
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-[#2E2E2E] dark:text-white line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-black text-[#2E2E2E] dark:text-white">
                        ₱{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-neutral-400 line-through">
                          ₱{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {product.isSample ? (
                      <button
                        type="button"
                        disabled
                        aria-label={`${product.name} is a demo product`}
                        className="rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-3 py-1.5 text-neutral-500 dark:text-neutral-400 font-semibold text-xs cursor-not-allowed select-none"
                      >
                        Preview Only
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAdd(product)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#F4B400] text-[#2E2E2E] hover:bg-[#FFD54F]'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to Basket</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 bg-[#FAFAFA] dark:bg-neutral-900 border-t border-[#EBEEEE] dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-neutral-400">ID: {merchant.id}</span>
            <span>•</span>
            <span>Slug: {merchant.slug}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl font-bold bg-[#EBEEEE] dark:bg-neutral-800 text-[#2E2E2E] dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            Close Storefront
          </button>
        </div>
      </div>
    </div>
  );
};
