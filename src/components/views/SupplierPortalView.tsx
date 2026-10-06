import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, MetricCard, PageHeader } from '../design-system';
import { Building2, Package, CheckCircle2, Clock, Phone, Mail, MapPin, Plus, FileText } from 'lucide-react';

export const SupplierPortalView: React.FC = () => {
  const { suppliers, isDarkMode, addToast } = useApp();
  const [selectedSupplier, setSelectedSupplier] = useState(suppliers[0]);

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      <PageHeader
        title="TOGOSERVE Supply & B2B Vendor Network"
        subtitle="Manage wholesale supply contracts, purchase order fulfillment, and agricultural delivery pipelines across Metro Manila and CALABARZON."
        badge="B2B Operations Core"
        actions={
          <button
            onClick={() => addToast('info', 'Vendor Application', 'New vendor onboarding workflow opened.')}
            className="px-4 py-2 bg-[#FFC928] hover:bg-[#D9A514] text-[#071A2F] font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard New Supplier</span>
          </button>
        }
        isDark={true}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Active B2B Suppliers"
          value={suppliers.length}
          icon={<Building2 className="w-4 h-4" />}
          subValue="100% Verified Partners"
          isDark={isDarkMode}
        />
        <MetricCard
          label="Active Purchase Orders"
          value={suppliers.reduce((a, b) => a + b.activePurchaseOrders, 0)}
          icon={<FileText className="w-4 h-4 text-[#FFC928]" />}
          subValue="Scheduled for delivery this week"
          isDark={isDarkMode}
        />
        <MetricCard
          label="Avg Fulfillment Lead Time"
          value="1.8 Days"
          icon={<Clock className="w-4 h-4 text-[#16845B]" />}
          subValue="Same-day cold storage support"
          isDark={isDarkMode}
        />
        <MetricCard
          label="Vendor Quality Score"
          value="4.9 / 5.0"
          icon={<CheckCircle2 className="w-4 h-4 text-[#16845B]" />}
          subValue="Based on 480 merchant audits"
          isDark={isDarkMode}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Suppliers List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-sm font-bold">Verified Wholesale Suppliers</h3>
          <div className="space-y-2">
            {suppliers.map((sup) => (
              <button
                key={sup.id}
                onClick={() => setSelectedSupplier(sup)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedSupplier?.id === sup.id
                    ? 'border-[#D9A514] bg-[#FFC928]/10 text-slate-900 dark:text-white shadow-xs'
                    : isDarkMode
                    ? 'bg-[#0B223D] border-slate-800 text-slate-300 hover:border-slate-700'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs">{sup.name}</span>
                  <span className="text-[10px] font-mono font-bold text-[#D9A514]">★ {sup.rating}</span>
                </div>
                <p className="text-[11px] text-slate-400">{sup.category}</p>
                <p className="text-[10px] text-slate-500 mt-1">{sup.location}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Supplier Details */}
        <div
          className={`lg:col-span-2 p-6 rounded-2xl border space-y-5 ${
            isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B]'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">{selectedSupplier.name}</h3>
                <StatusBadge status={selectedSupplier.verified ? 'VERIFIED' : 'PENDING'} />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{selectedSupplier.category}</p>
            </div>
            <button
              onClick={() => addToast('success', 'RFQ Sent', `Request for quotation generated for ${selectedSupplier.name}`)}
              className="px-4 py-2 bg-[#FFC928] hover:bg-[#D9A514] text-[#071A2F] font-bold text-xs rounded-xl transition-colors"
            >
              Issue Purchase Order
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Primary Contact</span>
              <p className="font-bold text-sm">{selectedSupplier.contactPerson}</p>
              <div className="space-y-1 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{selectedSupplier.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{selectedSupplier.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{selectedSupplier.location}</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Order Terms & SLA</span>
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Delivery Lead Time</span>
                  <span className="font-bold font-mono">{selectedSupplier.deliveryLeadDays} Business Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Minimum Order Value</span>
                  <span className="font-bold font-mono text-[#D9A514]">
                    ₱{selectedSupplier.minimumOrderValue.toLocaleString()}.00
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Active Live POs</span>
                  <span className="font-bold font-mono">{selectedSupplier.activePurchaseOrders} Orders</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
