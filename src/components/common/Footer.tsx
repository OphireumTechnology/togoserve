import React from 'react';
import { Logo } from '../brand/Logo';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setActivePortal } = useApp();

  return (
    <footer className="mt-20 bg-[#2E2E2E] text-neutral-300 border-t border-neutral-700 text-xs py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Brand column */}
        <div className="space-y-4">
          <Logo variant="horizontal" theme="dark" size="md" />
          <p className="text-neutral-400 text-xs leading-relaxed max-w-xs font-normal">
            Connecting people, businesses and communities through intelligent commerce, seamless logistics and AI-powered solutions.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-[#D9C39A] font-medium">
            <ShieldCheck className="w-4 h-4 text-[#F4B400]" />
            <span>Enterprise Governed &amp; AI Supervised</span>
          </div>
        </div>

        {/* Portals */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-[11px] text-[#FFD54F]">
            Platform Ecosystem
          </h4>
          <ul className="space-y-2.5 text-neutral-400">
            <li>
              <button
                onClick={() => setActivePortal('landing')}
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <span>Platform Overview</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePortal('marketplace')}
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <span>Customer Marketplace</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePortal('padala')}
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <span>TOGO Padala Express Delivery</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePortal('merchant')}
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <span>TOGOSERVE Merchant OS</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePortal('pos')}
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <span>Counter POS Terminal</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePortal('rider')}
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <span>Rider &amp; Courier Portal</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePortal('fleet')}
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <span>Fleet Telematics &amp; Dispatch</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Intelligence & Governance */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-[11px] text-[#FFD54F]">
            AI &amp; Governance
          </h4>
          <ul className="space-y-2.5 text-neutral-400">
            <li>
              <button
                onClick={() => setActivePortal('ai-center')}
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <span>A00 Supervisor Command</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePortal('ai-center')}
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <span>Human-in-the-Loop (HITL) Queue</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePortal('analytics')}
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <span>Executive Analytics &amp; Telemetry</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePortal('supplier')}
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <span>Supplier &amp; B2B Procurement</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Corporate Standard & Production Domain */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-[11px] text-[#FFD54F]">
            Corporate Identity
          </h4>
          <p className="text-neutral-400 leading-relaxed text-[11px]">
            Mustard Gold (#F4B400) • Premium Yellow (#FFD54F) • Charcoal Black (#2E2E2E) • Light Gray (#EBEEEE) • Off White (#FAFAFA) • Earth Beige (#D9C39A)
          </p>
          <div className="mt-4 p-3.5 rounded-xl bg-neutral-800/80 border border-neutral-700 text-[11px] text-neutral-300 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#FFD54F]">Official Standard:</span>
              <span className="text-[10px] text-[#D9C39A] uppercase tracking-wider font-semibold">Verified</span>
            </div>
            <p className="text-[11px] text-neutral-300">
              Commerce • Logistics • AI
            </p>
            <div className="pt-1 text-[10px] text-neutral-400 flex items-center gap-1">
              <span>Production: </span>
              <a href="https://artax.services/" target="_blank" rel="noopener noreferrer" className="text-[#FFD54F] hover:underline inline-flex items-center gap-0.5">
                artax.services <ArrowUpRight className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-neutral-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-neutral-400 text-[11px]">
        <div>
          © 2026 TOGOSERVE Technologies Inc. • Philippines Commerce, Logistics &amp; AI
        </div>
        <div className="flex items-center gap-4">
          <span className="hover:text-neutral-200 cursor-pointer">Terms of Service</span>
          <span className="hover:text-neutral-200 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-neutral-200 cursor-pointer">Governance &amp; Trust</span>
        </div>
      </div>
    </footer>
  );
};
