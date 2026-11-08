import React, { useEffect, useState } from 'react';
import {
  Store,
  Bike,
  Cpu,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Sparkles
} from 'lucide-react';

export const HeroNetworkVisual: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [pulseIndex, setPulseIndex] = useState(0);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const interval = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative w-full max-w-lg aspect-4/3 flex items-center justify-center ${className}`}>
      {/* Background Soft Glow */}
      <div className="absolute inset-0 bg-radial from-[#F4B400]/15 via-transparent to-transparent blur-2xl pointer-events-none" />

      {/* SVG Connecting Network Vectors */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Network Connections */}
        <line x1="80" y1="70" x2="200" y2="150" stroke="#F4B400" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3" />
        <line x1="320" y1="70" x2="200" y2="150" stroke="#F4B400" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3" />
        <line x1="80" y1="230" x2="200" y2="150" stroke="#F4B400" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3" />
        <line x1="320" y1="230" x2="200" y2="150" stroke="#F4B400" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3" />

        {/* Orbit Rings around Central AI Node */}
        <circle cx="200" cy="150" r="54" stroke="#F4B400" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="4 4" />
        <circle cx="200" cy="150" r="82" stroke="#EBEEEE" strokeWidth="0.8" strokeOpacity="0.2" />

        {/* Animated Moving Data Packets */}
        <circle cx={pulseIndex === 0 ? 140 : pulseIndex === 1 ? 260 : pulseIndex === 2 ? 140 : 260}
                cy={pulseIndex === 0 ? 110 : pulseIndex === 1 ? 110 : pulseIndex === 2 ? 190 : 190}
                r="3.5"
                fill="#FFD54F"
                className="transition-all duration-700 ease-out animate-pulse"
        />
      </svg>

      {/* NODE 1: TOP LEFT — Verified Local Merchants */}
      <div className="absolute top-2 left-2 sm:left-4 z-10 flex flex-col items-center">
        <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md text-[#FFD54F] hover:scale-105 transition-transform duration-200">
          <Store className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="mt-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] text-white font-medium text-center">
          <span>Local Merchants</span>
          <span className="block text-[8px] text-[#F4B400] font-mono">Sync Inventory</span>
        </div>
      </div>

      {/* NODE 2: TOP RIGHT — Customer Orders */}
      <div className="absolute top-2 right-2 sm:right-4 z-10 flex flex-col items-center">
        <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md text-[#FFD54F] hover:scale-105 transition-transform duration-200">
          <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="mt-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] text-white font-medium text-center">
          <span>Smart Commerce</span>
          <span className="block text-[8px] text-[#F4B400] font-mono">Unified Cart</span>
        </div>
      </div>

      {/* NODE 3: CENTER — A00 AI Autonomous Supervisor Hub */}
      <div className="relative z-20 flex flex-col items-center">
        <div className="relative p-4 sm:p-5 rounded-3xl bg-[#2E2E2E] border-2 border-[#F4B400] shadow-xl text-[#F4B400] flex items-center justify-center">
          <Cpu className="w-7 h-7 sm:w-9 sm:h-9" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#16845B] border-2 border-[#2E2E2E] animate-ping" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#16845B] border-2 border-[#2E2E2E]" />
        </div>
        <div className="mt-2 px-3 py-1 rounded-full bg-[#F4B400] text-[#2E2E2E] font-extrabold text-[11px] shadow-sm flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>A00 AI Supervisor</span>
        </div>
        <span className="text-[9px] text-slate-300 font-mono mt-0.5">
          Intelligent Dispatch Core
        </span>
      </div>

      {/* NODE 4: BOTTOM LEFT — TOGO Padala Fleet */}
      <div className="absolute bottom-2 left-2 sm:left-4 z-10 flex flex-col items-center">
        <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md text-[#FFD54F] hover:scale-105 transition-transform duration-200">
          <Bike className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="mt-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] text-white font-medium text-center">
          <span>Courier Fleet</span>
          <span className="block text-[8px] text-[#F4B400] font-mono">Dynamic Dispatch</span>
        </div>
      </div>

      {/* NODE 5: BOTTOM RIGHT — Governed HITL Assurance */}
      <div className="absolute bottom-2 right-2 sm:right-4 z-10 flex flex-col items-center">
        <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md text-[#16845B] hover:scale-105 transition-transform duration-200">
          <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="mt-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] text-white font-medium text-center">
          <span>Enterprise Policy</span>
          <span className="block text-[8px] text-[#16845B] font-mono">e-POD &amp; Ledger</span>
        </div>
      </div>
    </div>
  );
};
