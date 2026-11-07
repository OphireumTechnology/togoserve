import React from 'react';
import { Logo } from '../brand/Logo';
import { ShieldCheck, ArrowUpRight, Lock, KeyRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setActivePortal, setIsEnterpriseLoginOpen } = useApp();

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

        {/* Public Offerings & Portals */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-[11px] text-[#FFD54F]">
            Public Services
          </h4>
          <ul className="space-y-2.5 text-neutral-400">
            <li>
              <button
                onClick={() => setActivePortal('marketplace')}
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <span>Customer Marketplace (Food &amp; Mart)</span>
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
                onClick={() => setActivePortal('landing')}
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <span>Solutions &amp; Business Overview</span>
              </button>
            </li>
            <li>
              <span className="text-neutral-500">Merchant Storefront Partnership</span>
            </li>
            <li>
              <span className="text-neutral-500">Courier Partner Opportunities</span>
            </li>
          </ul>
        </div>

        {/* Governance & Architecture */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-[11px] text-[#FFD54F]">
            Governance &amp; Trust
          </h4>
          <ul className="space-y-2.5 text-neutral-400">
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16845B]"></span>
              <span>A00 Autonomous AI Supervision</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16845B]"></span>
              <span>Human-in-the-Loop (HITL) Gate</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F4B400]"></span>
              <span>Role-Based Access Control (RBAC)</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F4B400]"></span>
              <span>256-Bit Cryptographic Audit Trails</span>
            </li>
          </ul>
        </div>

        {/* Corporate Standard & Enterprise Gateway Entry */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-[11px] text-[#FFD54F]">
            Corporate Access
          </h4>
          <p className="text-neutral-400 leading-relaxed text-[11px] mb-3">
            Operational dashboards, AI controls, and cloud infrastructure require verified enterprise credentials and MFA.
          </p>

          <button
            onClick={() => setIsEnterpriseLoginOpen(true)}
            className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-xs font-semibold text-[#FFD54F] transition-all"
          >
            <Lock className="w-3.5 h-3.5 text-[#F4B400]" />
            <span>Enterprise Personnel Login</span>
          </button>

          <div className="mt-4 p-3 rounded-xl bg-neutral-800/80 border border-neutral-700 text-[10px] text-neutral-400 space-y-1">
            <div className="flex items-center justify-between text-neutral-300 font-semibold">
              <span>Environment:</span>
              <span className="text-[#FFD54F]">PRODUCTION LIVE</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Domain:</span>
              <span className="font-mono text-neutral-300">togoserve.com</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Active Gateway:</span>
              <a
                href="https://artax.services/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FFD54F] hover:underline inline-flex items-center gap-0.5"
              >
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
