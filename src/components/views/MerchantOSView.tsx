import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MetricCard, StatusBadge, AIWidget } from '../design-system';
import {
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ShoppingBag,
  TrendingUp,
  Tag,
  Users,
  Store,
  Layers,
  Sparkles,
  Truck,
  Building2,
  ShieldCheck,
  FileText,
  ShieldAlert,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { OrderStatus } from '../../types';
import { Logo } from '../brand/Logo';

export const MerchantOSView: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    inventory,
    restockItem,
    ledger,
    suppliers,
    isDarkMode,
    setActivePortal,
    addToast
  } = useApp();

  // Three primary merchant pillars: SELL | OPERATE | GROW
  const [activePillar, setActivePillar] = useState<'OPERATE' | 'SELL' | 'GROW'>('OPERATE');
  const [operateSubTab, setOperateSubTab] = useState<'overview' | 'orders' | 'inventory' | 'procurement' | 'settlement' | 'accreditation'>('overview');

  // Compute metrics
  const todaySales = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((acc, curr) => acc + curr.total, 0);

  const pendingAttentionOrders = orders.filter((o) =>
    ['CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP'].includes(o.status)
  );

  const lowStockItems = inventory.filter((item) => item.status === 'LOW_STOCK');

  const pendingSettlement = ledger
    .filter((l) => l.status === 'PENDING')
    .reduce((acc, l) => acc + l.merchantPayable, 0);

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-[#2E2E2E] text-white rounded-2xl p-6 sm:p-7 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start sm:items-center gap-4">
          <Logo variant="circular" size="lg" className="hidden sm:inline-flex shrink-0" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F4B400]">
                TOGOSERVE Business OS
              </span>
              <span className="text-xs bg-[#2E2E2E] dark:bg-slate-800 text-[#FAFAFA] px-2.5 py-0.5 rounded-full border border-slate-700 dark:border-slate-600 font-medium">
                Aroma Bakehouse & Roastery (Branch #01)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Merchant Operating Ecosystem
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-xl">
              Unified omnichannel commerce connecting Sell, Operate, and Grow modules with real-time inventory and ledger settlements.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePortal('pos')}
            className="px-4 py-2 bg-[#F4B400] hover:bg-[#F4B400] text-[#2E2E2E] font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <span>Launch POS Register</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* THREE PRIMARY MERCHANT PILLARS (SELL | OPERATE | GROW) */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          {(['OPERATE', 'SELL', 'GROW'] as const).map((pillar) => (
            <button
              key={pillar}
              onClick={() => setActivePillar(pillar)}
              className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all ${
                activePillar === pillar
                  ? 'bg-[#2E2E2E] dark:bg-[#F4B400] text-white dark:text-[#2E2E2E] shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/60'
              }`}
            >
              {pillar === 'OPERATE' && 'OPERATE (Kitchen, Stock & Ledger)'}
              {pillar === 'SELL' && 'SELL (Channels & Catalog)'}
              {pillar === 'GROW' && 'GROW (Marketing & Intelligence)'}
            </button>
          ))}
        </div>
      </div>

      {/* PILLAR 1: OPERATE */}
      {activePillar === 'OPERATE' && (
        <div className="space-y-6">
          {/* Sub-tabs under OPERATE */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {[
              { id: 'overview', label: "Today's Performance" },
              { id: 'orders', label: `Kitchen & Orders (${pendingAttentionOrders.length})` },
              { id: 'inventory', label: `Inventory & SKUs (${lowStockItems.length} low)` },
              { id: 'procurement', label: 'B2B Supply Procurement' },
              { id: 'settlement', label: 'Financial Settlement' },
              { id: 'accreditation', label: 'Accreditation & Compliance' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setOperateSubTab(tab.id as any)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  operateSubTab === tab.id
                    ? 'bg-[#F4B400]/20 text-[#F4B400] font-bold border border-[#F4B400]/40'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {operateSubTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  label="Today's Gross Sales"
                  value={`₱${todaySales.toFixed(2)}`}
                  icon={<DollarSign className="w-4 h-4" />}
                  trend={{ direction: 'up', value: '+18.4% vs 7-day avg' }}
                  isDark={isDarkMode}
                />
                <MetricCard
                  label="Orders Needing Attention"
                  value={pendingAttentionOrders.length}
                  icon={<Clock className="w-4 h-4 text-[#F59E0B]" />}
                  subValue="Avg prep: 12.2 mins"
                  isDark={isDarkMode}
                />
                <MetricCard
                  label="Low Stock Alerts"
                  value={lowStockItems.length}
                  icon={<AlertTriangle className="w-4 h-4 text-[#D64545]" />}
                  subValue="Reorder ready in Supply"
                  isDark={isDarkMode}
                />
                <MetricCard
                  label="Pending Settlement"
                  value={`₱${pendingSettlement.toFixed(2)}`}
                  icon={<CheckCircle className="w-4 h-4 text-[#F4B400]" />}
                  subValue="Payout window: Friday"
                  isDark={isDarkMode}
                />
              </div>

              {/* Kitchen fulfillment quick view */}
              <div
                className={`p-5 rounded-2xl border ${
                  isDarkMode ? 'bg-[#1E1E1E] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#2E2E2E] shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold">Live Kitchen Display System (KDS)</h3>
                  <button
                    onClick={() => setOperateSubTab('orders')}
                    className="text-xs text-[#F4B400] hover:underline font-semibold"
                  >
                    Manage All Orders ({orders.length}) →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {pendingAttentionOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-mono font-bold text-[#F4B400]">{ord.orderNumber}</span>
                          <StatusBadge status={ord.status} />
                        </div>
                        <div className="text-xs font-semibold truncate mb-1">{ord.customerName}</div>
                        <ul className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
                          {ord.items.map((i, idx) => (
                            <li key={idx} className="truncate">
                              {i.quantity}x {i.product.name}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold">₱{ord.total.toFixed(2)}</span>
                        <button
                          onClick={() =>
                            updateOrderStatus(
                              ord.id,
                              ord.status === 'CONFIRMED'
                                ? 'PREPARING'
                                : ord.status === 'PREPARING'
                                ? 'READY_FOR_PICKUP'
                                : 'PICKED_UP'
                            )
                          }
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#2E2E2E] dark:bg-[#F4B400] text-white dark:text-[#2E2E2E] hover:opacity-90"
                        >
                          {ord.status === 'CONFIRMED'
                            ? 'Accept'
                            : ord.status === 'PREPARING'
                            ? 'Mark Ready'
                            : 'Hand to Rider'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {operateSubTab === 'orders' && (
            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isDarkMode ? 'bg-[#1E1E1E] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#2E2E2E]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#F4B400]">{ord.orderNumber}</span>
                      <span className="text-xs font-medium text-slate-400">
                        • {ord.customerName} ({ord.customerPhone})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold">₱{ord.total.toFixed(2)}</span>
                      <StatusBadge status={ord.status} />
                    </div>
                  </div>

                  <div className="py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      {ord.items.map((it, idx) => (
                        <p key={idx} className="text-slate-600 dark:text-slate-400">
                          • {it.quantity} × {it.product.name} (₱{it.product.price})
                        </p>
                      ))}
                      <p className="text-[11px] text-slate-400 mt-1">Deliver to: {ord.customerAddress}</p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(['PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'] as OrderStatus[]).map((st) => (
                        <button
                          key={st}
                          onClick={() => updateOrderStatus(ord.id, st)}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                            ord.status === st
                              ? 'bg-[#F4B400] text-[#2E2E2E] border-[#F4B400] shadow-xs'
                              : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {st.replace(/_/g, ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* INVENTORY TAB */}
          {operateSubTab === 'inventory' && (
            <div
              className={`rounded-2xl border p-5 ${
                isDarkMode ? 'bg-[#1E1E1E] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#2E2E2E]'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold">Inventory & Real-Time Stock</h3>
                  <p className="text-xs text-slate-400">
                    Authoritative omnichannel stock deductions across POS, Marketplace, and Catering
                  </p>
                </div>
                <button
                  onClick={() => restockItem('inv-2', 20)}
                  className="px-3 py-1.5 bg-[#F4B400] text-[#2E2E2E] text-xs font-bold rounded-lg hover:bg-[#F4B400] transition-colors"
                >
                  + Restock All Low
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Item Name</th>
                      <th className="p-3">Stock Level</th>
                      <th className="p-3">Unit Cost</th>
                      <th className="p-3">Retail Price</th>
                      <th className="p-3">Supplier</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                    {inventory.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                        <td className="p-3 font-bold">{inv.sku}</td>
                        <td className="p-3 font-sans font-medium">{inv.name}</td>
                        <td className="p-3">
                          <StatusBadge status={inv.status} />
                          <span className="ml-2 font-bold">{inv.stockLevel} units</span>
                        </td>
                        <td className="p-3">₱{inv.unitCost}</td>
                        <td className="p-3 text-[#F4B400] font-bold">₱{inv.retailPrice}</td>
                        <td className="p-3 text-slate-400 font-sans">{inv.supplier}</td>
                        <td className="p-3 font-sans">
                          <button
                            onClick={() => restockItem(inv.id, 15)}
                            className="px-2.5 py-1 text-[11px] font-bold rounded bg-slate-200 dark:bg-slate-700 hover:bg-[#F4B400] hover:text-[#2E2E2E] transition-colors"
                          >
                            + Restock 15
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* B2B PROCUREMENT TAB */}
          {operateSubTab === 'procurement' && (
            <div className="space-y-4">
              <div
                className={`p-5 rounded-2xl border ${
                  isDarkMode ? 'bg-[#1E1E1E] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#2E2E2E]'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold">TOGOSERVE B2B Supply Marketplace</h3>
                    <p className="text-xs text-slate-400">
                      Wholesale purchase orders directly linked to verified agro-industrial suppliers
                    </p>
                  </div>
                  <button
                    onClick={() => setActivePortal('supplier')}
                    className="text-xs font-bold text-[#F4B400] hover:underline"
                  >
                    Open Supplier Hub →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suppliers.map((sup) => (
                    <div
                      key={sup.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">{sup.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-[#EBEEEE] dark:bg-slate-800 text-[#2E2E2E] dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                          Lead: {sup.deliveryLeadDays} days
                        </span>
                      </div>
                      <p className="text-slate-500">{sup.category} • {sup.location}</p>
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <span className="font-mono text-slate-400">Min Order: ₱{sup.minimumOrderValue.toLocaleString()}</span>
                        <button
                          onClick={() => addToast('success', 'PO Draft Created', `Purchase order draft sent to ${sup.name}`)}
                          className="px-3 py-1 bg-[#F4B400] text-[#2E2E2E] font-bold rounded-lg hover:bg-[#FFD54F]"
                        >
                          Create PO
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SETTLEMENT TAB */}
          {operateSubTab === 'settlement' && (
            <div
              className={`rounded-2xl border p-5 ${
                isDarkMode ? 'bg-[#1E1E1E] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#2E2E2E]'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold">Authoritative Ledger & Net Settlement</h3>
                  <p className="text-xs text-slate-400">
                    Direct automated bank payouts with double-entry commission audit
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Total Net Payable</div>
                  <div className="text-base font-bold font-mono text-[#2E2E2E] dark:text-[#FAFAFA]">
                    ₱{pendingSettlement.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Order Ref</th>
                      <th className="p-3">Gross Total</th>
                      <th className="p-3">Platform Commission</th>
                      <th className="p-3">Delivery SLA</th>
                      <th className="p-3">Net Merchant Payable</th>
                      <th className="p-3">Payout Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                    {ledger.map((entry) => (
                      <tr key={entry.id}>
                        <td className="p-3 text-slate-400">{entry.timestamp}</td>
                        <td className="p-3 font-bold text-[#F4B400]">{entry.orderNumber}</td>
                        <td className="p-3 font-bold">₱{entry.grossAmount.toFixed(2)}</td>
                        <td className="p-3 text-slate-400">₱{entry.platformFee.toFixed(2)}</td>
                        <td className="p-3 text-slate-400">₱{entry.deliveryFee.toFixed(2)}</td>
                        <td className="p-3 font-bold text-[#2E2E2E] dark:text-[#FAFAFA]">
                          ₱{entry.merchantPayable.toFixed(2)}
                        </td>
                        <td className="p-3 font-sans">
                          <StatusBadge status={entry.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ACCREDITATION & COMPLIANCE TAB */}
          {operateSubTab === 'accreditation' && (
            <div className="space-y-6">
              {/* Compliance Mandate Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900/60 flex items-start gap-3.5">
                <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs text-amber-900 dark:text-amber-200">
                  <h4 className="font-extrabold text-sm text-amber-950 dark:text-amber-100">
                    Accreditation &amp; KYC/KYB Governance Policy
                  </h4>
                  <p className="leading-relaxed">
                    <strong>Critical Compliance Mandate:</strong> Demonstration merchants are strictly restricted to <code>DEMO</code> or <code>SAMPLE</code> status. Real enterprise accreditation requires verified documentary review (DTI/SEC registration, BIR Form 2303, and Mayor’s Permit) and dual-authorization maker-checker approval.
                  </p>
                </div>
              </div>

              {/* Maker-Checker Review Queue */}
              <div
                className={`p-6 rounded-2xl border space-y-5 ${
                  isDarkMode ? 'bg-[#1E1E1E] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#2E2E2E]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#F4B400]" />
                      <span>Merchant Accreditation Pipeline (Maker-Checker Queue)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Production applications pending document audit and administrative review
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EBEEEE] dark:bg-slate-800 text-[#2E2E2E] dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                    2 Applications Pending Review
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Case 1 */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-black text-sm text-[#2E2E2E] dark:text-white">
                          Manila Heritage Artisan Provisions Co.
                        </span>
                        <p className="text-slate-400 text-[11px]">BGC High Street • Food &amp; Retail • ID: APP-2026-0881</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-300/40">
                        UNDER REVIEW
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-1 text-[11px] text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>DTI Certificate: <strong>#DTI-NCR-89421</strong> (Verified)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>BIR 2303 (TIN): <strong>009-482-192-000</strong> (Active Regular)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Taguig City Business Permit: Awaiting on-site health inspection</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-400 font-mono">Stage: Checker Sign-Off</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => addToast('info', 'Document Audit Requested', 'Clarification requested for Sanitary Permit validity.')}
                          className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-xs font-semibold"
                        >
                          Request Revision
                        </button>
                        <button
                          onClick={() => addToast('success', 'Maker Approved', 'Audit sign-off submitted. Awaiting secondary checker sign-off.')}
                          className="px-3 py-1 bg-[#F4B400] text-[#2E2E2E] font-bold rounded hover:bg-[#FFD54F]"
                        >
                          Approve (Maker)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Case 2 */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-black text-sm text-[#2E2E2E] dark:text-white">
                          Luzon Express Cold-Chain Logistics Hub
                        </span>
                        <p className="text-slate-400 text-[11px]">Pasig Cargo Terminal • Logistics • ID: APP-2026-0904</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-300/40">
                        DOCS SUBMITTED
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-1 text-[11px] text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>SEC Certificate: <strong>#CS2023-901842</strong> (Verified)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>LTFRB Truck Freight Franchise: Under audit</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Pasig City Mayor’s Permit: Current 2026 Tax Year</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-400 font-mono">Stage: Maker Document Review</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => addToast('info', 'Inspection Scheduled', 'On-site fleet terminal audit queued.')}
                          className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-xs font-semibold"
                        >
                          Queue Inspection
                        </button>
                        <button
                          onClick={() => addToast('success', 'Documents Verified', 'Document package certified. Forwarded to Lead Inspector.')}
                          className="px-3 py-1 bg-[#F4B400] text-[#2E2E2E] font-bold rounded hover:bg-[#FFD54F]"
                        >
                          Verify Package
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Demonstration Entities Isolation Overview */}
              <div
                className={`p-6 rounded-2xl border space-y-4 ${
                  isDarkMode ? 'bg-[#1E1E1E] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#2E2E2E]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <Store className="w-4 h-4 text-[#F4B400]" />
                      <span>Demonstration Merchants Isolation Registry</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      48 showcase merchant profiles across 12 sectors strictly isolated from production accreditation
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-neutral-800 text-neutral-300">
                    STATUS: DEMO ONLY
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 text-xs">
                  {[
                    { cat: 'Food & Dining', count: '4 Demo Stores' },
                    { cat: 'Fresh Grocery', count: '4 Demo Stores' },
                    { cat: 'Convenience', count: '4 Demo Stores' },
                    { cat: 'Pharmacy', count: '4 Demo Stores' },
                    { cat: 'Retail & Lifestyle', count: '4 Demo Stores' },
                    { cat: 'Flowers & Gifts', count: '4 Demo Stores' },
                    { cat: 'Pet Care', count: '4 Demo Stores' },
                    { cat: 'Beauty & Wellness', count: '4 Demo Stores' },
                    { cat: 'Home & Office', count: '4 Demo Stores' },
                    { cat: 'Electronics', count: '4 Demo Stores' },
                    { cat: 'Local Services', count: '4 Demo Stores' },
                    { cat: 'TOGO Padala', count: '4 Fleet Hubs' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 text-center"
                    >
                      <p className="font-bold text-[11px] truncate">{item.cat}</p>
                      <span className="text-[10px] text-amber-500 font-mono font-semibold">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PILLAR 2: SELL */}
      {activePillar === 'SELL' && (
        <div className="space-y-4">
          <div
            className={`p-6 rounded-2xl border space-y-4 ${
              isDarkMode ? 'bg-[#1E1E1E] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#2E2E2E]'
            }`}
          >
            <h3 className="text-base font-bold">Omnichannel Sales Channels (Sell Pillar)</h3>
            <p className="text-xs text-slate-400">
              Manage unified channels across TOGOSERVE Marketplace, Direct Storefront, Social Ordering, and Pickup.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <Store className="w-5 h-5 text-[#F4B400]" />
                <h4 className="font-bold text-xs">Marketplace Listing</h4>
                <p className="text-[11px] text-slate-400">Active in Metro Manila radius with 25-min delivery SLA.</p>
                <span className="inline-flex items-center gap-1.5 text-[10px] text-[#2E2E2E] dark:text-slate-300 font-semibold font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F4B400]" />
                  <span>Status: Online</span>
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <ShoppingBag className="w-5 h-5 text-[#F4B400]" />
                <h4 className="font-bold text-xs">In-Store Pickup</h4>
                <p className="text-[11px] text-slate-400">Curbside and counter pickup tickets routed to POS.</p>
                <span className="inline-flex items-center gap-1.5 text-[10px] text-[#2E2E2E] dark:text-slate-300 font-semibold font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F4B400]" />
                  <span>Status: Enabled</span>
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <Truck className="w-5 h-5 text-[#F4B400]" />
                <h4 className="font-bold text-xs">TOGO Padala Fleet</h4>
                <p className="text-[11px] text-slate-400">On-demand motorcycle, van, and truck dispatch.</p>
                <span className="inline-flex items-center gap-1.5 text-[10px] text-[#2E2E2E] dark:text-slate-300 font-semibold font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F4B400]" />
                  <span>Status: Active</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PILLAR 3: GROW */}
      {activePillar === 'GROW' && (
        <div className="space-y-4">
          <div
            className={`p-6 rounded-2xl border space-y-4 ${
              isDarkMode ? 'bg-[#1E1E1E] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#2E2E2E]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Marketing, Loyalty & AI Growth (Grow Pillar)</h3>
                <p className="text-xs text-slate-400">
                  Data-driven customer retention, basket size expansion, and automated copilot pricing
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-[#F4B400]/20 text-[#F4B400] font-bold font-mono">
                A10-A19 Merchant AI Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <AIWidget
                agentId="A12"
                title="Dynamic Pastry Freshness Window"
                recommendation="Launch a 15% flash morning special on sourdough batches between 08:30 and 10:00 to lift early basket volume."
                impact="+42% projected revenue velocity"
                onApply={() => addToast('success', 'Promotion Activated', 'Flash morning special published to Marketplace')}
                isDark={isDarkMode}
              />
              <AIWidget
                agentId="A18"
                title="Repeat Customer Loyalty Multiplier"
                recommendation="Reward 3rd-time bakery customers with 50 bonus TOGO points on orders containing Specialty Matcha."
                impact="+19% 30-day repeat retention"
                onApply={() => addToast('success', 'Loyalty Rule Added', 'Tier bonus applied for Matcha beverage customers')}
                isDark={isDarkMode}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
