import React, { useState, useRef, useEffect } from 'react';
import { useApp, ActivePortal } from '../../context/AppContext';
import { Logo } from '../brand/Logo';
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
  Lock,
  LogOut,
  HelpCircle,
  Briefcase,
  Users,
  Bike,
  Package
} from 'lucide-react';
import { AccessControlService, ENTERPRISE_ROLES, PORTAL_ACCESS_RULES } from '../../auth/AccessControlService';

export const Header: React.FC<{
  onOpenCart: () => void;
}> = ({ onOpenCart }) => {
  const {
    isDarkMode,
    toggleDarkMode,
    activePortal,
    setActivePortal,
    currentUser,
    enterpriseSession,
    setIsAuthModalOpen,
    setIsEnterpriseLoginOpen,
    setIsCommandPaletteOpen,
    setIsTrackingModalOpen,
    setIsMerchantModalOpen,
    setIsRiderModalOpen,
    setIsHelpModalOpen,
    cartItemCount,
    logout,
    revokeEnterpriseSession,
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isPartnersOpen, setIsPartnersOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isEnterpriseMenuOpen, setIsEnterpriseMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const partnersRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const enterpriseMenuRef = useRef<HTMLDivElement>(null);

  // Detect scroll to apply sticky elevation shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (partnersRef.current && !partnersRef.current.contains(target)) {
        setIsPartnersOpen(false);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(target)) {
        setIsAccountMenuOpen(false);
      }
      if (enterpriseMenuRef.current && !enterpriseMenuRef.current.contains(target)) {
        setIsEnterpriseMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isEnterpriseUser = Boolean(
    enterpriseSession || (currentUser && currentUser.role !== 'CUSTOMER')
  );

  const roleMeta = currentUser ? ENTERPRISE_ROLES[currentUser.role] : null;

  // Authorized operational portals for authenticated enterprise staff
  const accessiblePortals = currentUser
    ? AccessControlService.getAccessiblePortals(currentUser).filter(
        (p) => !['marketplace', 'padala', 'landing', 'customer'].includes(p)
      )
    : [];

  const getPortalIcon = (id: string) => {
    switch (id) {
      case 'merchant':
        return <Store className="w-4 h-4 text-[#F4B400]" />;
      case 'pos':
        return <CreditCard className="w-4 h-4 text-[#F4B400]" />;
      case 'rider':
        return <Truck className="w-4 h-4 text-[#F4B400]" />;
      case 'fleet':
        return <PackageCheck className="w-4 h-4 text-[#F4B400]" />;
      case 'supplier':
        return <Building2 className="w-4 h-4 text-[#2E2E2E] dark:text-[#EBEEEE]" />;
      case 'ai-center':
        return <Cpu className="w-4 h-4 text-[#F4B400]" />;
      case 'analytics':
        return <BarChart3 className="w-4 h-4 text-[#16845B]" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-[#F4B400]" />;
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 bg-white dark:bg-[#181818] text-[#2E2E2E] dark:text-[#FAFAFA] border-b ${
        isScrolled
          ? 'border-neutral-200 dark:border-neutral-800 shadow-sm'
          : 'border-[#EBEEEE] dark:border-neutral-800/80 shadow-none'
      }`}
    >
      {/* Enterprise Privileged Session Banner (Only for authenticated operational personnel) */}
      {isEnterpriseUser && currentUser && (
        <div className="bg-[#2E2E2E] text-[#FAFAFA] text-[11px] px-4 py-1 border-b border-neutral-700/80">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#16845B] animate-pulse"></span>
              <span className="font-semibold text-[#FFD54F]">ENTERPRISE ENVIRONMENT</span>
              <span className="text-neutral-500">|</span>
              <span className="font-mono text-neutral-300">
                {roleMeta?.title || currentUser.role}
              </span>
              {enterpriseSession?.mfaVerified && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-[#16845B] bg-[#16845B]/20 px-2 py-0.5 rounded-full font-bold">
                  <ShieldCheck className="w-3 h-3" /> MFA Active
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={revokeEnterpriseSession}
                className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors font-medium"
              >
                <LogOut className="w-3 h-3" />
                <span>Exit Session</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Container: Approximately 72–80px on desktop (h-20) */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-4 sm:gap-8">
          
          {/* ========================================================= */}
          {/* LEFT — Branding                                            */}
          {/* Official TOGOSERVE Logo with clear spacing & proportions   */}
          {/* ========================================================= */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => setActivePortal('marketplace')}
              className="focus:outline-none focus:ring-2 focus:ring-[#F4B400] rounded-xl transition-transform active:scale-[0.98] text-left flex items-center py-1"
              aria-label="TOGOSERVE Home"
            >
              <Logo
                variant="horizontal"
                theme={isDarkMode ? 'dark' : 'light'}
                size="md"
                className="hover:opacity-95 transition-opacity"
              />
            </button>
          </div>

          {/* ========================================================= */}
          {/* CENTER — Primary Navigation                                */}
          {/* Simplified 4-Item Structure: Marketplace, Padala, Solutions, Partners */}
          {/* ========================================================= */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {/* 1. Marketplace */}
            <button
              onClick={() => setActivePortal('marketplace')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all relative ${
                activePortal === 'marketplace' || activePortal === 'customer'
                  ? 'text-[#2E2E2E] dark:text-white font-bold bg-[#F4B400]/15 dark:bg-[#F4B400]/20'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-[#2E2E2E] dark:hover:text-white hover:bg-[#EBEEEE]/60 dark:hover:bg-neutral-800'
              }`}
            >
              <span>Marketplace</span>
              {(activePortal === 'marketplace' || activePortal === 'customer') && (
                <span className="absolute bottom-0.5 left-3.5 right-3.5 h-0.5 bg-[#F4B400] rounded-full" />
              )}
            </button>

            {/* 2. TOGO Padala */}
            <button
              onClick={() => setActivePortal('padala')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all relative ${
                activePortal === 'padala'
                  ? 'text-[#2E2E2E] dark:text-white font-bold bg-[#F4B400]/15 dark:bg-[#F4B400]/20'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-[#2E2E2E] dark:hover:text-white hover:bg-[#EBEEEE]/60 dark:hover:bg-neutral-800'
              }`}
            >
              <span>TOGO Padala</span>
              {activePortal === 'padala' && (
                <span className="absolute bottom-0.5 left-3.5 right-3.5 h-0.5 bg-[#F4B400] rounded-full" />
              )}
            </button>

            {/* 3. Solutions */}
            <button
              onClick={() => setActivePortal('landing')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all relative ${
                activePortal === 'landing'
                  ? 'text-[#2E2E2E] dark:text-white font-bold bg-[#F4B400]/15 dark:bg-[#F4B400]/20'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-[#2E2E2E] dark:hover:text-white hover:bg-[#EBEEEE]/60 dark:hover:bg-neutral-800'
              }`}
            >
              <span>Solutions</span>
              {activePortal === 'landing' && (
                <span className="absolute bottom-0.5 left-3.5 right-3.5 h-0.5 bg-[#F4B400] rounded-full" />
              )}
            </button>

            {/* 4. Partners Dropdown (Become a Merchant & Become a Rider) */}
            <div className="relative" ref={partnersRef}>
              <button
                onClick={() => setIsPartnersOpen(!isPartnersOpen)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isPartnersOpen
                    ? 'bg-[#EBEEEE] dark:bg-neutral-800 text-[#2E2E2E] dark:text-white'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-[#2E2E2E] dark:hover:text-white hover:bg-[#EBEEEE]/60 dark:hover:bg-neutral-800'
                }`}
                aria-expanded={isPartnersOpen}
                aria-haspopup="true"
              >
                <span>Partners</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isPartnersOpen ? 'rotate-180 text-[#F4B400]' : 'text-neutral-400'}`} />
              </button>

              {isPartnersOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-[#1E1E1E] border border-[#EBEEEE] dark:border-neutral-800 rounded-2xl shadow-xl p-2 z-50 text-[#2E2E2E] dark:text-neutral-200 animate-in fade-in-50 zoom-in-95 duration-100">
                  <button
                    onClick={() => {
                      setIsPartnersOpen(false);
                      setIsMerchantModalOpen(true);
                    }}
                    className="w-full text-left p-3 rounded-xl hover:bg-[#EBEEEE]/60 dark:hover:bg-neutral-800 transition-colors flex items-start gap-3 group"
                  >
                    <div className="p-2 rounded-xl bg-[#EBEEEE] dark:bg-neutral-800 group-hover:bg-[#F4B400] group-hover:text-[#2E2E2E] text-[#2E2E2E] dark:text-white transition-colors shrink-0">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#2E2E2E] dark:text-white group-hover:text-[#F4B400] transition-colors block">
                        Become a Merchant
                      </span>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                        Omnichannel POS, online ordering &amp; 0% signup fee
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setIsPartnersOpen(false);
                      setIsRiderModalOpen(true);
                    }}
                    className="w-full text-left p-3 rounded-xl hover:bg-[#EBEEEE]/60 dark:hover:bg-neutral-800 transition-colors flex items-start gap-3 group"
                  >
                    <div className="p-2 rounded-xl bg-[#EBEEEE] dark:bg-neutral-800 group-hover:bg-[#F4B400] group-hover:text-[#2E2E2E] text-[#2E2E2E] dark:text-white transition-colors shrink-0">
                      <Bike className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#2E2E2E] dark:text-white group-hover:text-[#F4B400] transition-colors block">
                        Become a Rider
                      </span>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                        Flexible schedules, daily payouts &amp; per-km fuel incentives
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Authenticated Enterprise Workspaces Dropdown */}
            {isEnterpriseUser && accessiblePortals.length > 0 && (
              <div className="relative" ref={enterpriseMenuRef}>
                <button
                  onClick={() => setIsEnterpriseMenuOpen(!isEnterpriseMenuOpen)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#EBEEEE] dark:bg-neutral-800 hover:bg-[#EBEEEE]/80 text-[#2E2E2E] dark:text-[#FAFAFA] border border-[#F4B400]/40 transition-all focus:outline-none"
                  aria-expanded={isEnterpriseMenuOpen}
                  aria-haspopup="true"
                >
                  <Lock className="w-3.5 h-3.5 text-[#F4B400]" />
                  <span>Workspaces</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isEnterpriseMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isEnterpriseMenuOpen && (
                  <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-[#1E1E1E] border border-[#EBEEEE] dark:border-neutral-800 rounded-2xl shadow-xl p-2 z-50 text-[#2E2E2E] dark:text-neutral-200 animate-in fade-in-50 zoom-in-95 duration-100">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-b border-[#EBEEEE] dark:border-neutral-800 mb-1">
                      Authorized Dashboards
                    </div>
                    <div className="space-y-1">
                      {accessiblePortals.map((pId) => {
                        const rule = PORTAL_ACCESS_RULES[pId];
                        const isItemActive = activePortal === pId;
                        return (
                          <button
                            key={pId}
                            onClick={() => {
                              setActivePortal(pId as ActivePortal);
                              setIsEnterpriseMenuOpen(false);
                            }}
                            className={`w-full text-left p-2.5 rounded-xl transition-colors flex items-start gap-2.5 ${
                              isItemActive
                                ? 'bg-[#EBEEEE] dark:bg-neutral-800 font-bold border border-[#F4B400]/40'
                                : 'hover:bg-[#EBEEEE]/60 dark:hover:bg-neutral-800/60'
                            }`}
                          >
                            <div className="p-1.5 rounded-lg bg-[#EBEEEE] dark:bg-neutral-800 shrink-0 mt-0.5">
                              {getPortalIcon(pId)}
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-[#2E2E2E] dark:text-neutral-100 block">
                                {rule?.name || pId}
                              </span>
                              <p className="text-[10px] text-neutral-400 line-clamp-1">
                                {rule?.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* ========================================================= */}
          {/* RIGHT — User Actions                                      */}
          {/* Search, Shopping Cart with badge, Sign In / My Account, Enterprise */}
          {/* ========================================================= */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* 1. Search Icon Trigger */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="p-2 sm:p-2.5 text-neutral-600 dark:text-neutral-300 hover:text-[#2E2E2E] dark:hover:text-white hover:bg-[#EBEEEE] dark:hover:bg-neutral-800 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
              title="Search products and merchants (⌘K)"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* 2. Shopping Cart with real badge count */}
            <button
              onClick={onOpenCart}
              className="relative p-2 sm:p-2.5 text-neutral-600 dark:text-neutral-300 hover:text-[#2E2E2E] dark:hover:text-white hover:bg-[#EBEEEE] dark:hover:bg-neutral-800 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
              title={`Basket (${cartItemCount} items)`}
              aria-label={`View basket with ${cartItemCount} items`}
            >
              <ShoppingCart className="w-4 h-4" />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#F4B400] text-[#2E2E2E] text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* 3. Sign In / My Account */}
            {currentUser ? (
              <div className="relative" ref={accountMenuRef}>
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#EBEEEE]/70 dark:bg-neutral-800 hover:bg-[#EBEEEE] dark:hover:bg-neutral-700 border border-[#EBEEEE] dark:border-neutral-700 rounded-full text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
                  aria-expanded={isAccountMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-6 h-6 rounded-full bg-[#F4B400] text-[#2E2E2E] font-bold flex items-center justify-center text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="font-semibold text-[#2E2E2E] dark:text-neutral-100 text-xs hidden sm:inline max-w-[85px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>

                {isAccountMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1E1E1E] border border-[#EBEEEE] dark:border-neutral-800 rounded-2xl shadow-xl p-2 z-50 text-[#2E2E2E] dark:text-neutral-200 animate-in fade-in-50 zoom-in-95 duration-100"
                    role="menu"
                  >
                    <div className="px-3 py-2.5 border-b border-[#EBEEEE] dark:border-neutral-800 mb-1">
                      <p className="text-xs font-bold text-[#2E2E2E] dark:text-white truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-neutral-400 font-mono truncate">{currentUser.email}</p>
                    </div>

                    <div className="py-1 space-y-0.5">
                      <button
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          setIsTrackingModalOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-[#EBEEEE] dark:hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Package className="w-3.5 h-3.5 text-[#F4B400]" />
                        <span>My Orders &amp; Tracking</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          setIsHelpModalOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-[#EBEEEE] dark:hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Help &amp; Support FAQs</span>
                      </button>

                      <button
                        onClick={toggleDarkMode}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-[#EBEEEE] dark:hover:bg-neutral-800 rounded-lg transition-colors flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          {isDarkMode ? <Sun className="w-3.5 h-3.5 text-[#F4B400]" /> : <Moon className="w-3.5 h-3.5 text-[#2E2E2E]" />}
                          <span>Appearance</span>
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400">
                          {isDarkMode ? 'Dark' : 'Light'}
                        </span>
                      </button>
                    </div>

                    <div className="border-t border-[#EBEEEE] dark:border-neutral-800 pt-1 mt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsAccountMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg font-semibold transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-[#F4B400] hover:bg-[#FFD54F] text-[#2E2E2E] text-xs sm:text-sm font-bold rounded-xl shadow-2xs transition-all active:scale-95"
              >
                <User className="w-3.5 h-3.5 shrink-0" />
                <span>Sign In</span>
              </button>
            )}

            {/* 4. Enterprise Access (Discreet secondary action) */}
            {!isEnterpriseUser && (
              <button
                onClick={() => setIsEnterpriseLoginOpen(true)}
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-500 hover:text-[#2E2E2E] dark:hover:text-white hover:bg-[#EBEEEE] dark:hover:bg-neutral-800 border border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                title="Enterprise Personnel Gateway"
              >
                <Lock className="w-3 h-3 text-[#F4B400]" />
                <span>Enterprise</span>
              </button>
            )}

            {/* Mobile / Tablet Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-700 dark:text-neutral-200 hover:bg-[#EBEEEE] dark:hover:bg-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE NAVIGATION DRAWER (Clean, accessible, not squished) */}
        {/* ========================================================= */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#EBEEEE] dark:border-neutral-800 py-4 px-2 space-y-4 animate-in fade-in duration-150">
            {/* Primary Links */}
            <div className="space-y-1">
              <button
                onClick={() => {
                  setActivePortal('marketplace');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-colors ${
                  activePortal === 'marketplace'
                    ? 'bg-[#F4B400] text-[#2E2E2E]'
                    : 'text-neutral-700 dark:text-neutral-200 hover:bg-[#EBEEEE] dark:hover:bg-neutral-800'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Marketplace</span>
                </span>
                <span className="text-[10px] font-mono opacity-80">Food &amp; Goods</span>
              </button>

              <button
                onClick={() => {
                  setActivePortal('padala');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-colors ${
                  activePortal === 'padala'
                    ? 'bg-[#F4B400] text-[#2E2E2E]'
                    : 'text-neutral-700 dark:text-neutral-200 hover:bg-[#EBEEEE] dark:hover:bg-neutral-800'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4" />
                  <span>TOGO Padala</span>
                </span>
                <span className="text-[10px] font-mono opacity-80">Express Courier</span>
              </button>

              <button
                onClick={() => {
                  setActivePortal('landing');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-colors ${
                  activePortal === 'landing'
                    ? 'bg-[#F4B400] text-[#2E2E2E]'
                    : 'text-neutral-700 dark:text-neutral-200 hover:bg-[#EBEEEE] dark:hover:bg-neutral-800'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4" />
                  <span>Solutions</span>
                </span>
                <span className="text-[10px] font-mono opacity-80">Commerce &amp; AI</span>
              </button>
            </div>

            {/* Partner Inquiries */}
            <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 space-y-1">
              <p className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                Partner Opportunities
              </p>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsMerchantModalOpen(true);
                }}
                className="w-full flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-[#EBEEEE] dark:hover:bg-neutral-800 text-left"
              >
                <Store className="w-4 h-4 text-[#F4B400]" />
                <span>Become a Merchant</span>
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsRiderModalOpen(true);
                }}
                className="w-full flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-[#EBEEEE] dark:hover:bg-neutral-800 text-left"
              >
                <Bike className="w-4 h-4 text-[#F4B400]" />
                <span>Become a Rider</span>
              </button>
            </div>

            {/* Account & Support Utilities */}
            <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 space-y-1">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsTrackingModalOpen(true);
                }}
                className="w-full flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-[#EBEEEE] dark:hover:bg-neutral-800 text-left"
              >
                <Package className="w-4 h-4 text-[#F4B400]" />
                <span>Track Order / Shipment</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsHelpModalOpen(true);
                }}
                className="w-full flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-[#EBEEEE] dark:hover:bg-neutral-800 text-left"
              >
                <HelpCircle className="w-4 h-4 text-neutral-400" />
                <span>Help &amp; FAQs</span>
              </button>

              <button
                onClick={toggleDarkMode}
                className="w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-[#EBEEEE] dark:hover:bg-neutral-800"
              >
                <span className="flex items-center gap-2.5">
                  {isDarkMode ? <Sun className="w-4 h-4 text-[#F4B400]" /> : <Moon className="w-4 h-4 text-neutral-600" />}
                  <span>Theme</span>
                </span>
                <span className="text-[10px] font-mono text-neutral-400">{isDarkMode ? 'Dark' : 'Light'}</span>
              </button>
            </div>

            {/* Enterprise Access */}
            <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsEnterpriseLoginOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neutral-900 text-[#FFD54F] border border-neutral-700 text-xs font-bold"
              >
                <Lock className="w-4 h-4 text-[#F4B400]" />
                <span>Enterprise Personnel Access</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
