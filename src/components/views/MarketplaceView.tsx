import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { HeroNetworkVisual } from '../marketplace/HeroNetworkVisual';
import { CategoryGrid } from '../marketplace/CategoryGrid';
import {
  Search,
  Star,
  Plus,
  Bike,
  MapPin,
  Sparkles,
  ShoppingBag,
  SlidersHorizontal,
  ArrowRight,
  Package,
  RotateCcw,
  Check
} from 'lucide-react';
import { ProductItem } from '../../types';

export const MarketplaceView: React.FC<{
  onOpenCart: () => void;
}> = ({ onOpenCart }) => {
  const {
    products,
    addToCart,
    orders,
    isDarkMode,
    setActivePortal,
    setIsTrackingModalOpen,
    setActiveTrackingOrderId,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'popular' | 'price-asc' | 'price-desc'>('recommended');
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const catalogSectionRef = useRef<HTMLDivElement>(null);

  // Active orders in this customer's session (if any)
  const activeOrders = useMemo(() => {
    return orders.filter((o) => !['DELIVERED', 'CANCELLED', 'COMPLETED'].includes(o.status));
  }, [orders]);

  // Filter products by category and query
  const filteredProducts = useMemo(() => {
    let result = products.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.storeName.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });

    if (sortBy === 'popular') {
      result = [...result].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || b.reviewsCount - a.reviewsCount);
    } else if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleAddToCart = (product: ProductItem) => {
    addToCart(product, 1);
    setAddedItemIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  const handleScrollToCatalog = () => {
    if (catalogSectionRef.current) {
      catalogSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-10 sm:space-y-12 pb-16 font-['Inter']">
      
      {/* ======================================================== */}
      {/* DISCRETE ACTIVE ORDER BANNER (ONLY IF SESSION HAS ORDER) */}
      {/* Replaces the intrusive live tracker on public pages      */}
      {/* ======================================================== */}
      {activeOrders.length > 0 && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-[#F4B400]/40 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16845B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#16845B]"></span>
            </span>
            <div className="text-xs">
              <span className="font-bold text-[#2E2E2E] dark:text-white">Active Order in Progress: </span>
              <span className="font-mono text-[#F4B400] font-bold">{activeOrders[0].orderNumber}</span>
              <span className="text-neutral-500 dark:text-neutral-400 hidden sm:inline"> — {activeOrders[0].storeName}</span>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveTrackingOrderId(activeOrders[0].orderNumber);
              setIsTrackingModalOpen(true);
            }}
            className="px-3.5 py-1.5 bg-[#F4B400] hover:bg-[#FFD54F] text-[#2E2E2E] text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Track Live Order</span>
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. MODERNIZED MARKETPLACE HERO                           */}
      {/* Strict adherence to Section 5: Exact headlines, search, */}
      {/* and AI commerce/logistics network visualization          */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-[#2E2E2E] text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-neutral-800">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Headlines, description, search & primary actions */}
          <div className="lg:col-span-7 space-y-5">
            {/* AI Commerce Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs text-[#FFD54F] font-semibold border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
              <span className="tracking-wide">AI-Native Commerce &amp; On-Demand Logistics Network</span>
            </div>

            {/* Directive Required Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-white">
              Discover Local Merchants. <br />
              <span className="text-[#F4B400]">Shop Smarter with TOGOSERVE.</span>
            </h1>

            {/* Directive Required Supporting Description */}
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl font-normal">
              Explore local food, groceries, essentials and delivery services through an intelligent commerce and logistics platform.
            </p>

            {/* Direct Product and Merchant Search Field */}
            <div className="pt-1 max-w-xl">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  placeholder="Search food, fresh groceries, pharmacy, or retail merchants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs sm:text-sm pl-11 pr-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#F4B400] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-3 text-neutral-400 hover:text-white text-xs font-mono"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Quick Search Suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-[11px] text-neutral-400">
                <span className="text-neutral-500 font-medium">Popular:</span>
                {['Sourdough', 'Benguet Strawberries', 'Multivitamins', 'Earbuds', 'Aircon Cleaning'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      handleScrollToCatalog();
                    }}
                    className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-[#F4B400] transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary & Secondary Action Buttons */}
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={handleScrollToCatalog}
                className="px-6 py-3.5 bg-[#F4B400] hover:bg-[#FFD54F] text-[#2E2E2E] font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-2"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActivePortal('padala')}
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/15 transition-colors flex items-center gap-2"
              >
                <Bike className="w-4 h-4 text-[#F4B400]" />
                <span>Send with TOGO Padala</span>
              </button>
            </div>
          </div>

          {/* Right Column: AI Commerce & Logistics Network Visual */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <HeroNetworkVisual />
          </div>

        </div>

        {/* Subtle Ambient Radial Backlight */}
        <div className="absolute -right-16 -bottom-16 w-96 h-96 rounded-full bg-gradient-to-tr from-[#F4B400]/20 to-[#F4B400]/5 blur-3xl pointer-events-none" />
      </section>

      {/* ======================================================== */}
      {/* 2. REBUILT BROWSE BY CATEGORY SECTION                     */}
      {/* 4–6 responsive cards per row desktop, 2 mobile           */}
      {/* ======================================================== */}
      <CategoryGrid
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          handleScrollToCatalog();
        }}
        onPadalaClick={() => setActivePortal('padala')}
      />

      {/* ======================================================== */}
      {/* 3. VERIFIED MERCHANT CATALOG & DISCOVERY SECTION         */}
      {/* ======================================================== */}
      <section ref={catalogSectionRef} className="space-y-6 pt-2">
        {/* Catalog Section Header & Sorting Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EBEEEE] dark:border-neutral-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#2E2E2E] dark:text-white tracking-tight">
              {selectedCategory === 'All' ? 'Verified Merchant Offerings' : selectedCategory}
            </h2>
            <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-0.5">
              {filteredProducts.length} authentic {filteredProducts.length === 1 ? 'item' : 'items'} available for on-demand dispatch
            </p>
          </div>

          {/* Sort Filter Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-xs text-neutral-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs py-1.5 px-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-[#2E2E2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
            >
              <option value="recommended">Featured &amp; Recommended</option>
              <option value="popular">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#1C1C1C] rounded-3xl border border-[#EBEEEE] dark:border-neutral-800 p-8 space-y-3">
            <ShoppingBag className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto" />
            <h3 className="text-base font-bold text-[#2E2E2E] dark:text-white">
              No products found matching "{searchQuery}"
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed">
              We couldn't find items in this category matching your search. Try resetting your search query or selecting another category.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F4B400] text-[#2E2E2E] font-bold text-xs rounded-xl shadow-2xs hover:bg-[#FFD54F] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product) => {
              const isAdded = addedItemIds[product.id];
              return (
                <div
                  key={product.id}
                  className={`group rounded-3xl border transition-all duration-200 hover:shadow-lg flex flex-col overflow-hidden bg-white dark:bg-[#1C1C1C] ${
                    isDarkMode
                      ? 'border-neutral-800 hover:border-neutral-700 text-white'
                      : 'border-[#EBEEEE] hover:border-neutral-300 text-[#2E2E2E]'
                  }`}
                >
                  {/* Product Image Container */}
                  <div className="relative aspect-4/3 w-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.popular && (
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-[#F4B400] text-[#2E2E2E] text-[10px] font-black uppercase tracking-wider shadow-xs">
                        Popular
                      </span>
                    )}
                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-xs text-white text-[11px] font-mono tabular-nums flex items-center gap-1">
                      <Star className="w-3 h-3 text-[#F4B400] fill-[#F4B400]" />
                      <span>{product.rating.toFixed(1)}</span>
                      <span className="text-neutral-400">({product.reviewsCount})</span>
                    </span>
                  </div>

                  {/* Card Content Area */}
                  <div className="p-4 sm:p-5 flex flex-col grow justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="text-[11px] text-[#64748B] dark:text-neutral-400 font-semibold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#F4B400] shrink-0" />
                        <span className="truncate">{product.storeName}</span>
                      </div>

                      <h3 className="text-sm font-bold line-clamp-1 group-hover:text-[#F4B400] transition-colors">
                        {product.name}
                      </h3>

                      <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Price & Add to Cart Footer */}
                    <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                      <div>
                        <div className="text-base font-black font-mono text-[#F4B400] tabular-nums">
                          ₱{product.price.toFixed(2)}
                        </div>
                        {product.originalPrice && (
                          <div className="text-[10px] text-neutral-400 line-through font-mono tabular-nums">
                            ₱{product.originalPrice.toFixed(2)}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all shadow-2xs active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#F4B400] ${
                          isAdded
                            ? 'bg-[#16845B] text-white'
                            : 'bg-[#F4B400] hover:bg-[#FFD54F] text-[#2E2E2E]'
                        }`}
                        aria-label={`Add ${product.name} to basket`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* 4. TOGO PADALA EXPRESS CALLOUT STRIP                     */}
      {/* ======================================================== */}
      <section className="rounded-3xl bg-gradient-to-r from-[#2E2E2E] to-neutral-900 text-white p-6 sm:p-8 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F4B400]/20 text-[#FFD54F] text-[11px] font-bold">
            <Bike className="w-3.5 h-3.5 text-[#F4B400]" />
            <span>Need to send a parcel instead?</span>
          </div>
          <h3 className="text-xl font-black">
            Book TOGO Padala Express Courier Dispatch
          </h3>
          <p className="text-xs text-neutral-300 max-w-lg leading-relaxed">
            Same-day point-to-point courier delivery across Metro Manila and provincial urban hubs with verified electronic proof of delivery (e-POD).
          </p>
        </div>

        <button
          onClick={() => setActivePortal('padala')}
          className="px-5 py-3 bg-[#F4B400] hover:bg-[#FFD54F] text-[#2E2E2E] font-black text-xs sm:text-sm rounded-xl shrink-0 transition-all active:scale-95 flex items-center gap-2"
        >
          <span>Calculate Delivery Quote</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

    </div>
  );
};
