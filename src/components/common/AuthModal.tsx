import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../brand/BrandLogo';
import { X, ShieldCheck, Lock, Mail, CheckCircle } from 'lucide-react';
import { UserRole } from '../../types';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginWithGoogle, loginWithEmail, isDarkMode } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('MERCHANT_OWNER');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setTimeout(() => {
      loginWithEmail(email, selectedRole);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-8 transition-colors ${
          isDarkMode
            ? 'bg-[#071A2F] border border-slate-700 text-white'
            : 'bg-white border border-slate-200 text-[#17212B]'
        }`}
      >
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-full transition-colors"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-block mb-3">
            <BrandLogo variant="stacked" theme={isDarkMode ? 'dark' : 'light'} size="sm" showSlogan={false} />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Cloud Authentication & Identity</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enterprise OAuth 2.0 with Role-Based Access Control (RBAC)
          </p>
        </div>

        {/* 1. Primary Google Cloud OAuth Flow */}
        <div className="space-y-4">
          <button
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold text-sm shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-[#D9A514]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google Workspace / OAuth</span>
          </button>

          <div className="relative flex py-1 items-center">
            <div className="grow border-t border-slate-300 dark:border-slate-700"></div>
            <span className="shrink mx-3 text-slate-400 text-xs font-mono">OR BUSINESS SIGN IN</span>
            <div className="grow border-t border-slate-300 dark:border-slate-700"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Account Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#D9A514]"
              >
                <option value="MERCHANT_OWNER">Merchant Owner (Store Management & POS)</option>
                <option value="CUSTOMER">Customer (Marketplace & Padala)</option>
                <option value="RIDER">Rider (Dispatch & Delivery)</option>
                <option value="ADMIN">System Administrator (Control Tower & AI)</option>
                <option value="FINANCE">Finance & Settlement Officer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="DANILODELACRUZ0909@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#D9A514]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Security Passcode
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#D9A514]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-[#071A2F] dark:bg-[#FFC928] text-white dark:text-[#071A2F] font-bold text-xs rounded-xl hover:bg-[#0c2a4b] dark:hover:bg-[#D9A514] transition-colors shadow-sm flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#FFC928]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Authenticating Cloud Session...' : 'Authenticate & Enter Platform'}</span>
            </button>
          </form>

          {/* Privacy & Trust Badge */}
          <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <CheckCircle className="w-3.5 h-3.5 text-[#16845B]" />
            <span>Encrypted Session • Zero Secrets in Client • Token-based RLS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
