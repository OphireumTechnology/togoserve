import React, { useState } from 'react';
import { useApp, ActivePortal } from '../../context/AppContext';
import { BrandLogo } from '../brand/BrandLogo';
import { CloudSyncIndicator } from './CloudSyncIndicator';
import {
  Sun,
  Moon,
  ShoppingCart,
  Search,
  HelpCircle,
  User,
  ShieldCheck,
  ChevronDown,
  BarChart3,
  Menu,
  X,
  Truck,
  Store,
  CreditCard,
  Cpu,
  ShoppingBag,
  Building2,
  PackageCheck
} from 'lucide-react';
import { UserRole } from '../../types';

export const Header: React.FC<{
  onOpenCart: () => void;
}> = ({ onOpenCart }) => {
  const {
    isDarkMode,
    toggleDarkMode,
    activePortal,
    setActivePortal,
    currentUser,
    switchRole,
    setIsAuthModalOpen,
    setIsCommandPaletteOpen,
    setIsShortcutsOpen,
    cartItemCount,
    logout,
  } = useApp();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const portals: { id: ActivePortal; label: string; icon: React.ReactNode }[] = [
    { id: 'marketplace', label: 'Marketplace', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'padala', label: 'TOGO Padala', icon: <Truck className="w-4 h-4" /> },
    { id: 'merchant', label: 'Merchant OS', icon: <Store className="w-4 h-4" /> },
    { id: 'pos', label: 'POS Terminal', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'rider', label: 'Rider Hub', icon: <Truck className="w-4 h-4" /> },
    { id: 'supplier', label: 'Suppliers', icon: <Building2 className="w-4 h-4" /> },
    { id: 'fleet', label: 'Fleet Ops', icon: <PackageCheck className="w-4 h-4" /> },
    { id: 'ai-center', label: 'TOGOSERVE AI', icon: <Cpu className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const roles: UserRole[] = [
    'CUSTOMER',
    'MERCHANT_OWNER',
    'MERCHANT_STAFF',
    'RIDER',
    'FINANCE',
    'SUPPORT',
    'ADMIN',
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#071A2F] text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* ZONE 1: OFFICIAL BRAND LOGO (Single Source of Truth) */}
          <div className="flex items-center gap-2 shrink-0 min-w-0">
            <button
              onClick={() => setActivePortal('landing')}
              className="focus:outline-none focus:ring-2 focus:ring-[#D9A514] rounded-lg p-1 transition-transform active:scale-95 text-left shrink-0"
              aria-label="TOGOSERVE Home"
            >
              {/* Desktop & Tablet: Full Horizontal Logo */}
              <div className="hidden sm:block">
                <BrandLogo variant="horizontal" theme="dark" size="sm" showSlogan={false} />
              </div>
              {/* Mobile (320px - 639px): Perfectly scaled horizontal logo, no compression */}
              <div className="block sm:hidden">
                <BrandLogo variant="horizontal" theme="dark" size="xs" showSlogan={false} />
              </div>
            </button>
          </div>

          {/* ZONE 2: PRIMARY NAVIGATION LINKS (Desktop only, single line) */}
          <nav className="hidden xl:flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {portals.slice(0, 7).map((p) => {
              const isActive = activePortal === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePortal(p.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFC928] ${
                    isActive
                      ? 'bg-[#FFC928] text-[#071A2F] font-bold shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {p.icon}
                  <span>{p.label}</span>
                </button>
              );
            })}
          </nav>

          {/* ZONE 3: TOP-RIGHT CORNER CONTROLS (Clean, no overlap, responsive) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Cloud Sync State (Hidden on extra small mobile to save space) */}
            <div className="hidden md:block">
              <CloudSyncIndicator />
            </div>

            {/* Quick Command Launcher (Ctrl+K) */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 px-2 py-1 text-xs text-slate-300 bg-white/5 hover:bg-white/10 border border-slate-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#D9A514]"
              title="Command Palette (Ctrl + K)"
              aria-label="Open command palette"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px]">Search</span>
              <kbd className="font-mono text-[9px] bg-white/10 px-1 py-0.5 rounded text-slate-300 border border-slate-700">
                ⌘K
              </kbd>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1.5 sm:p-2 text-slate-300 hover:text-[#FFC928] hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFC928]"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle color theme"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-[#FFC928]" />
              ) : (
                <Moon className="w-4 h-4 text-slate-200" />
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-1.5 sm:p-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFC928]"
              title={`Basket (${cartItemCount} items)`}
              aria-label={`View shopping basket with ${cartItemCount} items`}
            >
              <ShoppingCart className="w-4 h-4" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FFC928] text-[#071A2F] text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Profile / Sign In Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 bg-white/5 hover:bg-white/10 border border-slate-700/80 rounded-full text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-[#D9A514]"
                  aria-expanded={isProfileMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-6 h-6 rounded-full bg-[#D9A514] text-[#071A2F] font-bold flex items-center justify-center text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline font-medium text-slate-200 max-w-[80px] truncate text-[11px]">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:inline" />
                </button>

                {isProfileMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-[#071A2F] border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-slate-200"
                    role="menu"
                  >
                    <div className="px-3 py-2 border-b border-slate-700/80 mb-2">
                      <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono truncate">{currentUser.email}</p>
                      <div className="mt-1 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-[#16845B]" />
                        <span className="text-[10px] text-emerald-400 font-medium">
                          Cloud OAuth 2.0 Verified
                        </span>
                      </div>
                    </div>

                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Role-Based Workspace
                    </div>
                    <div className="grid grid-cols-1 gap-0.5 mb-2">
                      {roles.map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            switchRole(r);
                            setIsProfileMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-colors flex items-center justify-between ${
                            currentUser.role === r
                              ? 'bg-[#D9A514]/20 text-[#FFC928] font-bold'
                              : 'text-slate-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <span>{r}</span>
                          {currentUser.role === r && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC928]"></span>
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-slate-700/80 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-[#D64545] hover:bg-rose-950/40 rounded-md font-semibold transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-[#FFC928] hover:bg-[#D9A514] text-[#071A2F] text-xs font-bold rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFC928] whitespace-nowrap shrink-0"
              >
                <User className="w-3.5 h-3.5 shrink-0" />
                <span className="text-xs">Sign In</span>
              </button>
            )}

            {/* Mobile / Tablet Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-1.5 sm:p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D9A514]"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Responsive Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-800 py-3 space-y-1">
            <div className="px-3 pb-2 flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 mb-2">
              <span>Cloud Status</span>
              <CloudSyncIndicator />
            </div>

            <div className="grid grid-cols-2 gap-1 px-1">
              {portals.map((p) => {
                const isActive = activePortal === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActivePortal(p.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#FFC928] text-[#071A2F] font-bold'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {p.icon}
                    <span className="truncate">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
