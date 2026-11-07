import React from 'react';
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
  Layers
} from 'lucide-react';

export const PublicLandingView: React.FC = () => {
  const { setActivePortal, isDarkMode } = useApp();

  const serviceCategories = [
    { id: 'restaurants', name: 'Restaurants', icon: <Utensils className="w-5 h-5" />, portal: 'marketplace' as const },
    { id: 'groceries', name: 'Groceries', icon: <ShoppingCart className="w-5 h-5" />, portal: 'marketplace' as const },
    { id: 'convenience', name: 'Convenience', icon: <Store className="w-5 h-5" />, portal: 'marketplace' as const },
    { id: 'pharmacy', name: 'Pharmacy', icon: <Pill className="w-5 h-5" />, portal: 'marketplace' as const },
    { id: 'retail', name: 'Retail', icon: <ShoppingBag className="w-5 h-5" />, portal: 'marketplace' as const },
    { id: 'flowers', name: 'Flowers', icon: <Flower2 className="w-5 h-5" />, portal: 'marketplace' as const },
    { id: 'petcare', name: 'Pet Care', icon: <PawPrint className="w-5 h-5" />, portal: 'marketplace' as const },
    { id: 'padala', name: 'TOGO Padala', icon: <Truck className="w-5 h-5 text-[#F4B400]" />, portal: 'padala' as const },
  ];

  const enterprisePillars = [
    {
      title: 'AI-Powered Operations',
      desc: 'Autonomous multi-agent orchestration for dynamic demand dispatch, fraud detection, and automated inventory sync.',
      icon: <Cpu className="w-5 h-5 text-[#2E2E2E] dark:text-[#FAFAFA]" />,
      badge: 'A00 Supervisor',
    },
    {
      title: 'Integrated Logistics',
      desc: 'End-to-end on-demand courier routing, multi-vehicle dispatch, and electronic proof of delivery (e-POD).',
      icon: <PackageCheck className="w-5 h-5 text-[#2E2E2E] dark:text-[#FAFAFA]" />,
      badge: 'TOGO Padala',
    },
    {
      title: 'Business Growth',
      desc: 'Omnichannel POS, online ordering, low-stock threshold management, and wholesale B2B supplier sourcing.',
      icon: <TrendingUp className="w-5 h-5 text-[#2E2E2E] dark:text-[#FAFAFA]" />,
      badge: 'Merchant OS',
    },
  ];

  return (
    <div className="space-y-16 pb-16 font-['Inter']">
      
      {/* ======================================================== */}
      {/* 1. HERO SECTION — LUXURY CORPORATE REDESIGN               */}
      {/* Clean White Background, Elegant Gold Geometric Accents   */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#1C1C1C] text-[#2E2E2E] dark:text-[#FAFAFA] p-6 sm:p-12 lg:p-16 border border-[#EBEEEE] dark:border-neutral-800 shadow-sm">
        {/* Subtle Luxury Gold Geometric Accent Wave in Background */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#F4B400]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#FFD54F]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Official Headings & Interactive CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tag / Micro-header with Official Circular Corporate Logo */}
            <div className="flex flex-wrap items-center gap-3">
              <Logo variant="circular" size="lg" className="shrink-0 drop-shadow-md" />
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBEEEE] dark:bg-neutral-800 text-xs text-[#2E2E2E] dark:text-[#FFD54F] font-bold border border-[#D9C39A]/40">
                <span className="w-2 h-2 rounded-full bg-[#F4B400]"></span>
                <span className="tracking-wide">AI-Native Commerce, Logistics &amp; Multi-Agent Operating Platform</span>
              </div>
            </div>

            {/* Primary Heading (Official Directive Specification) */}
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
                onClick={() => setActivePortal('merchant')}
                className="px-5 py-3.5 bg-transparent hover:bg-[#EBEEEE]/60 dark:hover:bg-neutral-800 text-[#2E2E2E] dark:text-neutral-200 font-semibold text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 transition-colors flex items-center gap-1.5"
              >
                <Store className="w-4 h-4 text-[#64748B]" />
                <span>Merchant OS</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hardware Showcase & Realistic Presentation */}
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
      {/* 2. OFFICIAL SERVICE CATEGORIES BAR                        */}
      {/* Standardized stroke, Lucide icons, Gold active states    */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#2E2E2E] dark:text-white">
              Essential Commerce &amp; Delivery Services
            </h2>
            <p className="text-xs text-[#64748B] dark:text-neutral-400">
              Order from verified local merchants or dispatch instant point-to-point courier delivery.
            </p>
          </div>
          <button
            onClick={() => setActivePortal('marketplace')}
            className="hidden sm:flex items-center gap-1 text-xs font-bold text-[#F4B400] hover:underline"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {serviceCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActivePortal(cat.portal)}
              className="p-4 rounded-2xl bg-white dark:bg-[#1C1C1C] border border-[#EBEEEE] dark:border-neutral-800 hover:border-[#F4B400] dark:hover:border-[#F4B400] transition-all flex flex-col items-center justify-center text-center gap-2.5 shadow-2xs hover:shadow-sm group active:scale-95"
            >
              <div className="w-12 h-12 rounded-full bg-[#EBEEEE] dark:bg-neutral-800 flex items-center justify-center text-[#2E2E2E] dark:text-[#FAFAFA] group-hover:bg-[#F4B400] group-hover:text-[#2E2E2E] transition-colors">
                {cat.icon}
              </div>
              <span className="text-xs font-bold text-[#2E2E2E] dark:text-white group-hover:text-[#F4B400] transition-colors">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. ENTERPRISE VALUE PILLARS & HIGHLIGHTS                  */}
      {/* AI Operations, Integrated Logistics, Business Growth      */}
      {/* ======================================================== */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {enterprisePillars.map((p, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-white dark:bg-[#1C1C1C] border border-[#EBEEEE] dark:border-neutral-800 shadow-2xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-[#EBEEEE] dark:bg-neutral-800 text-[#2E2E2E] dark:text-neutral-100">
                  {p.icon}
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#EBEEEE] dark:bg-neutral-800 text-[#2E2E2E] dark:text-[#D9C39A] border border-[#EBEEEE] dark:border-neutral-700">
                  {p.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#2E2E2E] dark:text-white">
                {p.title}
              </h3>
              <p className="text-xs text-[#64748B] dark:text-neutral-400 leading-relaxed">
                {p.desc}
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => {
                  if (idx === 0) setActivePortal('ai-center');
                  else if (idx === 1) setActivePortal('padala');
                  else setActivePortal('merchant');
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#F4B400] hover:text-[#2E2E2E] dark:hover:text-white transition-colors"
              >
                <span>Learn More</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* ======================================================== */}
      {/* 4. REALISTIC LOGISTICS & MERCHANT SHOWCASE                */}
      {/* Brand box packaging & storefront photos                  */}
      {/* ======================================================== */}
      <section className="rounded-3xl bg-[#EBEEEE]/50 dark:bg-neutral-900/60 p-6 sm:p-10 border border-[#EBEEEE] dark:border-neutral-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4B400]/20 text-[#2E2E2E] dark:text-[#FFD54F] text-xs font-bold">
              <Truck className="w-3.5 h-3.5" />
              <span>TOGO Padala Express Courier</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2E2E2E] dark:text-white">
              Engineered for High-Velocity Philippine Commerce
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] dark:text-neutral-400 leading-relaxed font-normal">
              Whether you are an e-commerce brand sending fragile luxury goods, a food merchant dispatching hot meals, or an enterprise managing freight across urban centers, TOGOSERVE unifies real-time tracking, volumetric pricing, and verified electronic signatures.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setActivePortal('padala')}
                className="px-5 py-2.5 bg-[#2E2E2E] dark:bg-[#F4B400] text-white dark:text-[#2E2E2E] font-bold text-xs rounded-xl flex items-center gap-2 hover:opacity-95"
              >
                <span>Book Courier Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActivePortal('fleet')}
                className="px-5 py-2.5 bg-white dark:bg-neutral-800 text-[#2E2E2E] dark:text-white border border-neutral-300 dark:border-neutral-700 font-bold text-xs rounded-xl flex items-center gap-2 hover:bg-neutral-50"
              >
                <span>Fleet Telematics</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden border border-[#EBEEEE] dark:border-neutral-700 shadow-xs bg-white dark:bg-neutral-800">
              <img
                src="/branding/togoserve/brand-packaging-box.png"
                alt="TOGOSERVE Branded Delivery Packaging"
                className="w-full h-44 object-cover"
              />
              <div className="p-3">
                <p className="text-xs font-bold text-[#2E2E2E] dark:text-white">Official TOGOSERVE Logistics</p>
                <p className="text-[10px] text-[#64748B] dark:text-neutral-400">Tamper-evident parcel delivery &amp; freight boxes</p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-[#EBEEEE] dark:border-neutral-700 shadow-xs bg-white dark:bg-neutral-800">
              <img
                src="/branding/togoserve/brand-storefront-3d.png"
                alt="TOGOSERVE Merchant Storefront"
                className="w-full h-44 object-cover"
              />
              <div className="p-3">
                <p className="text-xs font-bold text-[#2E2E2E] dark:text-white">Merchant Partner Network</p>
                <p className="text-[10px] text-[#64748B] dark:text-neutral-400">Integrated storefront signage &amp; POS terminals</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. ECOSYSTEM PORTAL DIRECTORY                            */}
      {/* Easy access to all modules without altering logic        */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-[#2E2E2E] dark:text-white">
          Complete Platform Architecture
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Customer Marketplace',
              desc: 'Discover food, groceries, pharmacy, and retail stores with unified cart & secure checkout.',
              portal: 'marketplace' as const,
              icon: <ShoppingBag className="w-5 h-5 text-[#F4B400]" />,
            },
            {
              title: 'Merchant OS & POS',
              desc: 'Manage counter sales, kitchen order display, low-stock alerts, and financial reconciliations.',
              portal: 'merchant' as const,
              icon: <Store className="w-5 h-5 text-[#2E2E2E] dark:text-[#FAFAFA]" />,
            },
            {
              title: 'Rider & Fleet Hub',
              desc: 'Turn-by-turn route optimization, parcel batching, digital OTP handover, and payout wallets.',
              portal: 'rider' as const,
              icon: <Bike className="w-5 h-5 text-[#F4B400]" />,
            },
            {
              title: 'A00 AI Supervisor',
              desc: 'Multi-agent governance, policy rules, Human-in-the-Loop review, and operational telemetry.',
              portal: 'ai-center' as const,
              icon: <Cpu className="w-5 h-5 text-[#2E2E2E] dark:text-[#FAFAFA]" />,
            },
          ].map((item) => (
            <div
              key={item.portal}
              onClick={() => setActivePortal(item.portal)}
              className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1C] border border-[#EBEEEE] dark:border-neutral-800 hover:border-[#F4B400] transition-all cursor-pointer shadow-2xs group flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#EBEEEE] dark:bg-neutral-800 flex items-center justify-center group-hover:bg-[#F4B400] group-hover:text-[#2E2E2E] transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-sm font-bold text-[#2E2E2E] dark:text-white group-hover:text-[#F4B400] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#64748B] dark:text-neutral-400 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
              <div className="pt-3 flex items-center gap-1 text-xs font-bold text-[#2E2E2E] dark:text-neutral-300 group-hover:text-[#F4B400] transition-colors">
                <span>Open Portal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. GOVERNANCE & PRODUCTION SECURITY ASSURANCE            */}
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
        <div className="pt-2 flex items-center justify-center gap-6 text-xs text-[#64748B] dark:text-neutral-400 font-semibold">
          <span>Official Domain: artax.services</span>
          <span>•</span>
          <span>Philippine Operations</span>
          <span>•</span>
          <span>AI-Supervised</span>
        </div>
      </section>

    </div>
  );
};
