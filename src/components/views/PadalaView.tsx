import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Truck,
  Package,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  ArrowRight,
  Calculator,
  User,
  Phone,
  Car,
  Check
} from 'lucide-react';
import { VehicleType, PadalaShipment } from '../../types';

export const PadalaView: React.FC = () => {
  const { padalaShipments, createPadalaShipment, updatePadalaStatus, isDarkMode } = useApp();

  const [activeTab, setActiveTab] = useState<'book' | 'tracking'>('book');

  // 4-Step Guided Form State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [senderName, setSenderName] = useState('Danilo Dela Cruz');
  const [senderPhone, setSenderPhone] = useState('+63 917 555 0192');
  const [pickupAddress, setPickupAddress] = useState('BGC Corporate Center 1, 11th Ave, Taguig City');

  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');

  const [packageType, setPackageType] = useState<PadalaShipment['packageType']>('DOCUMENTS');
  const [weightKg, setWeightKg] = useState<number>(1.5);
  const [lengthCm, setLengthCm] = useState<number>(30);
  const [widthCm, setWidthCm] = useState<number>(20);
  const [heightCm, setHeightCm] = useState<number>(10);
  const [vehicle, setVehicle] = useState<VehicleType>('MOTORCYCLE');
  const [serviceType, setServiceType] = useState<PadalaShipment['serviceType']>('EXPRESS');

  // Volumetric weight formula: (L x W x H) / 5000
  const volumetricWeight = ((lengthCm * widthCm * heightCm) / 5000);
  const billableWeight = Math.max(weightKg, volumetricWeight);

  // Quote calculation based on vehicle & distance (estimated 8.5 km)
  const estimatedDistance = 8.5;
  const vehicleBaseRates: Record<VehicleType, number> = {
    MOTORCYCLE: 60,
    CAR: 140,
    MPV: 240,
    VAN: 450,
    PICKUP: 600,
    TRUCK: 1200,
  };
  const vehiclePerKmRates: Record<VehicleType, number> = {
    MOTORCYCLE: 10,
    CAR: 18,
    MPV: 26,
    VAN: 38,
    PICKUP: 48,
    TRUCK: 95,
  };

  const calculatedQuote = Math.round(
    vehicleBaseRates[vehicle] +
      estimatedDistance * vehiclePerKmRates[vehicle] +
      (serviceType === 'EXPRESS' ? 40 : 0) +
      billableWeight * 5
  );

  const handleBooking = () => {
    createPadalaShipment({
      senderName,
      senderPhone,
      pickupAddress,
      recipientName: recipientName || 'Acme Logistics Hub',
      recipientPhone: recipientPhone || '+63 918 223 4455',
      dropoffAddress: dropoffAddress || 'Ayala Triangle Gardens, Makati City',
      packageType,
      weightKg,
      dimensionsCm: { length: lengthCm, width: widthCm, height: heightCm },
      vehicle,
      quoteAmount: calculatedQuote,
      distanceKm: estimatedDistance,
      serviceType,
    });
    // Reset to step 1 and view tracking
    setCurrentStep(1);
    setActiveTab('tracking');
  };

  const vehicleOptions: { type: VehicleType; label: string; maxWeight: string; icon: string }[] = [
    { type: 'MOTORCYCLE', label: 'Motorcycle', maxWeight: 'Up to 20kg', icon: '🛵' },
    { type: 'CAR', label: 'Sedan / Car', maxWeight: 'Up to 150kg', icon: '🚗' },
    { type: 'MPV', label: '6-Seater MPV', maxWeight: 'Up to 300kg', icon: '🚙' },
    { type: 'VAN', label: 'Cargo Van', maxWeight: 'Up to 800kg', icon: '🚐' },
    { type: 'PICKUP', label: 'Pickup Bed', maxWeight: 'Up to 1,000kg', icon: '🛻' },
    { type: 'TRUCK', label: 'Light Truck', maxWeight: 'Up to 2,500kg', icon: '🚛' },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Top Header Banner */}
      <div className="bg-[#071A2F] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFC928]/20 text-[#FFC928] text-xs font-bold border border-[#FFC928]/30 mb-2">
            <Truck className="w-3.5 h-3.5" />
            <span>TOGO Padala Logistics Core</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Express Courier & Fleet Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
            Guaranteed door-to-door delivery with real-time GPS telemetry, volumetric vehicle
            matching, and tamper-proof electronic proof of delivery (e-POD).
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-white/10 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setActiveTab('book')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'book'
                ? 'bg-[#FFC928] text-[#071A2F] shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            New Booking
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'tracking'
                ? 'bg-[#FFC928] text-[#071A2F] shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Live Tracking ({padalaShipments.length})
          </button>
        </div>
      </div>

      {activeTab === 'book' ? (
        <div
          className={`rounded-2xl border p-6 sm:p-8 transition-colors ${
            isDarkMode
              ? 'bg-[#0B223D] border-slate-800 text-white'
              : 'bg-white border-slate-200 text-[#17212B] shadow-sm'
          }`}
        >
          {/* 4-Step Stepper Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className={currentStep >= 1 ? 'text-[#D9A514]' : 'text-slate-400'}>
                1. Pickup Origin
              </span>
              <span className={currentStep >= 2 ? 'text-[#D9A514]' : 'text-slate-400'}>
                2. Recipient Dropoff
              </span>
              <span className={currentStep >= 3 ? 'text-[#D9A514]' : 'text-slate-400'}>
                3. Parcel & Vehicle
              </span>
              <span className={currentStep >= 4 ? 'text-[#D9A514]' : 'text-slate-400'}>
                4. Quote & Dispatch
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#D9A514] h-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* STEP 1: PICKUP */}
          {currentStep === 1 && (
            <div className="space-y-4 max-w-xl mx-auto">
              <h3 className="text-base font-bold">Step 1 of 4: Pickup Location & Sender</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Specify who and where our dispatch rider will collect the package.
              </p>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold mb-1">Sender Name</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Sender Mobile Phone</label>
                  <input
                    type="text"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Pickup Address</label>
                  <input
                    type="text"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 bg-[#FFC928] text-[#071A2F] font-bold text-xs rounded-xl flex items-center gap-2 hover:bg-[#D9A514] transition-colors"
                >
                  <span>Continue to Recipient</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: RECIPIENT */}
          {currentStep === 2 && (
            <div className="space-y-4 max-w-xl mx-auto">
              <h3 className="text-base font-bold">Step 2 of 4: Recipient Destination</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Where should the package be delivered safely?
              </p>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold mb-1">Recipient Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Maria Clara Santos"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Recipient Mobile</label>
                  <input
                    type="text"
                    placeholder="e.g. +63 918 555 4321"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Dropoff Address</label>
                  <input
                    type="text"
                    placeholder="e.g. Penthouse B, Enterprise Center, Ayala Ave, Makati"
                    value={dropoffAddress}
                    onChange={(e) => setDropoffAddress(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded-xl"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 bg-[#FFC928] text-[#071A2F] font-bold text-xs rounded-xl flex items-center gap-2 hover:bg-[#D9A514] transition-colors"
                >
                  <span>Continue to Package Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PACKAGE & VEHICLE */}
          {currentStep === 3 && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <h3 className="text-base font-bold">Step 3 of 4: Parcel Dimensions & Vehicle Match</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Volumetric weight algorithm matches optimal vehicle class for lowest cost.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold mb-1">Category</label>
                  <select
                    value={packageType}
                    onChange={(e) => setPackageType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="DOCUMENTS">Official Documents / Contracts</option>
                    <option value="FOOD_PARCEL">Catering & Food Parcels</option>
                    <option value="ELECTRONICS">Electronics & Gadgets</option>
                    <option value="CLOTHING">Apparel & Textiles</option>
                    <option value="FRAGILE">Fragile Glassware / Cakes</option>
                    <option value="HEAVY_CARGO">Pallet / Heavy Cargo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 1)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              {/* Dimensions */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Dimensions (L × W × H in cm)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    placeholder="Length"
                    value={lengthCm}
                    onChange={(e) => setLengthCm(parseInt(e.target.value) || 10)}
                    className="text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                  <input
                    type="number"
                    placeholder="Width"
                    value={widthCm}
                    onChange={(e) => setWidthCm(parseInt(e.target.value) || 10)}
                    className="text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                  <input
                    type="number"
                    placeholder="Height"
                    value={heightCm}
                    onChange={(e) => setHeightCm(parseInt(e.target.value) || 10)}
                    className="text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">
                  Volumetric weight: {volumetricWeight.toFixed(2)} kg (Billable weight:{' '}
                  {billableWeight.toFixed(2)} kg)
                </p>
              </div>

              {/* Vehicle Options */}
              <div>
                <label className="block text-xs font-semibold mb-2">Select Vehicle Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {vehicleOptions.map((v) => (
                    <button
                      key={v.type}
                      type="button"
                      onClick={() => setVehicle(v.type)}
                      className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                        vehicle === v.type
                          ? 'border-[#D9A514] bg-[#FFC928]/15 text-[#D9A514] font-bold shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span className="text-xl">{v.icon}</span>
                      <div className="min-w-0">
                        <div className="text-xs truncate">{v.label}</div>
                        <div className="text-[10px] text-slate-400">{v.maxWeight}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded-xl"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-5 py-2.5 bg-[#FFC928] text-[#071A2F] font-bold text-xs rounded-xl flex items-center gap-2 hover:bg-[#D9A514] transition-colors"
                >
                  <span>Review Instant Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: QUOTE & BOOKING */}
          {currentStep === 4 && (
            <div className="space-y-5 max-w-xl mx-auto">
              <h3 className="text-base font-bold">Step 4 of 4: Rate Quote & Booking Confirmation</h3>

              {/* Summary Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">Pickup Origin</span>
                  <span className="font-semibold text-right max-w-[240px] truncate">
                    {pickupAddress}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">Destination</span>
                  <span className="font-semibold text-right max-w-[240px] truncate">
                    {dropoffAddress || 'Ayala Triangle Gardens, Makati City'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">Vehicle / Vehicle Class</span>
                  <span className="font-semibold uppercase font-mono">{vehicle}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Distance & Billable Weight</span>
                  <span className="font-mono">{estimatedDistance} km • {billableWeight.toFixed(1)} kg</span>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between font-bold text-sm">
                  <span>Guaranteed Quote</span>
                  <span className="text-xl font-mono text-[#D9A514]">₱{calculatedQuote}.00</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-[#16845B]" />
                <span>Includes real-time GPS tracking and OTP verification code at drop-off.</span>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded-xl"
                >
                  Back
                </button>
                <button
                  onClick={handleBooking}
                  className="px-6 py-2.5 bg-[#FFC928] hover:bg-[#D9A514] text-[#071A2F] font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <span>Dispatch & Book Shipment</span>
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* TRACKING LIST */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold">Active TOGO Padala Shipments</h2>
            <span className="text-xs text-slate-400 font-mono">
              {padalaShipments.length} logged
            </span>
          </div>

          <div className="space-y-3">
            {padalaShipments.map((shipment) => (
              <div
                key={shipment.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isDarkMode
                    ? 'bg-[#0B223D] border-slate-800 text-white'
                    : 'bg-white border-slate-200 text-[#17212B] shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#D9A514]" />
                    <span className="font-mono text-xs font-bold">{shipment.trackingNumber}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFC928]/20 text-[#D9A514]">
                      {shipment.vehicle}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#D9A514]">
                      ₱{shipment.quoteAmount.toFixed(2)}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-500">
                      {shipment.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Origin</span>
                    <p className="font-medium truncate">{shipment.pickupAddress}</p>
                    <p className="text-[11px] text-slate-500">{shipment.senderName} ({shipment.senderPhone})</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Destination</span>
                    <p className="font-medium truncate">{shipment.dropoffAddress}</p>
                    <p className="text-[11px] text-slate-500">{shipment.recipientName} ({shipment.recipientPhone})</p>
                  </div>
                </div>

                {/* Proof of Delivery / OTP Section */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="font-mono text-[11px]">
                      <span className="text-slate-400">e-POD OTP: </span>
                      <strong className="text-[#FFC928] bg-black/30 px-1.5 py-0.5 rounded">
                        {shipment.otpCode || '9241'}
                      </strong>
                    </div>
                    {shipment.riderName && (
                      <span className="text-slate-400 text-[11px]">
                        Rider: <strong className="text-slate-300">{shipment.riderName}</strong>
                      </span>
                    )}
                  </div>

                  {shipment.status !== 'DELIVERED' && (
                    <button
                      onClick={() => updatePadalaStatus(shipment.id, 'DELIVERED', 'Danilo D. (Recipient)')}
                      className="px-3 py-1 bg-[#16845B] hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Simulate e-POD Handover</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
