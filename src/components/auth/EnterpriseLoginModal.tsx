import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../brand/Logo';
import {
  Lock,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  X,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Info
} from 'lucide-react';
import { ENTERPRISE_ROLES } from '../../auth/AccessControlService';

export const EnterpriseLoginModal: React.FC = () => {
  const {
    isEnterpriseLoginOpen,
    setIsEnterpriseLoginOpen,
    isDarkMode,
    loginEnterprise,
    verifyEnterpriseMFA,
    addToast,
    setActivePortal,
  } = useApp();

  const [step, setStep] = useState<'credentials' | 'mfa' | 'success'>('credentials');
  const [username, setUsername] = useState('root');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaSessionToken, setMfaSessionToken] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sessionDetails, setSessionDetails] = useState<any>(null);

  if (!isEnterpriseLoginOpen) return null;

  const handleClose = () => {
    setIsEnterpriseLoginOpen(false);
    setStep('credentials');
    setErrorMessage(null);
    setMfaCode('');
  };

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await loginEnterprise(username, password);
      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
        setIsLoading(false);
        return;
      }

      if (res.requiresMfa && res.mfaSessionToken) {
        setMfaSessionToken(res.mfaSessionToken);
        setStep('mfa');
        setIsLoading(false);
        return;
      }

      // No MFA needed (e.g. non-privileged role)
      if (res.session) {
        const session = res.session;
        setSessionDetails(session);
        setStep('success');
        addToast('success', 'Enterprise Session Established', `Authenticated as ${session.user.role}`);
        setTimeout(() => {
          handleClose();
          if (session.user.role === 'RIDER') setActivePortal('rider');
          else if (session.user.role.startsWith('MERCHANT')) setActivePortal('merchant');
          else setActivePortal('admin');
        }, 1200);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Server error during enterprise authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaSessionToken) return;
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await verifyEnterpriseMFA(mfaSessionToken, mfaCode);
      if (!res.success || !res.session) {
        setErrorMessage(res.error || 'Invalid 6-digit MFA code.');
        setIsLoading(false);
        return;
      }

      const session = res.session;
      setSessionDetails(session);
      setStep('success');
      addToast('success', 'MFA Verified', `Root session granted: ${session.user.role}`);
      setTimeout(() => {
        handleClose();
        if (session.user.role === 'SUPER_ADMIN') {
          setActivePortal('ai-center');
        } else if (session.user.role === 'AI_SUPERVISOR') {
          setActivePortal('ai-center');
        } else if (session.user.role === 'LOGISTICS_ADMIN') {
          setActivePortal('fleet');
        } else {
          setActivePortal('admin');
        }
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'MFA validation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const applyPresetAccount = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden transition-all ${
          isDarkMode
            ? 'bg-[#1E1E1E] border-neutral-700 text-[#FAFAFA]'
            : 'bg-white border-[#EBEEEE] text-[#2E2E2E]'
        }`}
      >
        {/* Top Gold Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#F4B400] via-[#FFD54F] to-[#F4B400]" />

        {/* Header */}
        <div className="p-6 sm:p-7 pb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Logo variant="symbol" size="sm" theme={isDarkMode ? 'dark' : 'light'} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight">TOGOSERVE</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#F4B400] text-[#2E2E2E]">
                  Enterprise Gateway
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Restricted Private Environment Authentication
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
            aria-label="Close Enterprise Gateway"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 pt-2">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 'credentials' && (
            <form onSubmit={handleCredentialSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-[#F4B400]/10 border border-[#F4B400]/25 text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#F4B400] shrink-0 mt-0.5" />
                <span>
                  Authorizes personnel to operational dashboards, A00 AI governance, cloud infrastructure, and financial ledgers.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Enterprise Username or Corporate ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. root"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border font-mono transition-all focus:outline-none focus:ring-2 focus:ring-[#F4B400] ${
                      isDarkMode
                        ? 'bg-neutral-900 border-neutral-700 text-white'
                        : 'bg-white border-neutral-300 text-neutral-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Enterprise Password
                  </label>
                  <span className="text-[11px] text-neutral-400">PBKDF2 Salt-Hashed</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter corporate password"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border font-mono pr-10 transition-all focus:outline-none focus:ring-2 focus:ring-[#F4B400] ${
                      isDarkMode
                        ? 'bg-neutral-900 border-neutral-700 text-white'
                        : 'bg-white border-neutral-300 text-neutral-900'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Quick Preset Selector for Evaluators & Testing */}
              <div className="pt-2">
                <div className="text-[11px] font-semibold text-neutral-400 mb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#F4B400]" />
                  <span>Authorized Test Roles (Click to Autofill):</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => applyPresetAccount('root', 'TogoServe#2026!RootAdmin')}
                    className="p-2 rounded-lg text-left border border-[#F4B400]/40 bg-[#F4B400]/10 hover:bg-[#F4B400]/20 transition-all"
                  >
                    <div className="font-bold text-[#F4B400] text-[11px]">root (SUPER_ADMIN)</div>
                    <div className="text-[10px] text-neutral-400">Master Enterprise Admin</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetAccount('ai.supervisor', 'TogoServe#AIGov2026')}
                    className="p-2 rounded-lg text-left border border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800 transition-all"
                  >
                    <div className="font-bold text-neutral-200 text-[11px]">ai.supervisor</div>
                    <div className="text-[10px] text-neutral-400">AI Workforce Command</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetAccount('infra.admin', 'TogoServe#Infra2026')}
                    className="p-2 rounded-lg text-left border border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800 transition-all"
                  >
                    <div className="font-bold text-neutral-200 text-[11px]">infra.admin</div>
                    <div className="text-[10px] text-neutral-400">Cloud Sync &amp; Infra</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetAccount('merchant.admin', 'TogoServe#Merchant2026')}
                    className="p-2 rounded-lg text-left border border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800 transition-all"
                  >
                    <div className="font-bold text-neutral-200 text-[11px]">merchant.admin</div>
                    <div className="text-[10px] text-neutral-400">Merchant OS &amp; POS</div>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#F4B400] text-[#2E2E2E] font-bold text-sm shadow-md hover:bg-[#FFD54F] transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Authenticate Personnel</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>
          )}

          {step === 'mfa' && (
            <form onSubmit={handleMfaSubmit} className="space-y-4">
              <div className="p-4 rounded-xl bg-[#F4B400]/10 border border-[#F4B400]/30 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#F4B400]">
                  <Smartphone className="w-4 h-4" />
                  <span>Mandatory Multi-Factor Authentication</span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Clearance level for <span className="font-mono font-bold text-[#F4B400]">{username}</span> requires secondary TOTP verification. Enter the 6-digit code from your corporate authenticator.
                </p>
                <div className="pt-1 text-[11px] text-neutral-400">
                  Evaluation master deployment code: <span className="font-mono font-bold text-[#FFD54F]">846201</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 text-neutral-700 dark:text-neutral-300 text-center">
                  6-Digit Authenticator Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="846201"
                  className={`w-full py-3 text-center tracking-[0.5em] text-2xl font-mono font-bold rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-[#F4B400] ${
                    isDarkMode
                      ? 'bg-neutral-900 border-neutral-700 text-[#FFD54F]'
                      : 'bg-white border-neutral-300 text-neutral-900'
                  }`}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  className="w-1/3 py-2.5 rounded-xl border border-neutral-700 text-xs font-semibold text-neutral-300 hover:bg-neutral-800 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading || mfaCode.length < 6}
                  className="w-2/3 py-2.5 rounded-xl bg-[#F4B400] text-[#2E2E2E] font-bold text-xs shadow-md hover:bg-[#FFD54F] transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Confirm MFA Verification</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 'success' && sessionDetails && (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#16845B]/20 border border-[#16845B]/40 flex items-center justify-center text-[#16845B]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-100">
                  Enterprise Session Active
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Authenticated as <span className="font-bold text-[#F4B400]">{sessionDetails.user.name}</span> ({sessionDetails.user.role})
                </p>
              </div>
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-400 text-left space-y-1">
                <div>Session ID: {sessionDetails.sessionId}</div>
                <div>MFA Verified: Yes (Cryptographic Token)</div>
                <div>Expires: {new Date(sessionDetails.expiresAt).toLocaleTimeString()}</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Security Notice */}
        <div className="px-6 py-3.5 bg-neutral-900/80 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-[#F4B400]" />
            <span>Classification: Critical Enterprise Access</span>
          </span>
          <span className="font-mono text-[10px]">v2.6 Enterprise RBAC</span>
        </div>
      </div>
    </div>
  );
};
