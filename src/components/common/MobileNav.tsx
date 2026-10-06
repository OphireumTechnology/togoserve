import React from 'react';
import { useApp, ActivePortal } from '../../context/AppContext';
import { ShoppingBag, Truck, Store, CreditCard, Cpu, BarChart3, ShoppingCart } from 'lucide-react';

export const MobileNav: React.FC<{
  onOpenCart: () => void;
}> = ({ onOpenCart }) => {
  const { activePortal, setActivePortal, cartItemCount } = useApp();

  const navItems: { id: ActivePortal; label: string; icon: React.ReactNode }[] = [
    { id: 'marketplace', label: 'Shop', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'padala', label: 'Padala', icon: <Truck className="w-5 h-5" /> },
    { id: 'merchant', label: 'Business', icon: <Store className="w-5 h-5" /> },
    { id: 'pos', label: 'POS', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'ai-center', label: 'AI', icon: <Cpu className="w-5 h-5" /> },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#071A2F] border-t border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-pb">
      {navItems.map((item) => {
        const isActive = activePortal === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActivePortal(item.id)}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all focus:outline-none min-w-[56px] min-h-[48px] ${
              isActive
                ? 'text-[#FFC928] font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.icon}
            <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
          </button>
        );
      })}

      {/* Cart button */}
      <button
        onClick={onOpenCart}
        className="relative flex flex-col items-center justify-center p-1.5 rounded-xl text-slate-400 hover:text-slate-200 min-w-[56px] min-h-[48px]"
        aria-label="Open Shopping Basket"
      >
        <ShoppingCart className="w-5 h-5" />
        {cartItemCount > 0 && (
          <span className="absolute top-1 right-2.5 bg-[#FFC928] text-[#071A2F] text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
            {cartItemCount}
          </span>
        )}
        <span className="text-[10px] tracking-tight mt-0.5">Basket</span>
      </button>
    </div>
  );
};
