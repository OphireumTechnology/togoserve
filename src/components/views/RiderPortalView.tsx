import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BrandMark } from '../brand/BrandLogo';
import { StatusBadge, MetricCard } from '../design-system';
import {
  Bike,
  Power,
  Navigation,
  CheckCircle2,
  DollarSign,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  Package,
  FileCheck,
  Wallet,
  Star,
  Award,
  AlertCircle
} from 'lucide-react';

export const RiderPortalView: React.FC = () => {
  const { orders, updateOrderStatus, isDarkMode, addToast } = useApp();

  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<'deliveries' | 'wallet' | 'equipment'>('deliveries');
  const [activeStep, setActiveStep] = useState<number>(2); // 1: to store, 2: pick up, 3: to customer, 4: e-POD
  const [enteredOtp, setEnteredOtp] = useState('8492');
  const [signatureName, setSignatureName] = useState('Danilo Dela Cruz');

  // Active assigned delivery
  const currentAssignedOrder =
    orders.find(
      (o) => o.status === 'IN_TRANSIT' || o.status === 'READY_FOR_PICKUP' || o.status === 'PREPARING'
    ) || orders[0];

  const handleNextRiderStep = () => {
    if (activeStep === 1) {
      setActiveStep(2);
      addToast('info', 'Arrived at Store', 'Merchant notified of rider arrival at store.');
    } else if (activeStep === 2) {
      setActiveStep(3);
      if (currentAssignedOrder) {
        updateOrderStatus(currentAssignedOrder.id, 'IN_TRANSIT');
      }
      addToast('success', 'Order Picked Up', 'Heading to recipient address.');
    } else if (activeStep === 3) {
      setActiveStep(4);
      addToast('info', 'Arrived at Dropoff', 'Prompt recipient for 4-digit handover OTP.');
    } else if (activeStep === 4) {
      setActiveStep(1);
      if (currentAssignedOrder) {
        updateOrderStatus(currentAssignedOrder.id, 'DELIVERED');
      }
      addToast('success', 'Delivery Completed', 'Trip completed. Earnings credited to rider wallet.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-12">
      {/* Rider Status & Earnings Header */}
      <div className="bg-[#071A2F] text-white p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-[#FFC928] text-[#071A2F] font-extrabold flex items-center justify-center text-base shadow-md">
                MR
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#071A2F] p-0.5 rounded-full border border-white/20">
                <BrandMark size={16} isDark={true} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold">Marcus Ramirez</h2>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                  Verified Tier 1
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Honda Click 150i • NC-8492 • 4.9 ★ Rating
              </p>
            </div>
          </div>

          {/* Large Online / Offline Switch */}
          <button
            onClick={() => {
              setIsOnline(!isOnline);
              addToast('info', 'Fleet Status', isOnline ? 'Switched to Offline' : 'Switched to Online');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-md active:scale-95 ${
              isOnline
                ? 'bg-[#16845B] text-white hover:bg-emerald-700'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </button>
        </div>

        {/* Quick Earnings Metrics */}
        <div className="grid grid-cols-3 gap-2 pt-4 text-center">
          <div className="p-2.5 rounded-xl bg-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Today's Earnings</span>
            <div className="text-base font-extrabold font-mono text-[#FFC928] mt-0.5">₱1,240.00</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Completed Trips</span>
            <div className="text-base font-extrabold font-mono mt-0.5">14 Trips</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Acceptance SLA</span>
            <div className="text-base font-extrabold font-mono text-[#16845B] mt-0.5">98.5%</div>
          </div>
        </div>
      </div>

      {/* Rider Navigation Sub-Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl text-xs font-bold">
        {[
          { id: 'deliveries', label: 'Active Delivery' },
          { id: 'wallet', label: 'Wallet & Payouts' },
          { id: 'equipment', label: 'TOGOSERVE Gear & Vehicle' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex-1 py-2 rounded-lg transition-colors text-center ${
              activeTab === t.id
                ? 'bg-[#071A2F] dark:bg-[#FFC928] text-white dark:text-[#071A2F] shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: ACTIVE MISSIONS & DELIVERIES */}
      {activeTab === 'deliveries' && (
        <>
          {isOnline && currentAssignedOrder ? (
            <div
              className={`rounded-2xl border p-5 shadow-sm space-y-4 ${
                isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B]'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16845B] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#16845B]"></span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D9A514]">
                    Assigned Delivery Dispatch
                  </span>
                </div>
                <span className="text-xs font-mono font-bold">{currentAssignedOrder.orderNumber}</span>
              </div>

              {/* Stepper info */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-[#D9A514]" />
                  <span className="font-bold">
                    {activeStep === 1
                      ? 'En Route to Store (Pickup)'
                      : activeStep === 2
                      ? 'Verify Store Order & Pack Bag'
                      : activeStep === 3
                      ? 'In Transit to Customer (BGC)'
                      : 'Customer Handover & e-POD'}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-slate-400">Step {activeStep} of 4</span>
              </div>

              {/* Route coordinates */}
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    A
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Pickup Store</p>
                    <p className="font-bold">{currentAssignedOrder.storeName}</p>
                    <p className="text-slate-500 text-[11px]">BGC Central Plaza Unit 4, Taguig City</p>
                  </div>
                </div>

                <div className="border-l-2 border-dashed border-slate-300 dark:border-slate-700 ml-2.5 h-4" />

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#FFC928] text-[#071A2F] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    B
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Customer Dropoff</p>
                    <p className="font-bold">{currentAssignedOrder.customerName}</p>
                    <p className="text-slate-500 text-[11px]">{currentAssignedOrder.customerAddress}</p>
                  </div>
                </div>
              </div>

              {/* STEP 4: e-POD Form if on Step 4 */}
              {activeStep === 4 && (
                <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-400">
                    <FileCheck className="w-4 h-4" />
                    <span>Electronic Proof of Delivery (e-POD)</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold mb-1">
                      Customer 4-Digit Handover OTP
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="e.g. 8492"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      className="w-full text-center text-lg font-mono tracking-widest font-extrabold p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold mb-1">
                      Recipient Signature Name
                    </label>
                    <input
                      type="text"
                      value={signatureName}
                      onChange={(e) => setSignatureName(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* ACTION BUTTON */}
              <button
                onClick={handleNextRiderStep}
                className="w-full py-4 bg-[#FFC928] hover:bg-[#D9A514] text-[#071A2F] font-extrabold text-sm rounded-xl shadow-lg transition-transform active:scale-98 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>
                  {activeStep === 1
                    ? 'Confirm Store Arrival'
                    : activeStep === 2
                    ? 'Confirm Package Pickup & Depart'
                    : activeStep === 3
                    ? 'Confirm Customer Arrival'
                    : 'Finalize Delivery & Complete Trip'}
                </span>
              </button>
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
              <Bike className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-sm font-bold">You are currently {isOnline ? 'Online' : 'Offline'}</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {isOnline
                  ? 'Awaiting next route broadcast from TOGOSERVE AI Dispatch (A21).'
                  : 'Turn Online to start receiving merchant pickup offers.'}
              </p>
            </div>
          )}
        </>
      )}

      {/* TAB 2: WALLET */}
      {activeTab === 'wallet' && (
        <div
          className={`p-6 rounded-2xl border space-y-5 ${
            isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B]'
          }`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs text-slate-400 font-medium">Available Payout Balance</span>
              <div className="text-2xl font-bold font-mono text-[#D9A514]">₱4,820.50</div>
            </div>
            <button
              onClick={() => addToast('success', 'Disbursement Initiated', 'Instant bank withdrawal of ₱4,820.50 processed.')}
              className="px-4 py-2 bg-[#FFC928] hover:bg-[#D9A514] text-[#071A2F] font-bold text-xs rounded-xl shadow-sm transition-colors"
            >
              Withdraw to Bank / E-Wallet
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold">Recent Trip Payouts</h4>
            {[
              { id: 'TRP-9841', desc: 'BGC to Makati Delivery', amount: 55.0, time: 'Today 06:15 AM' },
              { id: 'TRP-9840', desc: 'Bel-Air Food Order', amount: 63.5, time: 'Today 06:22 AM' },
              { id: 'TRP-9838', desc: 'Greenbelt Organics Drop', amount: 76.5, time: 'Today 05:30 AM' },
            ].map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex justify-between items-center"
              >
                <div>
                  <span className="font-bold font-mono">{p.id}</span> • {p.desc}
                  <div className="text-[10px] text-slate-400">{p.time}</div>
                </div>
                <span className="font-mono font-bold text-emerald-500">+₱{p.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GEAR & EQUIPMENT */}
      {activeTab === 'equipment' && (
        <div
          className={`p-6 rounded-2xl border space-y-4 ${
            isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#071A2F] border border-white/10 text-white">
              <BrandMark size={32} isDark={true} />
            </div>
            <div>
              <h3 className="text-base font-bold">Authorized TOGOSERVE Delivery Gear</h3>
              <p className="text-xs text-slate-400">Official company thermal delivery bag & equipment inspection</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="font-bold block mb-1">Thermal Delivery Box</span>
              <p className="text-slate-500">65L Double-Insulated Waterproof Box with official TS Arrow Badge.</p>
              <span className="text-[10px] text-emerald-500 font-bold block mt-2">✓ Verified Clean</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="font-bold block mb-1">Vehicle Registration</span>
              <p className="text-slate-500">Honda Click 150i (Plate: NC-8492) OR/CR valid until Oct 2027.</p>
              <span className="text-[10px] text-emerald-500 font-bold block mt-2">✓ Compliant</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
