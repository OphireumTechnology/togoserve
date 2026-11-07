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
  Lock,
  KeyRound,
  LogOut,
  HelpCircle,
  Briefcase
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
    setIsShortcutsOpen,
    cartItemCount,
    logout,
    revokeEnterpriseSession,
  } = useApp();

  const [isEnterpriseMenuOpen, setIsEnterpriseMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const enterpriseMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (enterpriseMenuRef.current && !enterpriseMenuRef.current.contains(event.target as Node)) {
        setIsEnterpriseMenuOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isEnterpriseUser = Boolean(
    enterpriseSession ||
    (currentUser && currentUser.role !== 'CUSTOMER')
  );

  const roleMeta = currentUser ? ENTERPRISE_ROLES[currentUser.role] : null;
  const canSyncCloud = AccessControlService.canTriggerCloudSync(currentUser);

  // Public navigation links
  const publicNavLinks = [
    { id: 'marketplace' as ActivePortal, label: 'Marketplace', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'padala' as ActivePortal, label: 'TOGO Padala', icon: <Truck className="w-4 h-4" /> },
    { id: 'landing' as ActivePortal, label: 'Solutions', icon: <Briefcase className="w-4 h-4" /> },
  ];

  // Authorized operational portals for authenticated enterprise user
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
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#181818] text-[#2E2E2E] dark:text-[#FAFAFA] border-b border-[#EBEEEE] dark:border-neutral-800 shadow-xs transition-colors">
      {/* Enterprise Privileged Session Banner (Only for authenticated staff) */}
      {isEnterpriseUser && currentUser && (
        <div className="bg-[#2E2E2E] text-[#FAFAFA] text-[11px] px-4 py-1 border-b border-neutral-700/80">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#16845B] animate-pulse"></span>
              <span className="font-semibold text-[#FFD54F]">ENTERPRISE ENVIRONMENT</span>
              <span className="text-neutral-400">|</span>
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
              <span className="hidden md:inline text-neutral-400 font-mono text-[10px]">
                Clearance: Level {roleMeta?.clearanceLevel || 1}
              </span>
              <button
                onClick={revokeEnterpriseSession}
                className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors font-medium"
              >
                <LogOut className="w-3 h-3" />
                <span>Revoke Session</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* ZONE 1: OFFICIAL TOGOSERVE HORIZONTAL LOGO */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActivePortal('marketplace')}
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

          {/* ZONE 2: DESKTOP NAVIGATION (Public vs Private) */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {/* PUBLIC NAVIGATION */}
            {publicNavLinks.map((link) => {
              const isActive = activePortal === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActivePortal(link.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-[#F4B400] ${
                    isActive
                      ? 'bg-[#F4B400] text-[#2E2E2E] font-bold shadow-xs'
                      : 'text-[#2E2E2E] dark:text-neutral-200 hover:bg-[#EBEEEE] dark:hover:bg-neutral-800'
                  }`}
                >
                  <span className={isActive ? 'text-[#2E2E2E]' : 'text-[#64748B] dark:text-neutral-400'}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </button>
              );
            })}

            {/* Public Partner Inquiries */}
            {!isEnterpriseUser && (
              <>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-[#64748B] dark:text-neutral-300 hover:text-[#2E2E2E] dark:hover:text-white hover:bg-[#EBEEEE] dark:hover:bg-neutral-800 transition-colors"
                >
                  Become a Merchant
                </button>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-[#64748B] dark:text-neutral-300 hover:text-[#2E2E2E] dark:hover:text-white hover:bg-[#EBEEEE] dark:hover:bg-neutral-800 transition-colors"
                >
                  Become a Rider
                </button>
              </>
            )}

            {/* AUTHENTICATED ENTERPRISE WORKSPACES DROPDOWN */}
            {isEnterpriseUser && accessiblePortals.length > 0 && (
              <div className="relative" ref={enterpriseMenuRef}>
                <button
                  onClick={() => setIsEnterpriseMenuOpen(!isEnterpriseMenuOpen)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#EBEEEE] dark:bg-neutral-800 hover:bg-[#EBEEEE]/80 text-[#2E2E2E] dark:text-[#FAFAFA] border border-[#F4B400]/40 transition-all focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
                  aria-expanded={isEnterpriseMenuOpen}
                  aria-haspopup="true"
                >
                  <Lock className="w-3.5 h-3.5 text-[#F4B400]" />
                  <span>Enterprise Workspaces</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isEnterpriseMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isEnterpriseMenuOpen && (
                  <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-[#1E1E1E] border border-[#EBEEEE] dark:border-neutral-800 rounded-2xl shadow-xl p-2 z-50 text-[#2E2E2E] dark:text-neutral-200 animate-in fade-in-50 zoom-in-95 duration-100">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-[#64748B] dark:text-neutral-400 uppercase tracking-wider border-b border-[#EBEEEE] dark:border-neutral-800 mb-1">
                      Authorized Operational Modules
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
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-[#2E2E2E] dark:text-neutral-100">
                                  {rule?.name || pId}
                                </span>
                                {isItemActive && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#F4B400]"></span>
                                )}
                              </div>
                              <p className="text-[10px] text-[#64748B] dark:text-neutral-400 line-clamp-1">
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

          {/* ZONE 3: ACTIONS & CONTROLS */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Cloud Sync State (Strictly restricted to INFRASTRUCTURE_ADMIN / SUPER_ADMIN) */}
            {canSyncCloud && (
              <div className="hidden md:flex items-center">
                <CloudSyncIndicator />
              </div>
            )}

            {/* Quick Command Launcher */}
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

            {/* Help / Shortcuts modal */}
            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="p-2.5 text-[#2E2E2E] dark:text-neutral-300 hover:bg-[#EBEEEE] dark:hover:bg-neutral-800 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
              title="Help & Keyboard Shortcuts"
              aria-label="Open Help"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
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
              title={`Basket (${cartItemCount} items)`}
              aria-label={`View basket with ${cartItemCount} items`}
            >
              <ShoppingCart className="w-4 h-4" />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#F4B400] text-[#2E2E2E] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Discreet Enterprise Access Entry Point */}
            {!isEnterpriseUser && (
              <button
                onClick={() => setIsEnterpriseLoginOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-neutral-300 dark:border-neutral-700 hover:border-[#F4B400] text-[#2E2E2E] dark:text-neutral-200 hover:text-[#F4B400] transition-colors focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
                title="Restricted Enterprise Personnel Gateway"
              >
                <Lock className="w-3.5 h-3.5 text-[#F4B400]" />
                <span>Enterprise</span>
              </button>
            )}

            {/* User Profile / Auth State */}
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
                          {isEnterpriseUser ? 'Enterprise RBAC Session' : 'Customer Account'}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-[#EBEEEE] dark:border-neutral-800 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg font-semibold transition-colors flex items-center gap-1.5"
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

        {/* RESPONSIVE MOBILE MENU DRAWER */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#EBEEEE] dark:border-neutral-800 py-3 space-y-3">
            <div>
              <p className="px-2 text-[10px] font-bold text-[#64748B] dark:text-neutral-400 uppercase tracking-wider mb-1.5">
                Public Portals
              </p>
              <div className="grid grid-cols-2 gap-1.5 px-1">
                {publicNavLinks.map((p) => {
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

            {/* Mobile Enterprise Login or Workspaces */}
            <div className="pt-2 border-t border-[#EBEEEE] dark:border-neutral-800 px-1">
              {isEnterpriseUser && accessiblePortals.length > 0 ? (
                <div>
                  <p className="px-2 text-[10px] font-bold text-[#64748B] dark:text-neutral-400 uppercase tracking-wider mb-1.5">
                    Authorized Enterprise Dashboards
                  </p>
                  <div className="grid grid-cols-1 gap-1">
                    {accessiblePortals.map((pId) => {
                      const rule = PORTAL_ACCESS_RULES[pId];
                      return (
                        <button
                          key={pId}
                          onClick={() => {
                            setActivePortal(pId as ActivePortal);
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-left text-neutral-700 dark:text-neutral-200 hover:bg-[#EBEEEE] dark:hover:bg-neutral-800"
                        >
                          {getPortalIcon(pId)}
                          <span>{rule?.name || pId}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsEnterpriseLoginOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 text-[#FFD54F] border border-neutral-700 text-xs font-bold"
                >
                  <Lock className="w-4 h-4 text-[#F4B400]" />
                  <span>Enterprise Personnel Login</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
