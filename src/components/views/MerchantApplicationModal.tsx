import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Store,
  CheckCircle2,
  Building2,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface MerchantApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MerchantApplicationModal: React.FC<MerchantApplicationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isDarkMode, addToast } = useApp();
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Taguig City (BGC)');
  const [category, setCategory] = useState('Food & Beverage');
  const [branchesCount, setBranchesCount] = useState('1');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    addToast('success', 'Merchant Application Received', `Thank you, ${ownerName}! Our onboarding team will contact you within 24 hours.`);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-8 transition-colors ${
          isDarkMode
            ? 'bg-[#1C1C1C] border border-neutral-700 text-white'
            : 'bg-white border border-[#EBEEEE] text-[#2E2E2E]'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-full transition-colors focus:outline-none"
          aria-label="Close merchant application"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#16845B]/10 text-[#16845B] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black">Application Registered</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed">
              Your business <span className="font-bold text-[#F4B400]">{businessName}</span> has been assigned to an onboarding specialist. We will guide you through catalog import and hardware setup.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4B400]/20 text-[#2E2E2E] dark:text-[#FFD54F] text-xs font-bold mb-2">
                <Store className="w-3.5 h-3.5" />
                <span>Partner with TOGOSERVE</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Grow Your Business with TOGOSERVE
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                Connect with thousands of local customers, streamline counter sales with cloud POS, and tap into dedicated on-demand fleet delivery.
              </p>
            </div>

            {/* Merchant Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6 text-xs">
              <div className="p-3 rounded-xl bg-[#EBEEEE]/40 dark:bg-neutral-800 border border-[#EBEEEE] dark:border-neutral-700">
                <span className="font-bold text-[#2E2E2E] dark:text-white block">0% Signup Fee</span>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400">Zero upfront listing charges</span>
              </div>
              <div className="p-3 rounded-xl bg-[#EBEEEE]/40 dark:bg-neutral-800 border border-[#EBEEEE] dark:border-neutral-700">
                <span className="font-bold text-[#2E2E2E] dark:text-white block">Omnichannel POS</span>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400">Integrated kitchen & counter sync</span>
              </div>
              <div className="p-3 rounded-xl bg-[#EBEEEE]/40 dark:bg-neutral-800 border border-[#EBEEEE] dark:border-neutral-700">
                <span className="font-bold text-[#2E2E2E] dark:text-white block">Fast Settlements</span>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400">Next-day automated bank payouts</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-300 mb-1 uppercase tracking-wider">
                    Business / Store Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Manila Heritage Bakehouse"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-[#2E2E2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-300 mb-1 uppercase tracking-wider">
                    Store Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-[#2E2E2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
                  >
                    <option value="Food & Beverage">Food & Beverage (Restaurant / Cafe)</option>
                    <option value="Grocery & Fresh">Grocery & Fresh Produce</option>
                    <option value="Pharmacy & Health">Pharmacy & Healthcare</option>
                    <option value="Retail & Fashion">Retail & Lifestyle</option>
                    <option value="Flowers & Gifts">Flowers & Gift Specialty</option>
                    <option value="Pet Care">Pet Care & Supplies</option>
                    <option value="Beauty & Wellness">Beauty & Cosmetics</option>
                    <option value="Local Services">Professional Trade Services</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-300 mb-1 uppercase tracking-wider">
                    Owner / Manager Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-[#2E2E2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-300 mb-1 uppercase tracking-wider">
                    Active Mobile Phone
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+63 9XX XXX XXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-[#2E2E2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-300 mb-1 uppercase tracking-wider">
                    Business Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="merchant@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-[#2E2E2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-300 mb-1 uppercase tracking-wider">
                    Primary Store City / District
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bonifacio Global City, Taguig"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-[#2E2E2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#F4B400] hover:bg-[#FFD54F] text-[#2E2E2E] font-black text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-4"
              >
                <span>Submit Merchant Application</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
