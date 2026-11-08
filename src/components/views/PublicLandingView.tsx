import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../brand/Logo';
import {
  ArrowRight,
  ShoppingBag,
  Truck,
  Store,
  Bike,
  ShieldCheck,
  Cpu,
  Sparkles,
  BarChart3,
  CreditCard,
  Utensils,
  ShoppingCart,
  Pill,
  Flower2,
  PawPrint,
  TrendingUp,
  PackageCheck,
  CheckCircle2,
  ChevronRight,
  Building2,
  Clock,
  Layers,
  Users,
  Award,
  Zap
} from 'lucide-react';

export const PublicLandingView: React.FC = () => {
  const {
    setActivePortal,
    isDarkMode,
    setIsMerchantModalOpen,
    setIsRiderModalOpen,
    setIsTrackingModalOpen,
    setIsHelpModalOpen,
  } = useApp();

  const [activeSolutionTab, setActiveSolutionTab] = useState<'commerce' | 'logistics' | 'merchant' | 'ai'>('commerce');

  const serviceCategories = [
    { id: 'restaurants', name: 'Restaurants & Dining', icon: <Utensils className="w-5 h-5" />, portal: 'marketplace' as const },
    { id: 'groceries', name: 'Fresh Groceries', icon: <ShoppingCart className="w-5 h-5" />, portal: 'marketplace' as const },
    { id: 'convenience', name: '24/7 Convenience', icon: <Store className="w-5 h-5" />, portal: 'marketplace' as const },
    { id: 'pharmacy', name: 'Pharmacy & Health', icon: <Pill className="w-5 h-5" />, portal: 'marketplace' as const },
    { id: 'retail', name: 'Retail & Lifestyle', icon: <ShoppingBag className="w-5 h-5" />, portal: 'marketplace' as const },
    { id: 'flowers', name: 'Flowers & Gifts', icon: <Flower2 className="w-5 h-5" />, portal: 'marketplace' as const },
    { id: 'petcare', name: 'Pet Care Essentials', icon: <PawPrint className="w-5 h-5" />, portal: 'marketplace' as const },
    { id: 'padala', name: 'TOGO Padala Courier', icon: <Truck className="w-5 h-5 text-[#F4B400]" />, portal: 'padala' as const },
  ];

  const solutionsContent = {
    commerce: {
      title: 'Intelligent Consumer Commerce',
      tagline: 'Connect local merchants with digital consumers across 12 product categories.',
      features: [
        'Multi-vendor cart and unified checkout across food, mart, and specialty shops.',
        'Real-time inventory synchronization preventing out-of-stock cancellations.',
        'Tokenized digital payments supporting COD, GCash, Maya, and credit/debit cards.',
        'Predictive delivery fee estimator with zero hidden surge markups.',
      ],
      cta: 'Explore Marketplace Catalog',
      action: () => setActivePortal('marketplace'),
    },
    logistics: {
      title: 'TOGO Padala Express Courier & Freight',
      tagline: 'High-velocity point-to-point courier and scheduled bulk transport across urban centers.',
      features: [
        'Volumetric rate computation for 6 vehicle types from motorcycles to light cargo trucks.',
        'Dynamic AI route batching minimizing vehicle dead miles and transit delays.',
        'Electronic Proof of Delivery (e-POD) with recipient OTP verification and digital signature.',
        'Automated rider wallet settlements and per-kilometer transparent earnings.',
      ],
      cta: 'Book TOGO Padala Dispatch',
      action: () => setActivePortal('padala'),
    },
    merchant: {
      title: 'Merchant OS & Cloud POS Systems',
      tagline: 'An integrated operating system engineered for Philippine merchants and retail outlets.',
      features: [
        'Omnichannel POS register with kitchen display, barcode scanning, and receipt printing.',
        'Real-time automated low-stock reorder thresholds and B2B wholesale supplier sourcing.',
        'Next-day double-entry automated bank settlements with granular gross revenue audits.',
        'Zero upfront onboarding charges with instant hardware compatibility.',
      ],
      cta: 'Apply for Merchant Storefront',
      action: () => setIsMerchantModalOpen(true),
    },
    ai: {
      title: 'Governed A00 Autonomous AI Workforce',
      tagline: 'Multi-agent orchestration with strict Human-in-the-Loop financial governance.',
      features: [
        'Specialized agents for logistics dispatch, fraud prevention, and demand forecasting.',
        'Maker-checker policy rules strictly gating high-value disbursements to human sign-off.',
        '256-bit cryptographic SHA-256 tamper-evident operational telemetry logs.',
        'Multi-tenant state isolation ensuring complete confidentiality of customer and merchant records.',
      ],
      cta: 'View AI Governance Architecture',
      action: () => setActivePortal('landing'),
    },
  };

  return (
    <div className="space-y-16 pb-16 font-['Inter']">
      
      {/* ======================================================== */}
      {/* 1. HERO SECTION — CLEAN CORPORATE TECH REDESIGN          */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#1C1C1C] text-[#2E2E2E] dark:text-[#FAFAFA] p-6 sm:p-12 lg:p-16 border border-[#EBEEEE] dark:border-neutral-800 shadow-sm">
        {/* Subtle Luxury Gold Geometric Accent Wave in Background */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#F4B400]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#FFD54F]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Official Headings & Interactive CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tag with Official Circular Corporate Logo */}
            <div className="flex flex-wrap items-center gap-3">
              <Logo variant="circular" size="md" className="shrink-0 drop-shadow-md" />
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBEEEE] dark:bg-neutral-800 text-xs text-[#2E2E2E] dark:text-[#FFD54F] font-bold border border-[#D9C39A]/40">
                <span className="w-2 h-2 rounded-full bg-[#F4B400]"></span>
                <span className="tracking-wide">AI-Native Commerce, Logistics &amp; Operating Platform</span>
              </div>
            </div>

            {/* Primary Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-[#2E2E2E] dark:text-white">
              Everything Your Business <br className="hidden sm:inline" />
              <span className="text-[#F4B400]">Needs to Move Forward</span>
            </h1>

            {/* Official Description */}
            <p className="text-base sm:text-lg text-[#64748B] dark:text-neutral-300 leading-relaxed max-w-xl font-normal">
              Connecting people, businesses and communities through intelligent commerce, seamless logistics and AI-powered solutions.
            </p>

            {/* Platform Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs text-[#2E2E2E] dark:text-neutral-300 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F4B400] shrink-0" />
                <span>Unified Marketplace &amp; Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F4B400] shrink-0" />
                <span>TOGO Padala Express Courier</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F4B400] shrink-0" />
                <span>Merchant Cloud POS &amp; Inventory</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F4B400] shrink-0" />
                <span>Governed A00 Multi-Agent AI</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-wrap gap-3">
              <button
                onClick={() => setActivePortal('marketplace')}
                className="px-6 py-3.5 bg-[#F4B400] hover:bg-[#FFD54F] text-[#2E2E2E] font-extrabold text-sm rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-2"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActivePortal('padala')}
                className="px-6 py-3.5 bg-[#EBEEEE] dark:bg-neutral-800 hover:bg-[#EBEEEE]/80 dark:hover:bg-neutral-700 text-[#2E2E2E] dark:text-white font-bold text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 transition-colors flex items-center gap-2"
              >
                <Truck className="w-4 h-4 text-[#F4B400]" />
                <span>Send with TOGO Padala</span>
              </button>

              <button
                onClick={() => setIsMerchantModalOpen(true)}
                className="px-5 py-3.5 bg-transparent hover:bg-[#EBEEEE]/60 dark:hover:bg-neutral-800 text-[#2E2E2E] dark:text-neutral-200 font-semibold text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 transition-colors flex items-center gap-1.5"
              >
                <Store className="w-4 h-4 text-[#64748B]" />
                <span>Become a Merchant</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hardware Showcase Presentation */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-lg border border-[#EBEEEE] dark:border-neutral-700 bg-[#FAFAFA] dark:bg-neutral-900 p-2">
              <img
                src="/branding/togoserve/hero-hardware-showcase.png"
                alt="TOGOSERVE Platform Hardware & Courier Presentation"
                className="w-full h-auto object-cover rounded-xl"
              />
              <div className="p-3 text-center bg-white dark:bg-[#1E1E1E] rounded-b-xl border-t border-[#EBEEEE] dark:border-neutral-800">
                <p className="text-[11px] font-bold text-[#2E2E2E] dark:text-white uppercase tracking-wider">
                  People • Businesses • Communities — All in Motion
                </p>
                <p className="text-[10px] text-[#F4B400] font-semibold mt-0.5">
                  Faster • Smarter • Together
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. SOLUTIONS DEEP DIVE (COMMERCE, LOGISTICS, POS, AI)    */}
      {/* ======================================================== */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4B400]/20 text-[#2E2E2E] dark:text-[#FFD54F] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platform Capabilities</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2E2E2E] dark:text-white tracking-tight">
            Integrated Solutions for Modern Operations
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-neutral-400 leading-relaxed font-normal">
            Whether powering high-volume storefronts or optimizing courier freight dispatch, TOGOSERVE connects every touchpoint with intelligent automation.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-center gap-2 p-1.5 bg-[#EBEEEE] dark:bg-neutral-800 rounded-2xl max-w-xl mx-auto">
          {[
            { id: 'commerce', label: 'Commerce', icon: <ShoppingBag className="w-4 h-4" /> },
            { id: 'logistics', label: 'Logistics', icon: <Truck className="w-4 h-4" /> },
            { id: 'merchant', label: 'Merchant OS', icon: <Store className="w-4 h-4" /> },
            { id: 'ai', label: 'AI Operations', icon: <Cpu className="w-4 h-4" /> },
          ].map((tab) => {
            const isActive = activeSolutionTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSolutionTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-white dark:bg-[#1E1E1E] text-[#2E2E2E] dark:text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-[#2E2E2E] dark:hover:text-white'
                }`}
              >
                <span className={isActive ? 'text-[#F4B400]' : ''}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Solution Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#1C1C1C] border border-[#EBEEEE] dark:border-neutral-800 shadow-sm max-w-4xl mx-auto">
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-black text-[#2E2E2E] dark:text-white">
              {solutionsContent[activeSolutionTab].title}
            </h3>
            <p className="text-sm text-[#64748B] dark:text-neutral-300 leading-relaxed">
              {solutionsContent[activeSolutionTab].tagline}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              {solutionsContent[activeSolutionTab].features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-200">
                  <CheckCircle2 className="w-4 h-4 text-[#F4B400] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <button
                onClick={solutionsContent[activeSolutionTab].action}
                className="px-5 py-2.5 bg-[#F4B400] hover:bg-[#FFD54F] text-[#2E2E2E] font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <span>{solutionsContent[activeSolutionTab].cta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsHelpModalOpen(true)}
                className="text-xs font-semibold text-[#64748B] dark:text-neutral-400 hover:text-[#2E2E2E] dark:hover:text-white"
              >
                Questions? View Knowledge Base
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. PARTNERSHIP CALLOUT BARS                               */}
      {/* Become a Merchant & Become a Rider Prominent Entry Points */}
      {/* ======================================================== */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Merchant Partner Box */}
        <div className="p-8 rounded-3xl bg-white dark:bg-[#1C1C1C] border border-[#EBEEEE] dark:border-neutral-800 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EBEEEE] dark:bg-neutral-800 flex items-center justify-center text-[#F4B400]">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-[#2E2E2E] dark:text-white">
              Become a TOGOSERVE Merchant
            </h3>
            <p className="text-xs text-[#64748B] dark:text-neutral-400 leading-relaxed font-normal">
              List your store on the customer marketplace, streamline in-store counter checkout with cloud POS, and tap into dedicated on-demand rider dispatch.
            </p>
            <ul className="text-xs text-neutral-600 dark:text-neutral-300 space-y-1.5 pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16845B]" />
                <span>0% Upfront onboarding fee</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16845B]" />
                <span>Next-day automated bank settlements</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16845B]" />
                <span>Unified POS &amp; kitchen order display</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <button
              onClick={() => setIsMerchantModalOpen(true)}
              className="w-full py-3 px-4 bg-[#2E2E2E] dark:bg-[#F4B400] text-white dark:text-[#2E2E2E] font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Submit Merchant Application</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Courier Partner Box */}
        <div className="p-8 rounded-3xl bg-white dark:bg-[#1C1C1C] border border-[#EBEEEE] dark:border-neutral-800 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EBEEEE] dark:bg-neutral-800 flex items-center justify-center text-[#F4B400]">
              <Bike className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-[#2E2E2E] dark:text-white">
              Become a TOGO Padala Rider
            </h3>
            <p className="text-xs text-[#64748B] dark:text-neutral-400 leading-relaxed font-normal">
              Deliver marketplace orders and point-to-point courier parcels across Metro Manila with intelligent dispatch, daily earnings withdrawals, and safety coverage.
            </p>
            <ul className="text-xs text-neutral-600 dark:text-neutral-300 space-y-1.5 pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16845B]" />
                <span>Daily earnings withdrawals to GCash or Maya</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16845B]" />
                <span>Motorcycle, car, MPV, and cargo van fleet classes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16845B]" />
                <span>Accident insurance on every trip</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <button
              onClick={() => setIsRiderModalOpen(true)}
              className="w-full py-3 px-4 bg-[#F4B400] hover:bg-[#FFD54F] text-[#2E2E2E] font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Register as Delivery Partner</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. GOVERNANCE & PRODUCTION SECURITY ASSURANCE            */}
      {/* ======================================================== */}
      <section className="rounded-3xl bg-white dark:bg-[#1C1C1C] p-8 border border-[#EBEEEE] dark:border-neutral-800 text-center space-y-4 shadow-2xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16845B]/10 text-[#16845B] text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Enterprise Governance &amp; Data Isolation</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-[#2E2E2E] dark:text-white">
          Engineered for Trust, Security &amp; Compliance
        </h3>
        <p className="text-xs sm:text-sm text-[#64748B] dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
          Double-entry financial ledgers, tokenized payment gateways, and Human-in-the-Loop policy oversight protect customer privacy and merchant revenues.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[#64748B] dark:text-neutral-400 font-semibold">
          <span>Official Domain: togoserve.com</span>
          <span>•</span>
          <span>Philippine Commerce Operations</span>
          <span>•</span>
          <span>A00 Multi-Agent Supervised</span>
        </div>
      </section>

    </div>
  );
};
