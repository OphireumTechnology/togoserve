import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { HeroNetworkVisual } from '../marketplace/HeroNetworkVisual';
import { CategoryGrid } from '../marketplace/CategoryGrid';
import { MerchantCard } from '../marketplace/MerchantCard';
import { MerchantStorefrontModal } from '../marketplace/MerchantStorefrontModal';
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
  Check,
  Store,
  Heart,
  ShieldAlert,
  Filter
} from 'lucide-react';
import { ProductItem, DemoMerchantProfile, DemoProductItem } from '../../types';

export const MarketplaceView: React.FC<{
  onOpenCart: () => void;
}> = ({ onOpenCart }) => {
  const {
    products,
    demoMerchants,
    favoriteMerchantIds,
    toggleFavoriteMerchant,
    selectedDemoMerchant,
    setSelectedDemoMerchant,
    isStorefrontModalOpen,
    setIsStorefrontModalOpen,
    addToCart,
    orders,
    isDarkMode,
    setActivePortal,
    setIsTrackingModalOpen,
    setActiveTrackingOrderId,
    addToast,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'merchants' | 'products'>('merchants');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'name'>('recommended');
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const catalogSectionRef = useRef<HTMLDivElement>(null);

  // Active orders in this customer's session (if any)
  const activeOrders = useMemo(() => {
    return orders.filter((o) => !['DELIVERED', 'CANCELLED', 'COMPLETED'].includes(o.status));
  }, [orders]);

  // Filter Merchants by Category, Search, and Favorites
  const filteredMerchants = useMemo(() => {
    return demoMerchants.filter((merchant) => {
      // Category match
      const matchesCategory =
        selectedCategory === 'All' || merchant.category.toLowerCase() === selectedCategory.toLowerCase();

      // Search match
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        merchant.name.toLowerCase().includes(q) ||
        merchant.description.toLowerCase().includes(q) ||
        merchant.city.toLowerCase().includes(q) ||
        merchant.category.toLowerCase().includes(q) ||
        merchant.featuredTags.some((t) => t.toLowerCase().includes(q)) ||
        merchant.products.some((p) => p.name.toLowerCase().includes(q));

      // Favorites filter
      const matchesFavorite = !favoritesOnly || favoriteMerchantIds.includes(merchant.id);

      return matchesCategory && matchesQuery && matchesFavorite;
    }).sort((a, b) => {
      if (sortBy === 'rating') {
        return b.indicativeRating - a.indicativeRating;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0; // Default curated order
    });
  }, [demoMerchants, selectedCategory, searchQuery, favoritesOnly, favoriteMerchantIds, sortBy]);

  // Combined product catalog (Sample demo products + production products if present)
  const allAvailableProducts = useMemo(() => {
    const demoCatalog = demoMerchants.flatMap((m) =>
      m.products.map((p) => ({
        ...p,
        storeCity: m.city,
      }))
    );
    return demoCatalog;
  }, [demoMerchants]);

  // Filter products by category and query
  const filteredProducts = useMemo(() => {
    return allAvailableProducts.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
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
  }, [allAvailableProducts, selectedCategory, searchQuery]);

  const handleScrollToCatalog = () => {
    if (catalogSectionRef.current) {
      catalogSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenStore = (merchant: DemoMerchantProfile) => {
    setSelectedDemoMerchant(merchant);
    setIsStorefrontModalOpen(true);
  };

  const handleAddToCart = (product: DemoProductItem | ProductItem) => {
    if ('isSample' in product && product.isSample) {
      addToast('info', 'Preview Only', 'Demo products cannot be purchased. Browse a real accredited merchant to place an order.');
      return;
    }
    const cartProduct: ProductItem = {
      id: product.id,
      name: product.name,
      storeId: product.storeId,
      storeName: product.storeName,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      stock: product.stock,
      sku: product.sku,
      image: product.image,
      description: product.description,
      popular: product.popular,
      rating: 4.8,
      reviewsCount: 12,
    };
    addToCart(cartProduct, 1);
    setAddedItemIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
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
            className="px-3.5 py-1.5 bg-[#F4B400] hover:bg-[#FFD54F] text-[#2E2E2E] text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Track Live Order</span>
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. MODERNIZED MARKETPLACE HERO                           */}
      {/* Exact headlines, search, and AI network visual           */}
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
              Explore local food, groceries, essentials and delivery services across 12 sectors through an intelligent commerce and logistics platform.
            </p>

            {/* Direct Product and Merchant Search Field */}
            <div className="pt-1 max-w-xl">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  placeholder="Search sample merchants, products, or services..."
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
                {['Single Origin', 'Benguet Strawberries', 'Inasal', 'Aircon Cleaning', 'GaN Charger'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      handleScrollToCatalog();
                    }}
                    className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-[#F4B400] transition-colors cursor-pointer"
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
                className="px-6 py-3.5 bg-[#F4B400] hover:bg-[#FFD54F] text-[#2E2E2E] font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>Explore 48 Merchants</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActivePortal('padala')}
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/15 transition-colors flex items-center gap-2 cursor-pointer"
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
        <div className="absolute -right-16 -bottom-16 w-96 h-96 rounded-full bg-linear-to-tr from-[#F4B400]/20 to-[#F4B400]/5 blur-3xl pointer-events-none" />
      </section>

      {/* ======================================================== */}
      {/* 2. REBUILT BROWSE BY CATEGORY SECTION                     */}
      {/* 6 responsive cards per row desktop, 4 tablet, 2 mobile   */}
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
      {/* 3. DEMO DIRECTORY & CATALOG DISCOVERY SECTION            */}
      {/* ======================================================== */}
      <section ref={catalogSectionRef} className="space-y-6 pt-2">
        {/* Navigation Tabs & Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EBEEEE] dark:border-neutral-800">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-black text-[#2E2E2E] dark:text-white tracking-tight">
                {selectedCategory === 'All' ? 'Merchant Directory & Discovery' : `${selectedCategory} Sector`}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-300/40">
                48 DEMO STORES
              </span>
            </div>
            <p className="text-xs text-[#64748B] dark:text-neutral-400">
              {activeTab === 'merchants'
                ? `Showing ${filteredMerchants.length} curated demonstration merchants across 12 sectors.`
                : `Showing ${filteredProducts.length} sample products available for demonstration browsing.`}
            </p>
          </div>

          {/* View Mode Toggle + Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Tabs */}
            <div className="inline-flex p-1 rounded-xl bg-[#EBEEEE] dark:bg-neutral-800 text-xs font-bold">
              <button
                onClick={() => setActiveTab('merchants')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'merchants'
                    ? 'bg-white dark:bg-[#1E1E1E] text-[#2E2E2E] dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Merchants ({filteredMerchants.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'products'
                    ? 'bg-white dark:bg-[#1E1E1E] text-[#2E2E2E] dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Catalog ({filteredProducts.length})</span>
              </button>
            </div>

            {/* Favorites Filter */}
            <button
              onClick={() => setFavoritesOnly((prev) => !prev)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                favoritesOnly
                  ? 'bg-rose-50 border-rose-300 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400'
                  : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300'
              }`}
              title="Filter favorited merchants"
            >
              <Heart className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">Favorites</span>
            </button>

            {/* Sort Filter Dropdown */}
            {activeTab === 'merchants' && (
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs py-1.5 px-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-[#2E2E2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
              >
                <option value="recommended">Featured Order</option>
                <option value="rating">Top Rated</option>
                <option value="name">Merchant Name (A-Z)</option>
              </select>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* A. MERCHANTS DIRECTORY VIEW (DEFAULT 4 COLS DESKTOP)     */}
        {/* ======================================================== */}
        {activeTab === 'merchants' && (
          <div>
            {filteredMerchants.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-[#1C1C1C] rounded-3xl border border-[#EBEEEE] dark:border-neutral-800 p-8 space-y-3">
                <Store className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto" />
                <h3 className="text-base font-bold text-[#2E2E2E] dark:text-white">
                  No merchants found matching "{searchQuery}"
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed">
                  {favoritesOnly
                    ? "You haven't saved any merchants in this category to your favorites list yet."
                    : "Try resetting your search query or selecting a different category from the grid above."}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setFavoritesOnly(false);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F4B400] text-[#2E2E2E] font-bold text-xs rounded-xl shadow-2xs hover:bg-[#FFD54F] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Responsive Grid: ~4 cards per row desktop, 2 on tablet, 1-2 on mobile per Section B */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {filteredMerchants.map((merchant) => (
                  <MerchantCard
                    key={merchant.id}
                    merchant={merchant}
                    isFavorite={favoriteMerchantIds.includes(merchant.id)}
                    onToggleFavorite={toggleFavoriteMerchant}
                    onViewStore={handleOpenStore}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* B. PRODUCT CATALOG VIEW                                  */}
        {/* ======================================================== */}
        {activeTab === 'products' && (
          <div>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-[#1C1C1C] rounded-3xl border border-[#EBEEEE] dark:border-neutral-800 p-8 space-y-3">
                <ShoppingBag className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto" />
                <h3 className="text-base font-bold text-[#2E2E2E] dark:text-white">
                  No products found matching "{searchQuery}"
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed">
                  Try clearing the search query or selecting another category to discover demonstration items.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F4B400] text-[#2E2E2E] font-bold text-xs rounded-xl shadow-2xs hover:bg-[#FFD54F] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Filter</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {filteredProducts.map((product) => {
                  const isAdded = addedItemIds[product.id];
                  return (
                    <div
                      key={product.id}
                      className="group rounded-2xl border transition-all duration-200 hover:shadow-lg flex flex-col overflow-hidden bg-white dark:bg-[#1C1C1C] border-[#EBEEEE] dark:border-neutral-800"
                    >
                      {/* Product Image */}
                      <div className="relative aspect-4/3 w-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[9px] font-black uppercase bg-neutral-900/80 text-white backdrop-blur-md">
                          SAMPLE PREVIEW
                        </span>
                        {product.popular && (
                          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[9px] font-bold bg-[#F4B400] text-[#2E2E2E]">
                            POPULAR
                          </span>
                        )}
                      </div>

                      {/* Content Area */}
                      <div className="p-4 sm:p-5 flex flex-col grow justify-between space-y-3">
                        <div className="space-y-1.5">
                          <div className="text-[11px] text-[#64748B] dark:text-neutral-400 font-semibold flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#F4B400] shrink-0" />
                            <span className="truncate">{product.storeName}</span>
                          </div>

                          <h3 className="text-sm font-bold text-[#2E2E2E] dark:text-white line-clamp-1 group-hover:text-[#F4B400] transition-colors">
                            {product.name}
                          </h3>

                          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        </div>

                        {/* Price & Add to Basket Footer */}
                        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                          <div>
                            <div className="text-base font-black font-mono text-[#F4B400] tabular-nums">
                              ₱{product.price.toLocaleString()}
                            </div>
                            {product.originalPrice && (
                              <div className="text-[10px] text-neutral-400 line-through font-mono tabular-nums">
                                ₱{product.originalPrice.toLocaleString()}
                              </div>
                            )}
                          </div>

                          {'isSample' in product && product.isSample ? (
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
                              onClick={() => handleAddToCart(product)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all shadow-2xs active:scale-95 cursor-pointer ${
                                isAdded
                                  ? 'bg-emerald-600 text-white'
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
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* 4. TOGO PADALA EXPRESS CALLOUT STRIP                     */}
      {/* ======================================================== */}
      <section className="rounded-3xl bg-linear-to-r from-[#2E2E2E] to-neutral-900 text-white p-6 sm:p-8 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
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
          className="px-5 py-3 bg-[#F4B400] hover:bg-[#FFD54F] text-[#2E2E2E] font-black text-xs sm:text-sm rounded-xl shrink-0 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <span>Calculate Delivery Quote</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* ======================================================== */}
      {/* MERCHANT STOREFRONT PREVIEW MODAL                        */}
      {/* ======================================================== */}
      <MerchantStorefrontModal
        merchant={selectedDemoMerchant}
        isOpen={isStorefrontModalOpen}
        onClose={() => setIsStorefrontModalOpen(false)}
        isFavorite={selectedDemoMerchant ? favoriteMerchantIds.includes(selectedDemoMerchant.id) : false}
        onToggleFavorite={toggleFavoriteMerchant}
        onAddToCart={handleAddToCart}
      />

    </div>
  );
};
