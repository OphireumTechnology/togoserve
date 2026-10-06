import React from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../brand/BrandLogo';
import { ImageWithFallback } from '../common/ImageWithFallback';
import {
  ArrowRight,
  ShoppingBag,
  Truck,
  Store,
  Bike,
  ShieldCheck,
  Cpu,
  Star,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart3,
  CreditCard
} from 'lucide-react';

export const PublicLandingView: React.FC = () => {
  const { setActivePortal, isDarkMode, setIsAuthModalOpen } = useApp();

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-[#071A2F] text-white p-8 sm:p-14 lg:p-20 shadow-2xl border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs text-[#FFC928] font-bold border border-white/20">
            <Sparkles className="w-4 h-4 text-[#FFC928]" />
            <span>AI-Native Commerce, Delivery & Multi-Agent Operating Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Commerce. Delivery. Intelligence. <br />
            <span className="text-[#FFC928]">One Connected Platform.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            Discover local businesses, shop fresh groceries and essentials, send parcels with
            point-to-point courier speed, and empower merchants with real-time operations.
          </p>

          <div className="pt-2 flex flex-wrap gap-3.5">
            <button
              onClick={() => setActivePortal('marketplace')}
              className="px-6 py-3.5 bg-[#FFC928] hover:bg-[#D9A514] text-[#071A2F] font-extrabold text-sm rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
            >
              <span>Explore TOGOSERVE</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActivePortal('padala')}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition-colors flex items-center gap-2"
            >
              <Truck className="w-4 h-4 text-[#FFC928]" />
              <span>Send with TOGO Padala</span>
            </button>

            <button
              onClick={() => setActivePortal('merchant')}
              className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
            >
              <Store className="w-4 h-4" />
              <span>For Business</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-20 -bottom-20 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#D9A514]/25 to-[#FFC928]/15 blur-3xl pointer-events-none" />
      </section>

      {/* 2. HOW TOGOSERVE WORKS */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-[#D9A514]">
            Unified Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            How TOGOSERVE Connects the Ecosystem
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A seamless bridge linking customers, merchant storefronts, dispatch riders, and enterprise suppliers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              step: '01',
              title: 'Customer Discovery',
              desc: 'Browse hundreds of verified local restaurants, grocers, and services with sub-second recommendations.',
              icon: <ShoppingBag className="w-5 h-5 text-[#D9A514]" />,
            },
            {
              step: '02',
              title: 'Merchant OS Acceptance',
              desc: 'Orders sync immediately to POS and Kitchen Display Systems with authoritative stock reservations.',
              icon: <Store className="w-5 h-5 text-[#16845B]" />,
            },
            {
              step: '03',
              title: 'AI Fleet Dispatch',
              desc: 'Specialist A21 algorithms match optimal vehicles by route distance, traffic, and volumetric parcel weight.',
              icon: <Bike className="w-5 h-5 text-indigo-400" />,
            },
            {
              step: '04',
              title: 'Verified e-POD Handover',
              desc: 'Real-time GPS tracking terminates in tamper-proof OTP and digital signature proof of delivery.',
              icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
            },
          ].map((item) => (
            <div
              key={item.step}
              className={`p-6 rounded-2xl border transition-all ${
                isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B] shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-extrabold text-[#D9A514]">{item.step}</span>
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">{item.icon}</div>
              </div>
              <h3 className="text-base font-bold mb-1.5">{item.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FOUR PLATFORM PILLARS SHOWCASE */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: TOGO Padala */}
        <div
          className={`p-8 rounded-3xl border space-y-4 flex flex-col justify-between ${
            isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B] shadow-sm'
          }`}
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFC928]/20 text-[#D9A514] text-xs font-bold">
              <Truck className="w-3.5 h-3.5" />
              <span>TOGO Padala Logistics</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">On-Demand Parcel & Freight Courier</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              From important legal contracts on motorcycles to 2,500kg pallets in cargo vans.
              Calculate guaranteed volumetric pricing in seconds.
            </p>
          </div>
          <button
            onClick={() => setActivePortal('padala')}
            className="self-start px-5 py-2.5 bg-[#071A2F] dark:bg-[#FFC928] text-white dark:text-[#071A2F] font-bold text-xs rounded-xl flex items-center gap-2 hover:opacity-90"
          >
            <span>Book a Delivery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Pillar 2: TOGOSERVE Business */}
        <div
          className={`p-8 rounded-3xl border space-y-4 flex flex-col justify-between ${
            isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B] shadow-sm'
          }`}
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16845B]/20 text-emerald-500 text-xs font-bold">
              <Store className="w-3.5 h-3.5" />
              <span>TOGOSERVE Business OS</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">Powering Merchants. Delivering Growth.</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Sell on marketplace, operate counter POS, manage low-stock thresholds, and source
              wholesale ingredients directly from verified suppliers.
            </p>
          </div>
          <button
            onClick={() => setActivePortal('merchant')}
            className="self-start px-5 py-2.5 bg-[#071A2F] dark:bg-[#FFC928] text-white dark:text-[#071A2F] font-bold text-xs rounded-xl flex items-center gap-2 hover:opacity-90"
          >
            <span>Merchant Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4. TRUST & SECURITY */}
      <section className="rounded-3xl bg-slate-100 dark:bg-slate-800/40 p-8 sm:p-12 border border-slate-200 dark:border-slate-800 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Enterprise Governance & Privacy</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          Built for Security, Trust and Reliability
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Double-entry ledger reconciliation, tokenized payment gateways, and Human-in-the-Loop
          (HITL) policy oversight protect customer privacy and merchant revenues.
        </p>
      </section>
    </div>
  );
};
