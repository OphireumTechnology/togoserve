import React from 'react';
import { useApp } from '../../context/AppContext';
import { AccessControlService, PORTAL_ACCESS_RULES } from '../../auth/AccessControlService';
import { ShieldAlert, Lock, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import { Logo } from '../brand/Logo';

interface RouteGuardProps {
  requiredPortal: string;
  children: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ requiredPortal, children }) => {
  const { currentUser, setActivePortal, setIsEnterpriseLoginOpen, isDarkMode, enterpriseSession } = useApp();

  const access = AccessControlService.canAccessPortal(currentUser, requiredPortal);
  const portalRule = PORTAL_ACCESS_RULES[requiredPortal] || {
    name: requiredPortal,
    description: 'Restricted Enterprise Resource',
    allowedRoles: [],
  };

  if (access.allowed) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div
        className={`max-w-xl w-full rounded-2xl p-8 sm:p-10 shadow-xl border transition-all text-center ${
          isDarkMode
            ? 'bg-[#1E1E1E] border-neutral-800 text-[#FAFAFA]'
            : 'bg-white border-[#EBEEEE] text-[#2E2E2E]'
        }`}
      >
        {/* Official Brand Logo */}
        <div className="flex justify-center mb-6">
          <Logo variant="symbol" size="lg" theme={isDarkMode ? 'dark' : 'light'} />
        </div>

        {/* Security Shield Indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 bg-[#F4B400]/15 text-[#F4B400] border border-[#F4B400]/30">
          <Lock className="w-3.5 h-3.5" />
          <span>Restricted Enterprise Environment</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          {portalRule.name}
        </h2>

        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed max-w-md mx-auto">
          {portalRule.description}
        </p>

        {/* Access Warning Card */}
        <div
          className={`p-4 rounded-xl text-left text-xs space-y-2 mb-8 ${
            isDarkMode ? 'bg-neutral-900 border border-neutral-800' : 'bg-[#FAFAFA] border border-[#EBEEEE]'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-[#F4B400] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                Authorization Required:
              </span>{' '}
              <span className="text-neutral-600 dark:text-neutral-400">
                {access.reason || 'This operational dashboard is restricted to authorized personnel.'}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
            <span>Required Clearance:</span>
            <span className="font-mono font-medium text-[#2E2E2E] dark:text-[#EBEEEE]">
              {portalRule.allowedRoles.slice(0, 3).join(', ')}
            </span>
          </div>

          {currentUser && (
            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <span>Your Current Role:</span>
              <span className="font-mono font-medium text-[#D64545]">{currentUser.role}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setIsEnterpriseLoginOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#F4B400] text-[#2E2E2E] font-bold text-sm shadow-md hover:bg-[#FFD54F] transition-all focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
          >
            <KeyRound className="w-4 h-4" />
            <span>Authorize with Enterprise Credentials</span>
          </button>

          <button
            onClick={() => setActivePortal('marketplace')}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all focus:outline-none ${
              isDarkMode
                ? 'bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700'
                : 'bg-[#EBEEEE] text-[#2E2E2E] hover:bg-neutral-200'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Marketplace</span>
          </button>
        </div>

        {/* Session Notice */}
        <p className="mt-6 text-[11px] text-neutral-400">
          All enterprise session access events, IP addresses, and authentications are cryptographically audited.
        </p>
      </div>
    </div>
  );
};
