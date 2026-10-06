import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, ShoppingBag, Star, Clock, Plus, Bike, MapPin, CheckCircle, ChevronRight, Sparkles } from 'lucide-react';
import { ProductItem } from '../../types';

export const MarketplaceView: React.FC<{
  onOpenCart: () => void;
}> = ({ onOpenCart }) => {
  const { products, addToCart, orders, isDarkMode, setActivePortal } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Restaurants',
    'Groceries',
    'Pharmacy',
    'Retail',
    'Pet Care',
    'Flowers',
  ];

  const filteredProducts = products.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesQuery =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const activeOrders = orders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');

  return (
    <div className="space-y-8 pb-12">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-2xl bg-[#071A2F] text-white p-6 sm:p-10 shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-[#FFC928] font-semibold border border-white/15">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Local Commerce & On-Demand Fulfillment</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Discover Local Merchants. <br />
            <span className="text-[#FFC928]">Delivered in 25 Minutes.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            Order artisan food, fresh farm groceries, pharmaceuticals, and retail goods directly
            from verified merchants across Metro Manila.
          </p>

          {/* Quick Search Bar */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2 max-w-lg">
            <div className="relative grow">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search food, stores, groceries, or essentials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FFC928]"
              />
            </div>
            <button
              onClick={() => setActivePortal('padala')}
              className="px-4 py-2.5 bg-[#FFC928] hover:bg-[#D9A514] text-[#071A2F] font-bold text-xs sm:text-sm rounded-xl transition-colors shrink-0 shadow-sm flex items-center justify-center gap-1.5"
            >
              <Bike className="w-4 h-4" />
              <span>Send Parcel (Padala)</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-10 -bottom-10 w-96 h-96 rounded-full bg-gradient-to-tr from-[#D9A514]/20 to-[#FFC928]/10 blur-3xl pointer-events-none" />
      </section>

      {/* ACTIVE REAL-TIME ORDER TRACKING WIDGET (IF ACTIVE ORDERS EXIST) */}
      {activeOrders.length > 0 && (
        <section
          className={`p-5 rounded-2xl border transition-colors ${
            isDarkMode
              ? 'bg-[#0B223D] border-slate-700/80 text-white'
              : 'bg-white border-slate-200 text-[#17212B] shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16845B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#16845B]"></span>
              </span>
              <h2 className="text-sm font-bold tracking-tight">Active Live Order</h2>
            </div>
            <span className="font-mono text-xs font-bold text-[#D9A514]">
              {activeOrders[0].orderNumber}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Merchant</p>
              <h4 className="text-sm font-bold truncate">{activeOrders[0].storeName}</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeOrders[0].items.length} item(s) • Total ₱{activeOrders[0].total.toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Fulfillment Status</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-[#FFC928]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#D9A514]">
                  {activeOrders[0].status.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-400">
                  (ETA: ~{activeOrders[0].estimatedDeliveryMin} mins)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                Rider: {activeOrders[0].riderName}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setActivePortal('rider')}
                className="px-3.5 py-2 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                View Rider Telemetry
              </button>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span className="text-emerald-500 font-bold">1. Confirmed</span>
              <span className={activeOrders[0].trackingStep >= 3 ? 'text-emerald-500 font-bold' : ''}>
                2. Merchant Accepted
              </span>
              <span className={activeOrders[0].trackingStep >= 4 ? 'text-emerald-500 font-bold' : ''}>
                3. Preparing
              </span>
              <span className={activeOrders[0].trackingStep >= 7 ? 'text-emerald-500 font-bold' : ''}>
                4. On the Way
              </span>
              <span>5. Delivered</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#D9A514] h-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.max(15, activeOrders[0].trackingStep * 16))}%`,
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* CATEGORY SELECTOR BUTTONS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-[#D9A514] ${
                isSelected
                  ? 'bg-[#071A2F] dark:bg-[#FFC928] text-white dark:text-[#071A2F] shadow-sm font-bold'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* PRODUCT GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold tracking-tight">
            {selectedCategory === 'All' ? 'Featured Products & Menus' : selectedCategory}
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {filteredProducts.length} items available
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
            <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold">No items found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search query or picking another marketplace category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`group rounded-2xl border transition-all hover:shadow-lg flex flex-col overflow-hidden ${
                  isDarkMode
                    ? 'bg-[#0B223D] border-slate-800 hover:border-slate-700 text-white'
                    : 'bg-white border-slate-200/90 hover:border-slate-300 text-[#17212B]'
                }`}
              >
                {/* Product Image */}
                <div className="relative aspect-4/3 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {product.popular && (
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#FFC928] text-[#071A2F] text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
                      Popular
                    </span>
                  )}
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[11px] font-mono tabular-nums flex items-center gap-1">
                    <Star className="w-3 h-3 text-[#FFC928] fill-[#FFC928]" />
                    {product.rating} ({product.reviewsCount})
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col grow">
                  <div className="text-[11px] text-slate-400 font-semibold mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#D9A514]" />
                    <span className="truncate">{product.storeName}</span>
                  </div>

                  <h3 className="text-sm font-bold line-clamp-1 group-hover:text-[#D9A514] transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed grow">
                    {product.description}
                  </p>

                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-extrabold font-mono text-[#D9A514]">
                        ₱{product.price.toFixed(2)}
                      </div>
                      {product.originalPrice && (
                        <div className="text-[10px] text-slate-400 line-through font-mono">
                          ₱{product.originalPrice.toFixed(2)}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(product, 1)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFC928] hover:bg-[#D9A514] text-[#071A2F] text-xs font-bold rounded-xl transition-all shadow-xs active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#FFC928]"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
