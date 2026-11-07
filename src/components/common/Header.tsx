import React, { useState, useRef, useEffect } from 'react';
import { useApp, ActivePortal } from '../../context/AppContext';
import { Logo } from '../brand/Logo';
import { CloudSyncIndicator } from './CloudSyncIndicator';
import {
  Sun,
  Moon,
  ShoppingCart,
  Search,
  ChevronDown,
  Menu,
  X,
  Truck,
  Store,
  CreditCard,
  Cpu,
  ShoppingBag,
  Building2,
  PackageCheck,
  BarChart3,
  ShieldCheck,
  User,
  Layers
} from 'lucide-react';
import { UserRole } from '../../types';

interface PortalOption {
  id: ActivePortal;
  label: string;
  category: 'primary' | 'business' | 'platform';
  description: string;
  icon: React.ReactNode;
}

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
    cartItemCount,
    logout,
  } = useApp();

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const moreMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const primaryPortals: { id: ActivePortal; label: string; icon: React.ReactNode }[] = [
    { id: 'marketplace', label: 'Marketplace', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'padala', label: 'TOGO Padala', icon: <Truck className="w-4 h-4" /> },
    { id: 'merchant', label: 'Merchant OS', icon: <Store className="w-4 h-4" /> },
    { id: 'rider', label: 'Rider Hub', icon: <Truck className="w-4 h-4" /> },
  ];

  const secondaryPortals: PortalOption[] = [
    {
      id: 'pos',
      label: 'POS Register',
      category: 'business',
      description: 'Point-of-Sale cash counter & SKU checkout',
      icon: <CreditCard className="w-4 h-4 text-[#F4B400]" />,
    },
    {
      id: 'fleet',
      label: 'Fleet Operations',
      category: 'business',
      description: 'Dispatch, multi-rider routing & SLA telemetry',
      icon: <PackageCheck className="w-4 h-4 text-[#F4B400]" />,
    },
    {
      id: 'supplier',
      label: 'B2B Wholesale',
      category: 'business',
      description: 'Bulk inventory supply catalog & procurement',
      icon: <Building2 className="w-4 h-4 text-[#2E2E2E] dark:text-[#EBEEEE]" />,
    },
    {
      id: 'ai-center',
      label: 'A00 AI Supervisor',
      category: 'platform',
      description: 'Governed autonomous agent approval & policies',
      icon: <Cpu className="w-4 h-4 text-[#F4B400]" />,
    },
    {
      id: 'analytics',
      label: 'Executive Analytics',
      category: 'platform',
      description: 'Real-time GMV, funnels & audit reporting',
      icon: <BarChart3 className="w-4 h-4 text-[#16845B]" />,
    },
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

  const isSecondaryActive = secondaryPortals.some((p) => p.id === activePortal);
  const activeSecondaryItem = secondaryPortals.find((p) => p.id === activePortal);

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#181818] text-[#2E2E2E] dark:text-[#FAFAFA] border-b border-[#EBEEEE] dark:border-neutral-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* ======================================================== */}
          {/* ZONE 1: OFFICIAL TOGOSERVE HORIZONTAL LOGO               */}
          {/* Displayed sharply, uncropped, with generous space        */}
          {/* ======================================================== */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActivePortal('landing')}
              className="focus:outline-none focus:ring-2 focus:ring-[#F4B400] rounded-xl transition-transform active:scale-95 text-left flex items-center py-1"
              aria-label="TOGOSERVE Home"
            >
              <Logo
                variant="header"
                theme={isDarkMode ? 'dark' : 'light'}
                size="md"
                className="hover:opacity-95 transition-opacity"
              />
            </button>
          </div>

          {/* ======================================================== */}
          {/* ZONE 2: DESKTOP STREAMLINED NAVIGATION                   */}
          {/* Consistent typography, gold active highlights            */}
          {/* ======================================================== */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {primaryPortals.map((p) => {
              const isActive = activePortal === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePortal(p.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-[#F4B400] ${
                    isActive
                      ? 'bg-[#F4B400] text-[#2E2E2E] font-bold shadow-xs'
                      : 'text-[#2E2E2E] dark:text-neutral-200 hover:text-[#2E2E2E] hover:bg-[#EBEEEE] dark:hover:bg-neutral-800'
                  }`}
                >
                  <span className={isActive ? 'text-[#2E2E2E]' : 'text-[#64748B] dark:text-neutral-400'}>
                    {p.icon}
                  </span>
                  <span>{p.label}</span>
                </button>
              );
            })}

            {/* Dropdown for More Platform Ecosystem Modules */}
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-[#F4B400] ${
                  isSecondaryActive
                    ? 'bg-[#F4B400] text-[#2E2E2E] font-bold shadow-xs'
                    : 'text-[#2E2E2E] dark:text-neutral-200 hover:text-[#2E2E2E] hover:bg-[#EBEEEE] dark:hover:bg-neutral-800'
                }`}
                aria-expanded={isMoreMenuOpen}
                aria-haspopup="true"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isSecondaryActive && activeSecondaryItem ? activeSecondaryItem.label : 'Solutions'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMoreMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMoreMenuOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-[#1E1E1E] border border-[#EBEEEE] dark:border-neutral-800 rounded-2xl shadow-xl p-2 z-50 text-[#2E2E2E] dark:text-neutral-200 animate-in fade-in-50 zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-[#64748B] dark:text-neutral-400 uppercase tracking-wider border-b border-[#EBEEEE] dark:border-neutral-800 mb-1">
                    Enterprise Solutions
                  </div>
                  <div className="space-y-1">
                    {secondaryPortals.map((item) => {
                      const isItemActive = activePortal === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActivePortal(item.id);
                            setIsMoreMenuOpen(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl transition-colors flex items-start gap-2.5 ${
                            isItemActive
                              ? 'bg-[#EBEEEE] dark:bg-neutral-800 font-bold border border-[#F4B400]/40'
                              : 'hover:bg-[#EBEEEE]/60 dark:hover:bg-neutral-800/60'
                          }`}
                        >
                          <div className="p-1.5 rounded-lg bg-[#EBEEEE] dark:bg-neutral-800 shrink-0 mt-0.5">
                            {item.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-[#2E2E2E] dark:text-neutral-100">{item.label}</span>
                              {isItemActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#F4B400]"></span>
                              )}
                            </div>
                            <p className="text-[10px] text-[#64748B] dark:text-neutral-400 line-clamp-1">
                              {item.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* ======================================================== */}
          {/* ZONE 3: ACTIONS & CONTROLS (Clean, Polished)             */}
          {/* ======================================================== */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Cloud Sync State */}
            <div className="hidden md:flex items-center">
              <CloudSyncIndicator />
            </div>

            {/* Quick Command Launcher (Ctrl+K) */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs text-[#2E2E2E] dark:text-neutral-200 bg-[#EBEEEE]/70 dark:bg-neutral-800 hover:bg-[#EBEEEE] dark:hover:bg-neutral-700 border border-[#EBEEEE] dark:border-neutral-700 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
              title="Search & Command Palette (Ctrl + K)"
              aria-label="Open command palette"
            >
              <Search className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="text-[11px] font-medium hidden md:inline">Search</span>
              <kbd className="font-mono text-[9px] bg-white dark:bg-neutral-900 px-1.5 py-0.5 rounded text-[#2E2E2E] dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 font-semibold">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle (Dark / Light) */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 text-[#2E2E2E] dark:text-neutral-300 hover:bg-[#EBEEEE] dark:hover:bg-neutral-800 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
              title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle color theme"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-[#F4B400]" />
              ) : (
                <Moon className="w-4 h-4 text-[#2E2E2E]" />
              )}
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 text-[#2E2E2E] dark:text-neutral-300 hover:bg-[#EBEEEE] dark:hover:bg-neutral-800 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
              title={`Cart (${cartItemCount} items)`}
              aria-label={`View cart with ${cartItemCount} items`}
            >
              <ShoppingCart className="w-4 h-4" />
              {cartItemCount > 0 && (
                <span className="absolute 1 top-1 right-1 bg-[#F4B400] text-[#2E2E2E] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth Switcher */}
            {currentUser ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 bg-[#EBEEEE]/70 dark:bg-neutral-800 hover:bg-[#EBEEEE] dark:hover:bg-neutral-700 border border-[#EBEEEE] dark:border-neutral-700 rounded-full text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
                  aria-expanded={isProfileMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-6 h-6 rounded-full bg-[#F4B400] text-[#2E2E2E] font-bold flex items-center justify-center text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden sm:flex flex-col text-left leading-none">
                    <span className="font-semibold text-[#2E2E2E] dark:text-neutral-100 text-[11px] max-w-[85px] truncate">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-[#F4B400] font-bold uppercase tracking-wider">
                      {currentUser.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-[#64748B] hidden sm:inline" />
                </button>

                {isProfileMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1E1E1E] border border-[#EBEEEE] dark:border-neutral-800 rounded-2xl shadow-xl p-2 z-50 text-[#2E2E2E] dark:text-neutral-200"
                    role="menu"
                  >
                    <div className="px-3 py-2.5 border-b border-[#EBEEEE] dark:border-neutral-800 mb-2">
                      <p className="text-xs font-bold text-[#2E2E2E] dark:text-neutral-100 truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-[#64748B] dark:text-neutral-400 font-mono truncate">{currentUser.email}</p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#16845B]" />
                        <span className="text-[10px] text-[#16845B] font-medium">
                          Cloud Identity OAuth Verified
                        </span>
                      </div>
                    </div>

                    <div className="px-3 py-1 text-[10px] font-bold text-[#64748B] dark:text-neutral-400 uppercase tracking-wider">
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
                          className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center justify-between ${
                            currentUser.role === r
                              ? 'bg-[#F4B400]/20 text-[#2E2E2E] dark:text-[#F4B400] font-bold'
                              : 'hover:bg-[#EBEEEE] dark:hover:bg-neutral-800'
                          }`}
                        >
                          <span>{r}</span>
                          {currentUser.role === r && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F4B400]"></span>
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-[#EBEEEE] dark:border-neutral-800 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg font-semibold transition-colors"
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
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F4B400] hover:bg-[#FFD54F] text-[#2E2E2E] text-xs font-bold rounded-xl shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-[#F4B400] whitespace-nowrap active:scale-95"
              >
                <User className="w-3.5 h-3.5 shrink-0" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile / Tablet Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#2E2E2E] dark:text-neutral-200 hover:bg-[#EBEEEE] dark:hover:bg-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-[#2E2E2E] dark:text-neutral-100" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RESPONSIVE MOBILE MENU DRAWER                            */}
        {/* ======================================================== */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#EBEEEE] dark:border-neutral-800 py-3 space-y-3">
            <div className="px-2 flex items-center justify-between text-xs text-[#64748B] pb-2 border-b border-[#EBEEEE] dark:border-neutral-800">
              <span className="text-xs">Cloud Status</span>
              <CloudSyncIndicator />
            </div>

            <div>
              <p className="px-2 text-[10px] font-bold text-[#64748B] dark:text-neutral-400 uppercase tracking-wider mb-1.5">
                Core Portals
              </p>
              <div className="grid grid-cols-2 gap-1.5 px-1">
                {primaryPortals.map((p) => {
                  const isActive = activePortal === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActivePortal(p.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-[#F4B400] text-[#2E2E2E] font-bold'
                          : 'text-[#2E2E2E] dark:text-neutral-200 hover:bg-[#EBEEEE] dark:hover:bg-neutral-800'
                      }`}
                    >
                      {p.icon}
                      <span className="truncate">{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="px-2 text-[10px] font-bold text-[#64748B] dark:text-neutral-400 uppercase tracking-wider mb-1.5">
                Business & Platform Solutions
              </p>
              <div className="grid grid-cols-1 gap-1 px-1">
                {secondaryPortals.map((p) => {
                  const isActive = activePortal === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActivePortal(p.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-[#EBEEEE] dark:bg-neutral-800 text-[#2E2E2E] dark:text-neutral-100 font-bold border border-[#F4B400]/40'
                          : 'text-[#2E2E2E] dark:text-neutral-200 hover:bg-[#EBEEEE] dark:hover:bg-neutral-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {p.icon}
                        <span>{p.label}</span>
                      </div>
                      <span className="text-[10px] text-[#64748B] dark:text-neutral-400">{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
