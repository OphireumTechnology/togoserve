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
  ExternalLink,
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
      icon: <CreditCard className="w-4 h-4 text-[#FFC928]" />,
    },
    {
      id: 'fleet',
      label: 'Fleet Operations',
      category: 'business',
      description: 'Dispatch, multi-rider routing & SLA telemetry',
      icon: <PackageCheck className="w-4 h-4 text-[#D9A514]" />,
    },
    {
      id: 'supplier',
      label: 'B2B Wholesale',
      category: 'business',
      description: 'Bulk inventory supply catalog & procurement',
      icon: <Building2 className="w-4 h-4 text-sky-400" />,
    },
    {
      id: 'ai-center',
      label: 'A00 AI Supervisor',
      category: 'platform',
      description: 'Governed autonomous agent approval & policies',
      icon: <Cpu className="w-4 h-4 text-purple-400" />,
    },
    {
      id: 'analytics',
      label: 'Executive Analytics',
      category: 'platform',
      description: 'Real-time GMV, funnels & audit reporting',
      icon: <BarChart3 className="w-4 h-4 text-emerald-400" />,
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
    <header className="sticky top-0 z-40 w-full bg-[#071A2F] text-white border-b border-slate-800/80 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* ======================================================== */}
          {/* ZONE 1: MANDATORY OFFICIAL TOGOSERVE LOGO                */}
          {/* Unstretched, uncropped, exact official Navy/Gold asset   */}
          {/* ======================================================== */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActivePortal('landing')}
              className="focus:outline-none focus:ring-2 focus:ring-[#FFC928] rounded-lg transition-transform active:scale-95 text-left flex items-center"
              aria-label="TOGOSERVE Home"
            >
              <Logo
                variant="default"
                size="sm"
                className="hover:opacity-95 transition-opacity"
              />
            </button>
          </div>

          {/* ======================================================== */}
          {/* ZONE 2: DESKTOP STREAMLINED NAVIGATION                   */}
          {/* Clean, spacious, uncrowded, uncluttered                  */}
          {/* ======================================================== */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {primaryPortals.map((p) => {
              const isActive = activePortal === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePortal(p.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-[#FFC928] ${
                    isActive
                      ? 'bg-[#FFC928] text-[#071A2F] font-bold shadow-sm'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {p.icon}
                  <span>{p.label}</span>
                </button>
              );
            })}

            {/* Dropdown for More Platform Ecosystem Modules */}
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-[#FFC928] ${
                  isSecondaryActive
                    ? 'bg-[#FFC928] text-[#071A2F] font-bold shadow-sm'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
                aria-expanded={isMoreMenuOpen}
                aria-haspopup="true"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isSecondaryActive && activeSecondaryItem ? activeSecondaryItem.label : 'Solutions'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMoreMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMoreMenuOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-[#071A2F] border border-slate-700/80 rounded-xl shadow-2xl p-2 z-50 text-slate-200 backdrop-blur-md">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700/60 mb-1">
                    Ecosystem Modules
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
                          className={`w-full text-left p-2.5 rounded-lg transition-colors flex items-start gap-2.5 ${
                            isItemActive
                              ? 'bg-white/15 text-white font-bold border border-slate-600'
                              : 'hover:bg-white/10 text-slate-300 hover:text-white'
                          }`}
                        >
                          <div className="p-1 rounded-md bg-white/5 shrink-0 mt-0.5">
                            {item.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold">{item.label}</span>
                              {isItemActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FFC928]"></span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 line-clamp-1">
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
          {/* ZONE 3: TOP-RIGHT CONTROLS (Clean, Neat, Spacious)       */}
          {/* ======================================================== */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Cloud Sync State (Clean, minimal) */}
            <div className="hidden md:flex items-center">
              <CloudSyncIndicator />
            </div>

            {/* Quick Command Launcher (Ctrl+K) */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 bg-white/5 hover:bg-white/10 border border-slate-700/80 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFC928]"
              title="Quick Search & Actions (Ctrl + K)"
              aria-label="Open command palette"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-medium hidden md:inline">Search</span>
              <kbd className="font-mono text-[9px] bg-white/10 px-1 py-0.5 rounded text-slate-300 border border-slate-700">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle (Dark / Light) */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-300 hover:text-[#FFC928] hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFC928]"
              title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle color theme"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-[#FFC928]" />
              ) : (
                <Moon className="w-4 h-4 text-slate-200" />
              )}
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFC928]"
              title={`Cart (${cartItemCount} items)`}
              aria-label={`View cart with ${cartItemCount} items`}
            >
              <ShoppingCart className="w-4 h-4" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FFC928] text-[#071A2F] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Profile / Cloud Auth Switcher */}
            {currentUser ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1 bg-white/5 hover:bg-white/10 border border-slate-700/80 rounded-full text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFC928]"
                  aria-expanded={isProfileMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-6 h-6 rounded-full bg-[#FFC928] text-[#071A2F] font-bold flex items-center justify-center text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden sm:flex flex-col text-left leading-none">
                    <span className="font-semibold text-white text-[11px] max-w-[85px] truncate">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-[#FFC928] font-bold uppercase tracking-wider">
                      {currentUser.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:inline" />
                </button>

                {isProfileMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-[#071A2F] border border-slate-700/90 rounded-xl shadow-2xl p-2 z-50 text-slate-200 backdrop-blur-md"
                    role="menu"
                  >
                    <div className="px-3 py-2.5 border-b border-slate-700/80 mb-2">
                      <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono truncate">{currentUser.email}</p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400 font-medium">
                          Cloud Identity OAuth Verified
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
                              ? 'bg-[#FFC928]/20 text-[#FFC928] font-bold'
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
                        className="w-full text-left px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-950/40 rounded-md font-semibold transition-colors"
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFC928] hover:bg-[#D9A514] text-[#071A2F] text-xs font-bold rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#FFC928] whitespace-nowrap active:scale-95"
              >
                <User className="w-3.5 h-3.5 shrink-0" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile / Tablet Menu Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC928]"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RESPONSIVE MOBILE / TABLET MENU DRAWER                   */}
        {/* ======================================================== */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 py-3 space-y-3">
            <div className="px-2 flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
              <span className="text-slate-400 text-xs">Cloud Status</span>
              <CloudSyncIndicator />
            </div>

            <div>
              <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
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

            <div>
              <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
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
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-white/15 text-white font-bold border border-slate-600'
                          : 'text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {p.icon}
                        <span>{p.label}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{p.description}</span>
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
