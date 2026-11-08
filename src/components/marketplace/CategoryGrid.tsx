import React from 'react';
import {
  Utensils,
  ShoppingCart,
  Store,
  Pill,
  ShoppingBag,
  Flower2,
  PawPrint,
  Sparkles,
  Building2,
  Laptop,
  Layers,
  Truck,
  RotateCcw
} from 'lucide-react';

export interface CategoryItem {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
  itemCount: number;
}

export const CATEGORIES_DATA: CategoryItem[] = [
  {
    id: 'Food',
    name: 'Food & Dining',
    subtitle: 'Chef dishes, pastries & roastery',
    icon: <Utensils className="w-5 h-5" />,
    itemCount: 48,
  },
  {
    id: 'Grocery',
    name: 'Fresh Grocery',
    subtitle: 'Organic farm produce & pantry',
    icon: <ShoppingCart className="w-5 h-5" />,
    itemCount: 65,
  },
  {
    id: 'Convenience',
    name: 'Convenience',
    subtitle: 'Daily beverages, snacks & 24/7',
    icon: <Store className="w-5 h-5" />,
    itemCount: 34,
  },
  {
    id: 'Pharmacy',
    name: 'Pharmacy & Care',
    subtitle: 'Vitamins, remedies & first aid',
    icon: <Pill className="w-5 h-5" />,
    itemCount: 29,
  },
  {
    id: 'Retail',
    name: 'Retail & Lifestyle',
    subtitle: 'Fashion apparel & daily goods',
    icon: <ShoppingBag className="w-5 h-5" />,
    itemCount: 42,
  },
  {
    id: 'Flowers & Gifts',
    name: 'Flowers & Gifts',
    subtitle: 'Fresh floral blooms & hampers',
    icon: <Flower2 className="w-5 h-5" />,
    itemCount: 18,
  },
  {
    id: 'Pet Care',
    name: 'Pet Care',
    subtitle: 'Nutrition, hygiene & toys',
    icon: <PawPrint className="w-5 h-5" />,
    itemCount: 24,
  },
  {
    id: 'Beauty & Wellness',
    name: 'Beauty & Wellness',
    subtitle: 'Clean skincare, serums & suncare',
    icon: <Sparkles className="w-5 h-5" />,
    itemCount: 38,
  },
  {
    id: 'Home & Office',
    name: 'Home & Office',
    subtitle: 'Ergonomics, humidifiers & paper',
    icon: <Building2 className="w-5 h-5" />,
    itemCount: 31,
  },
  {
    id: 'Electronics',
    name: 'Electronics',
    subtitle: 'Audio earbuds, cables & power',
    icon: <Laptop className="w-5 h-5" />,
    itemCount: 27,
  },
  {
    id: 'Local Services',
    name: 'Local Services',
    subtitle: 'Aircon cleaning & home repairs',
    icon: <Layers className="w-5 h-5" />,
    itemCount: 19,
  },
  {
    id: 'TOGO Padala',
    name: 'TOGO Padala',
    subtitle: 'Express courier & parcel move',
    icon: <Truck className="w-5 h-5 text-[#F4B400]" />,
    itemCount: 12,
  },
];

interface CategoryGridProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onPadalaClick: () => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategory,
  onSelectCategory,
  onPadalaClick,
}) => {
  return (
    <section className="space-y-4">
      {/* Category Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#2E2E2E] dark:text-white tracking-tight">
            Browse by Category
          </h2>
          <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-0.5">
            Discover verified merchant partners and logistics services across 12 dedicated sectors.
          </p>
        </div>

        {/* View All / Reset Filter Action */}
        <div className="flex items-center gap-2">
          {selectedCategory !== 'All' && (
            <button
              onClick={() => onSelectCategory('All')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#EBEEEE] dark:bg-neutral-800 text-[#2E2E2E] dark:text-neutral-200 hover:bg-[#EBEEEE]/80 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Show All Items</span>
            </button>
          )}
          <span className="text-xs font-mono text-neutral-400 font-semibold hidden sm:inline">
            12 Categories
          </span>
        </div>
      </div>

      {/* Spacious Responsive Grid: 6 cards per row desktop, 4 tablet, 2 mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {CATEGORIES_DATA.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const isPadala = cat.id === 'TOGO Padala';

          return (
            <button
              key={cat.id}
              onClick={() => {
                if (isPadala) {
                  onPadalaClick();
                } else {
                  onSelectCategory(cat.id);
                }
              }}
              className={`p-4 rounded-2xl text-left flex flex-col justify-between transition-all duration-200 group active:scale-[0.98] border shadow-2xs hover:shadow-md cursor-pointer ${
                isSelected
                  ? 'bg-white dark:bg-neutral-850 border-[#F4B400] ring-2 ring-[#F4B400] shadow-sm'
                  : 'bg-white dark:bg-[#1C1C1C] border-[#EBEEEE] dark:border-neutral-800 hover:border-[#F4B400]/60 dark:hover:border-[#F4B400]/60'
              }`}
              aria-pressed={isSelected}
            >
              <div>
                {/* Icon Container */}
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors duration-200 mb-3 ${
                    isSelected
                      ? 'bg-[#F4B400] text-[#2E2E2E]'
                      : 'bg-[#EBEEEE] dark:bg-neutral-800 text-[#2E2E2E] dark:text-neutral-200 group-hover:bg-[#F4B400] group-hover:text-[#2E2E2E]'
                  }`}
                >
                  {cat.icon}
                </div>

                {/* Category Title */}
                <h3
                  className={`text-xs sm:text-sm font-bold line-clamp-1 transition-colors ${
                    isSelected
                      ? 'text-[#F4B400]'
                      : 'text-[#2E2E2E] dark:text-white group-hover:text-[#F4B400]'
                  }`}
                >
                  {cat.name}
                </h3>

                {/* Subtitle / Descriptor */}
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1 leading-snug font-normal">
                  {cat.subtitle}
                </p>
              </div>

              {/* Status footer inside card */}
              <div className="pt-3 mt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-neutral-400">
                  {isPadala ? 'Instant Courier' : `${cat.itemCount} items`}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-[#F4B400] animate-pulse" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
