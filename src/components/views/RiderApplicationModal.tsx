import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Bike,
  CheckCircle2,
  Phone,
  Mail,
  User,
  ShieldCheck,
  ArrowRight,
  Truck
} from 'lucide-react';
import { VehicleType } from '../../types';

interface RiderApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RiderApplicationModal: React.FC<RiderApplicationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isDarkMode, addToast } = useApp();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Metro Manila');
  const [vehicle, setVehicle] = useState<VehicleType>('MOTORCYCLE');
  const [plateNumber, setPlateNumber] = useState('');
  const [hasLicense, setHasLicense] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    addToast('success', 'Rider Application Submitted', `Welcome ${fullName}! Our logistics dispatcher will review your driver credentials.`);
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
          aria-label="Close rider application"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#16845B]/10 text-[#16845B] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black">Application Received</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed">
              Your courier registration has been logged with plate number <span className="font-mono font-bold text-[#F4B400]">{plateNumber || 'Pending'}</span>. You will receive an SMS regarding orientation and equipment handover.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4B400]/20 text-[#2E2E2E] dark:text-[#FFD54F] text-xs font-bold mb-2">
                <Bike className="w-3.5 h-3.5" />
                <span>TOGO Padala Fleet Network</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Drive & Deliver with TOGOSERVE
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                Enjoy flexible schedules, transparent per-kilometer earnings, daily fuel incentives, and unified order batching.
              </p>
            </div>

            {/* Rider Perks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6 text-xs">
              <div className="p-3 rounded-xl bg-[#EBEEEE]/40 dark:bg-neutral-800 border border-[#EBEEEE] dark:border-neutral-700">
                <span className="font-bold text-[#2E2E2E] dark:text-white block">Daily Payouts</span>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400">Withdraw earnings directly to e-wallet</span>
              </div>
              <div className="p-3 rounded-xl bg-[#EBEEEE]/40 dark:bg-neutral-800 border border-[#EBEEEE] dark:border-neutral-700">
                <span className="font-bold text-[#2E2E2E] dark:text-white block">Intelligent Routing</span>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400">AI route batching minimizes dead miles</span>
              </div>
              <div className="p-3 rounded-xl bg-[#EBEEEE]/40 dark:bg-neutral-800 border border-[#EBEEEE] dark:border-neutral-700">
                <span className="font-bold text-[#2E2E2E] dark:text-white block">Rider Insurance</span>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400">Accident coverage on every active trip</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-300 mb-1 uppercase tracking-wider">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="First and Last Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-[#2E2E2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-300 mb-1 uppercase tracking-wider">
                    Mobile Phone (For SMS dispatch)
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
                    Vehicle Type
                  </label>
                  <select
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value as VehicleType)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-[#2E2E2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
                  >
                    <option value="MOTORCYCLE">Motorcycle (Express Food & Parcels up to 20kg)</option>
                    <option value="CAR">Sedan / 4-Wheel (Bulk groceries & parcels up to 150kg)</option>
                    <option value="MPV">MPV / 6-Seater (Catering & medium cargo up to 300kg)</option>
                    <option value="VAN">Cargo Van (Commercial goods up to 800kg)</option>
                    <option value="PICKUP">Pickup Bed (Hardware & agricultural up to 1,000kg)</option>
                    <option value="TRUCK">Light Truck (Enterprise freight up to 2,500kg)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-300 mb-1 uppercase tracking-wider">
                    Vehicle Plate #
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NCR-1234"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-[#2E2E2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-300 mb-1 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="rider@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-[#2E2E2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-300 mb-1 uppercase tracking-wider">
                    Hub Base City
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Taguig / Makati / Pasig"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-[#2E2E2E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 text-xs text-neutral-600 dark:text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasLicense}
                  onChange={(e) => setHasLicense(e.target.checked)}
                  className="rounded text-[#F4B400] focus:ring-[#F4B400]"
                />
                <span>I confirm I possess a valid Philippine Professional / Non-Prof Driver's License and active vehicle OR/CR.</span>
              </label>

              <button
                type="submit"
                disabled={!hasLicense}
                className="w-full py-3 px-4 bg-[#F4B400] hover:bg-[#FFD54F] disabled:opacity-50 text-[#2E2E2E] font-black text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-4"
              >
                <span>Submit Courier Registration</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
