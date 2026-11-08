import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Search,
  Truck,
  Store,
  Clock,
  CheckCircle2,
  Package,
  MapPin,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { StatusBadge } from '../design-system';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTrackingId?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  initialTrackingId = '',
}) => {
  const { orders, padalaShipments, isDarkMode, currentUser } = useApp();
  const [searchInput, setSearchInput] = useState(initialTrackingId);
  const [searchedId, setSearchedId] = useState(initialTrackingId);

  if (!isOpen) return null;

  // Real customer orders from session or user account
  const customerOrders = orders.filter(
    (o) => !currentUser || o.customerId === currentUser.id || o.customerId === 'cust-anon'
  );

  // Look up searched order or shipment
  const matchedOrder = searchedId
    ? orders.find((o) => o.orderNumber.toLowerCase() === searchedId.trim().toLowerCase() || o.id === searchedId.trim())
    : null;

  const matchedShipment = searchedId
    ? padalaShipments.find(
        (s) => s.trackingNumber.toLowerCase() === searchedId.trim().toLowerCase() || s.id === searchedId.trim()
      )
    : null;

  // Selected order to display: either matched search or the first active customer order
  const activeOrderToDisplay =
    matchedOrder || (customerOrders.length > 0 && !searchedId ? customerOrders[0] : null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedId(searchInput.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-8 transition-colors ${
          isDarkMode
            ? 'bg-[#1C1C1C] border border-neutral-700 text-white'
            : 'bg-white border border-[#EBEEEE] text-[#2E2E2E]'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-full transition-colors focus:outline-none"
          aria-label="Close tracking modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4B400]/20 text-[#2E2E2E] dark:text-[#FFD54F] text-xs font-bold mb-2">
            <Truck className="w-3.5 h-3.5" />
            <span>Authorized Order & Shipment Telematics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Track Order & Delivery
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Real-time fulfillment tracking for verified marketplace transactions and TOGO Padala shipments.
          </p>
        </div>

        {/* Search Bar for Order ID */}
        <form onSubmit={handleSearchSubmit} className="mb-6">
          <div className="flex gap-2">
            <div className="relative grow">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Enter Order # (e.g. TGS-2026-...) or Padala tracking #"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-[#2E2E2E] dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#F4B400] hover:bg-[#FFD54F] text-[#2E2E2E] font-bold text-xs sm:text-sm rounded-xl transition-colors shrink-0"
            >
              Track
            </button>
          </div>
        </form>

        {/* Display Verified Order */}
        {activeOrderToDisplay ? (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-[#EBEEEE]/40 dark:bg-neutral-850 border border-[#EBEEEE] dark:border-neutral-750">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-neutral-200 dark:border-neutral-700">
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">Order Reference</span>
                  <h3 className="font-mono text-base font-bold text-[#F4B400]">
                    {activeOrderToDisplay.orderNumber}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={activeOrderToDisplay.status} />
                  <span className="text-xs text-neutral-400">
                    {new Date(activeOrderToDisplay.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                  <span className="text-[#2E2E2E] dark:text-white font-bold">Confirmed</span>
                  <span className={activeOrderToDisplay.trackingStep >= 3 ? 'text-[#2E2E2E] dark:text-white font-bold' : ''}>
                    Accepted
                  </span>
                  <span className={activeOrderToDisplay.trackingStep >= 4 ? 'text-[#2E2E2E] dark:text-white font-bold' : ''}>
                    Preparing
                  </span>
                  <span className={activeOrderToDisplay.trackingStep >= 7 ? 'text-[#2E2E2E] dark:text-white font-bold' : ''}>
                    In Transit
                  </span>
                  <span className={activeOrderToDisplay.trackingStep >= 10 ? 'text-[#16845B] font-bold' : ''}>
                    Delivered
                  </span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#F4B400] h-full transition-all duration-500 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.max(15, (activeOrderToDisplay.trackingStep / 10) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Order Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-medium text-neutral-400 uppercase">Merchant</span>
                  <p className="font-bold text-[#2E2E2E] dark:text-white flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-[#F4B400]" />
                    <span>{activeOrderToDisplay.storeName}</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-medium text-neutral-400 uppercase">Courier / Rider</span>
                  <p className="font-bold text-[#2E2E2E] dark:text-white flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#16845B]" />
                    <span>{activeOrderToDisplay.riderName || 'Fulfillment dispatch pending'}</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-medium text-neutral-400 uppercase">Delivery Destination</span>
                  <p className="text-neutral-600 dark:text-neutral-300 flex items-start gap-1.5 line-clamp-2">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                    <span>{activeOrderToDisplay.customerAddress}</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-medium text-neutral-400 uppercase">Total Amount</span>
                  <p className="font-mono font-black text-sm text-[#F4B400]">
                    ₱{activeOrderToDisplay.total.toFixed(2)}{' '}
                    <span className="text-[10px] text-neutral-400 font-normal">({activeOrderToDisplay.paymentMethod})</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Items Summary */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Order Items ({activeOrderToDisplay.items.length})
              </h4>
              <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border-y border-neutral-200 dark:divide-neutral-800">
                {activeOrderToDisplay.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-neutral-400">{item.quantity}x</span>
                      <span className="font-medium text-[#2E2E2E] dark:text-white">{item.product.name}</span>
                    </div>
                    <span className="font-mono font-semibold text-neutral-600 dark:text-neutral-300">
                      ₱{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : matchedShipment ? (
          /* Padala Shipment Result */
          <div className="p-5 rounded-2xl bg-[#EBEEEE]/40 dark:bg-neutral-850 border border-[#EBEEEE] dark:border-neutral-750 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700 pb-3">
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase">Shipment Waybill</span>
                <h3 className="font-mono text-base font-bold text-[#F4B400]">
                  {matchedShipment.trackingNumber}
                </h3>
              </div>
              <StatusBadge status={matchedShipment.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase">Pickup Location</span>
                <p className="font-medium mt-0.5">{matchedShipment.pickupAddress}</p>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase">Dropoff Destination</span>
                <p className="font-medium mt-0.5">{matchedShipment.dropoffAddress}</p>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase">Assigned Fleet</span>
                <p className="font-medium mt-0.5">{matchedShipment.vehicle} Courier</p>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase">Quote Amount</span>
                <p className="font-mono font-bold text-[#F4B400] mt-0.5">₱{matchedShipment.quoteAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ) : (
          /* Clean Empty State */
          <div className="py-12 text-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 p-6 space-y-3">
            <Package className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto" />
            <h3 className="text-sm font-bold text-[#2E2E2E] dark:text-white">
              {searchedId ? `No order found for "${searchedId}"` : 'No Active Orders in Session'}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed">
              Real-time delivery telematics are activated upon placing a verified marketplace order or scheduling an express TOGO Padala dispatch.
            </p>
          </div>
        )}

        {/* Security Assurance */}
        <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#16845B]" />
            <span>Authenticated Session Encryption • Verified GPS Invariants</span>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-bold text-[#F4B400] hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
