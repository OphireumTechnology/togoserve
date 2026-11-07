import React from 'react';
import { useApp, ActivePortal } from '../../context/AppContext';
import { ShoppingBag, Truck, ShoppingCart, Lock, Briefcase, LayoutDashboard } from 'lucide-react';

export const MobileNav: React.FC<{
  onOpenCart: () => void;
}> = ({ onOpenCart }) => {
  const {
    activePortal,
    setActivePortal,
    cartItemCount,
    currentUser,
    enterpriseSession,
    setIsEnterpriseLoginOpen,
  } = useApp();

  const isEnterprise = Boolean(enterpriseSession || (currentUser && currentUser.role !== 'CUSTOMER'));

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#181818] border-t border-[#EBEEEE] dark:border-neutral-800 px-2 py-1.5 flex items-center justify-around shadow-lg safe-area-pb transition-colors">
      {/* 1. Public Marketplace */}
      <button
        onClick={() => setActivePortal('marketplace')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all focus:outline-none min-w-[56px] min-h-[48px] ${
          activePortal === 'marketplace'
            ? 'text-[#F4B400] font-bold scale-105'
            : 'text-[#64748B] dark:text-neutral-400 hover:text-[#2E2E2E] dark:hover:text-white'
        }`}
      >
        <ShoppingBag className="w-5 h-5" />
        <span className="text-[10px] tracking-tight mt-0.5">Shop</span>
      </button>

      {/* 2. TOGO Padala */}
      <button
        onClick={() => setActivePortal('padala')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all focus:outline-none min-w-[56px] min-h-[48px] ${
          activePortal === 'padala'
            ? 'text-[#F4B400] font-bold scale-105'
            : 'text-[#64748B] dark:text-neutral-400 hover:text-[#2E2E2E] dark:hover:text-white'
        }`}
      >
        <Truck className="w-5 h-5" />
        <span className="text-[10px] tracking-tight mt-0.5">Padala</span>
      </button>

      {/* 3. Solutions or Enterprise Dashboard */}
      {isEnterprise ? (
        <button
          onClick={() => {
            if (currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'AI_SUPERVISOR') {
              setActivePortal('ai-center');
            } else if (currentUser?.role.startsWith('MERCHANT')) {
              setActivePortal('merchant');
            } else if (currentUser?.role === 'RIDER' || currentUser?.role === 'LOGISTICS_ADMIN') {
              setActivePortal('rider');
            } else {
              setActivePortal('admin');
            }
          }}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all focus:outline-none min-w-[56px] min-h-[48px] ${
            ['merchant', 'pos', 'rider', 'fleet', 'ai-center', 'admin', 'analytics'].includes(activePortal)
              ? 'text-[#F4B400] font-bold scale-105'
              : 'text-[#64748B] dark:text-neutral-400 hover:text-[#2E2E2E] dark:hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">Workspace</span>
        </button>
      ) : (
        <button
          onClick={() => setActivePortal('landing')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all focus:outline-none min-w-[56px] min-h-[48px] ${
            activePortal === 'landing'
              ? 'text-[#F4B400] font-bold scale-105'
              : 'text-[#64748B] dark:text-neutral-400 hover:text-[#2E2E2E] dark:hover:text-white'
          }`}
        >
          <Briefcase className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">Solutions</span>
        </button>
      )}

      {/* 4. Cart Button */}
      <button
        onClick={onOpenCart}
        className="relative flex flex-col items-center justify-center p-1.5 rounded-xl text-[#64748B] dark:text-neutral-400 hover:text-[#2E2E2E] dark:hover:text-white min-w-[56px] min-h-[48px]"
        aria-label="Open Shopping Basket"
      >
        <ShoppingCart className="w-5 h-5" />
        {cartItemCount > 0 && (
          <span className="absolute top-1 right-2.5 bg-[#F4B400] text-[#2E2E2E] text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
            {cartItemCount}
          </span>
        )}
        <span className="text-[10px] tracking-tight mt-0.5">Basket</span>
      </button>

      {/* 5. Enterprise Gateway Access (or Account) */}
      {!isEnterprise && (
        <button
          onClick={() => setIsEnterpriseLoginOpen(true)}
          className="flex flex-col items-center justify-center p-1.5 rounded-xl text-[#64748B] dark:text-neutral-400 hover:text-[#F4B400] min-w-[56px] min-h-[48px]"
          aria-label="Enterprise Login"
        >
          <Lock className="w-5 h-5 text-[#F4B400]" />
          <span className="text-[10px] tracking-tight mt-0.5">Enterprise</span>
        </button>
      )}
    </div>
  );
};
