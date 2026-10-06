import React, { useState } from 'react';
import { useApp, ActivePortal } from '../../context/AppContext';
import { Logo } from '../brand/Logo';
import { CloudSyncIndicator } from './CloudSyncIndicator';
import {
  Sun,
  Moon,
  ShoppingCart,
  Search,
  Command,
  HelpCircle,
  User,
  ShieldCheck,
  ChevronDown,
  Layers,
  BarChart3,
  Menu,
  X,
  Truck,
  Store,
  CreditCard,
  Cpu,
  ShoppingBag
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
    { id: 'ai-center', label: 'AI Command', icon: <Cpu className="w-4 h-4" /> },
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
        <div className="flex items-center justify-between h-16">
          {/* ZONE 1: BRAND LOGO */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActivePortal('marketplace')}
              className="focus:outline-none focus:ring-2 focus:ring-[#D9A514] rounded-lg p-1 transition-transform active:scale-95 text-left"
              aria-label="TOGOSERVE Home"
            >
              <Logo
                variant={activePortal === 'merchant' ? 'business' : 'horizontal'}
                isDark={true}
                size="md"
                showSlogan={false}
              />
            </button>
          </div>

          {/* ZONE 2: PRIMARY NAVIGATION LINKS (Single-line, clear labels) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {portals.map((p) => {
              const isActive = activePortal === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePortal(p.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFC928] ${
                    isActive
                      ? 'bg-[#FFC928] text-[#071A2F] shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {p.icon}
                  <span>{p.label}</span>
                </button>
              );
            })}
          </nav>

          {/* ZONE 3: TOP-RIGHT CORNER ACCESSIBILITY & CONTROLS */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Cloud Sync State Loading/Synced Indicator */}
            <CloudSyncIndicator />

            {/* Quick Command Launcher (Ctrl+K) */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 bg-white/5 hover:bg-white/10 border border-slate-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#D9A514]"
              title="Command Palette (Ctrl + K)"
              aria-label="Open command palette"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline text-[11px]">Search</span>
              <kbd className="hidden md:inline-flex items-center font-mono text-[9px] bg-white/10 px-1 py-0.5 rounded text-slate-300 border border-slate-700">
                ⌘K
              </kbd>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-300 hover:text-[#FFC928] hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFC928]"
              title={isDarkMode ? 'Switch to Light Mode (Alt+D)' : 'Switch to Dark Mode (Alt+D)'}
              aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-[#FFC928]" />
              ) : (
                <Moon className="w-4 h-4 text-slate-200" />
              )}
            </button>

            {/* Keyboard Shortcuts Helper */}
            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="hidden sm:inline-flex p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFC928]"
              title="Keyboard Shortcuts (?)"
              aria-label="Keyboard Shortcuts"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFC928]"
              title={`Cart (${cartItemCount} items)`}
              aria-label={`View shopping cart with ${cartItemCount} items`}
            >
              <ShoppingCart className="w-4 h-4" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FFC928] text-[#071A2F] text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Top-Right Profile / OAuth Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-1.5 pl-2 pr-2.5 py-1 bg-white/5 hover:bg-white/10 border border-slate-700/80 rounded-full text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-[#D9A514]"
                  aria-expanded={isProfileMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-6 h-6 rounded-full bg-[#D9A514] text-[#071A2F] font-bold flex items-center justify-center text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="hidden md:inline font-medium text-slate-200 max-w-[100px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
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

                    <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Role (RBAC Simulation)
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFC928] hover:bg-[#D9A514] text-[#071A2F] text-xs font-bold rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFC928]"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D9A514]"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 py-3 space-y-1">
            {portals.map((p) => {
              const isActive = activePortal === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setActivePortal(p.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#FFC928] text-[#071A2F] font-bold'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {p.icon}
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
