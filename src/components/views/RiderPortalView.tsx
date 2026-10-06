import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
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
  Check,
  X,
  FileCheck
} from 'lucide-react';

export const RiderPortalView: React.FC = () => {
  const { orders, updateOrderStatus, isDarkMode, addToast } = useApp();

  const [isOnline, setIsOnline] = useState(true);
  const [activeStep, setActiveStep] = useState<number>(2); // 1: to store, 2: pick up, 3: to customer, 4: e-POD
  const [enteredOtp, setEnteredOtp] = useState('');
  const [signatureName, setSignatureName] = useState('D. Dela Cruz');

  // Find active assigned order for the rider
  const currentAssignedOrder = orders.find(
    (o) => o.status === 'IN_TRANSIT' || o.status === 'READY_FOR_PICKUP' || o.status === 'PREPARING'
  ) || orders[0];

  const handleNextRiderStep = () => {
    if (activeStep === 1) {
      setActiveStep(2);
      addToast('info', 'Arrived at Store', 'Merchant informed that you have arrived at the store.');
    } else if (activeStep === 2) {
      setActiveStep(3);
      if (currentAssignedOrder) {
        updateOrderStatus(currentAssignedOrder.id, 'IN_TRANSIT');
      }
      addToast('success', 'Order Picked Up', 'Heading to customer delivery location.');
    } else if (activeStep === 3) {
      setActiveStep(4);
      addToast('info', 'Arrived at Dropoff', 'Waiting for customer OTP and electronic handover signature.');
    } else if (activeStep === 4) {
      setActiveStep(1);
      if (currentAssignedOrder) {
        updateOrderStatus(currentAssignedOrder.id, 'DELIVERED');
      }
      addToast('success', 'Delivery Completed', 'Trip finalized. Earnings added to rider wallet.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-12">
      {/* Rider Status & Earnings Header */}
      <div className="bg-[#071A2F] text-white p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFC928] text-[#071A2F] font-extrabold flex items-center justify-center text-base">
              MR
            </div>
            <div>
              <h2 className="text-sm font-bold">Marcus Ramirez</h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Honda Click 150i • Plate: NQ-8492 • Rating: 4.9 ★
              </p>
            </div>
          </div>

          {/* Large Online / Offline Switch */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
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
          <div className="p-2 rounded-xl bg-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Today's Earnings</span>
            <div className="text-base font-extrabold font-mono text-[#FFC928] mt-0.5">₱1,240.00</div>
          </div>
          <div className="p-2 rounded-xl bg-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Trips Done</span>
            <div className="text-base font-extrabold font-mono mt-0.5">14 Trips</div>
          </div>
          <div className="p-2 rounded-xl bg-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Acceptance</span>
            <div className="text-base font-extrabold font-mono text-[#16845B] mt-0.5">98%</div>
          </div>
        </div>
      </div>

      {/* ACTIVE DELIVERY MISSION CARD */}
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
                Active Assigned Delivery
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
                  ? 'Head to Store (Pickup)'
                  : activeStep === 2
                  ? 'Verify Merchant Items & Pack'
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
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Dropoff Address</p>
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
                <span>Electronic Proof of Delivery (e-POD) Mandatory</span>
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
                  Received by (Full Name Signature)
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

          {/* LARGE TOUCH ACTION BUTTON */}
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
              ? 'Stand by for AI Dispatch engine (A21) route offers nearby.'
              : 'Toggle Online switch above to start receiving delivery opportunities.'}
          </p>
        </div>
      )}
    </div>
  );
};
