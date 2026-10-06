import React from 'react';
import { Logo } from '../brand/Logo';
import { ShieldCheck, Lock, Globe, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setActivePortal, isDarkMode } = useApp();

  return (
    <footer className="mt-16 bg-[#071A2F] text-slate-300 border-t border-slate-800 text-xs py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand column */}
        <div className="space-y-3">
          <Logo variant="horizontal" isDark={true} size="md" showSlogan={true} />
          <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
            AI-Native Commerce, Delivery, Logistics & Multi-Agent Operating Platform. Connecting
            merchants, consumers, and riders with high-velocity automated operations.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <ShieldCheck className="w-4 h-4 text-[#16845B]" />
            <span>ISO 27001 & SOC 2 Type II Cloud Ready</span>
          </div>
        </div>

        {/* Portals */}
        <div>
          <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">
            Platform Ecosystem
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button
                onClick={() => setActivePortal('marketplace')}
                className="hover:text-white transition-colors"
              >
                Customer Marketplace
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePortal('padala')}
                className="hover:text-white transition-colors"
              >
                TOGO Padala Express
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePortal('merchant')}
                className="hover:text-white transition-colors"
              >
                TOGOSERVE Business
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePortal('pos')}
                className="hover:text-white transition-colors"
              >
                Cloud POS Terminal
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePortal('rider')}
                className="hover:text-white transition-colors"
              >
                Rider Hub & Dispatch
              </button>
            </li>
          </ul>
        </div>

        {/* Intelligence & Governance */}
        <div>
          <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">
            AI & Governance
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button
                onClick={() => setActivePortal('ai-center')}
                className="hover:text-white transition-colors"
              >
                A00 Supervisor Command
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePortal('ai-center')}
                className="hover:text-white transition-colors"
              >
                Human-in-the-Loop (HITL) Queue
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePortal('analytics')}
                className="hover:text-white transition-colors"
              >
                Real-Time Telemetry & Reports
              </button>
            </li>
            <li>
              <a href="#privacy" className="hover:text-white transition-colors">
                Privacy & Role Isolation (RLS)
              </a>
            </li>
          </ul>
        </div>

        {/* Brand Specs & Contact */}
        <div>
          <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">
            Brand Identity Standard
          </h4>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Deep Navy (#071A2F) • Brand Gold (#D9A514) • Action Yellow (#FFC928)
          </p>
          <div className="mt-3 p-3 rounded-xl bg-white/5 border border-slate-700/60 text-[11px] text-slate-300">
            <span className="font-bold text-[#FFC928]">Brand Promise: </span>
            <span>Powering Merchants. Delivering Growth.</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
        <div>
          © 2026 TOGOSERVE Technologies Inc. All rights reserved. Built with React & Tailwind CSS.
        </div>
        <div className="flex items-center gap-4">
          <span>Terms of Service</span>
          <span>Privacy Policy</span>
          <span>Security & Compliance</span>
        </div>
      </div>
    </footer>
  );
};
