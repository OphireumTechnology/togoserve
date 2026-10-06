import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Store,
  DollarSign,
  Package,
  AlertTriangle,
  Clock,
  CheckCircle,
  Truck,
  Plus,
  RefreshCw,
  ShoppingBag,
  Layers,
  ArrowUpRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { OrderStatus } from '../../types';

export const MerchantOSView: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    inventory,
    restockItem,
    ledger,
    isDarkMode,
    setActivePortal,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'inventory' | 'procurement' | 'settlement'>('dashboard');

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
      <div className="bg-[#071A2F] text-white rounded-2xl p-6 sm:p-7 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFC928]">
              TOGOSERVE Business Operating System
            </span>
            <span className="text-xs bg-[#16845B]/30 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Live Store #01: Aroma Bakehouse
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Merchant Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Real-time kitchen display, omnichannel inventory management, and automated financial settlements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePortal('pos')}
            className="px-4 py-2 bg-[#FFC928] hover:bg-[#D9A514] text-[#071A2F] font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <span>Launch POS Register</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-1">
        {[
          { id: 'dashboard', label: 'Today\'s Performance' },
          { id: 'orders', label: `Kitchen & Orders (${pendingAttentionOrders.length})` },
          { id: 'inventory', label: `Inventory & SKUs (${lowStockItems.length} low)` },
          { id: 'procurement', label: 'Supply Procurement' },
          { id: 'settlement', label: 'Settlement & Ledger' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#071A2F] dark:bg-[#FFC928] text-white dark:text-[#071A2F] font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW METRIC DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1 */}
            <div
              className={`p-5 rounded-2xl border ${
                isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B] shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Today's Gross Sales</span>
                <DollarSign className="w-4 h-4 text-[#FFC928]" />
              </div>
              <div className="text-2xl font-bold font-mono tabular-nums text-[#D9A514]">
                ₱{todaySales.toFixed(2)}
              </div>
              <div className="mt-2 text-[11px] text-[#16845B] font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+18.4% vs previous 7-day average</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div
              className={`p-5 rounded-2xl border ${
                isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B] shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Orders Needing Attention</span>
                <Clock className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <div className="text-2xl font-bold font-mono tabular-nums">
                {pendingAttentionOrders.length}
              </div>
              <div className="mt-2 text-[11px] text-amber-500 font-semibold">
                Average prep duration: 12.2 mins
              </div>
            </div>

            {/* Metric 3 */}
            <div
              className={`p-5 rounded-2xl border ${
                isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B] shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Low Stock SKU Alerts</span>
                <AlertTriangle className="w-4 h-4 text-[#D64545]" />
              </div>
              <div className="text-2xl font-bold font-mono tabular-nums text-[#D64545]">
                {lowStockItems.length}
              </div>
              <div className="mt-2 text-[11px] text-rose-500 font-semibold">
                Urgent reorder suggested via Supply
              </div>
            </div>

            {/* Metric 4 */}
            <div
              className={`p-5 rounded-2xl border ${
                isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B] shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Pending Net Settlement</span>
                <CheckCircle className="w-4 h-4 text-[#16845B]" />
              </div>
              <div className="text-2xl font-bold font-mono tabular-nums text-emerald-500">
                ₱{pendingSettlement.toFixed(2)}
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                Scheduled payout: Friday 17:00
              </div>
            </div>
          </div>

          {/* Real-time kitchen order queue preview */}
          <div
            className={`p-5 rounded-2xl border ${
              isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B] shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold">Live Kitchen Fulfillment Queue</h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs text-[#D9A514] hover:underline font-semibold"
              >
                View Full Kitchen Terminal →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {pendingAttentionOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-mono font-bold text-[#D9A514]">{ord.orderNumber}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#FFC928]/20 text-[#D9A514]">
                        {ord.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-xs font-semibold truncate mb-1">
                      {ord.customerName}
                    </div>

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
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#071A2F] dark:bg-[#FFC928] text-white dark:text-[#071A2F] hover:opacity-90"
                    >
                      {ord.status === 'CONFIRMED'
                        ? 'Accept Order'
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

      {/* TAB 2: DETAILED ORDERS STATE MACHINE */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold">Active Orders & State Transitions</h2>
            <span className="text-xs text-slate-400 font-mono">{orders.length} total orders</span>
          </div>

          <div className="space-y-3">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className={`p-4 rounded-xl border transition-all ${
                  isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#D9A514]">
                      {ord.orderNumber}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      • {ord.customerName} ({ord.customerPhone})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold">₱{ord.total.toFixed(2)}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                      {ord.status}
                    </span>
                  </div>
                </div>

                <div className="py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    {ord.items.map((it, idx) => (
                      <p key={idx} className="text-slate-600 dark:text-slate-400">
                        • {it.quantity} × {it.product.name} (₱{it.product.price})
                      </p>
                    ))}
                    <p className="text-[11px] text-slate-400 mt-1">
                      Deliver to: {ord.customerAddress}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(['PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'] as OrderStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => updateOrderStatus(ord.id, st)}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                          ord.status === st
                            ? 'bg-[#16845B] text-white border-[#16845B]'
                            : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
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
        </div>
      )}

      {/* TAB 3: INVENTORY */}
      {activeTab === 'inventory' && (
        <div
          className={`rounded-2xl border p-5 ${
            isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B]'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold">Store SKU Inventory & Batch Tracking</h3>
              <p className="text-xs text-slate-400">
                Authoritative source of stock deduction and reorder alerts
              </p>
            </div>
            <button
              onClick={() => restockItem('inv-2', 20)}
              className="px-3 py-1.5 bg-[#FFC928] text-[#071A2F] text-xs font-bold rounded-lg hover:bg-[#D9A514] transition-colors"
            >
              + Quick Restock All Low
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3">SKU / Barcode</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Current Stock</th>
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
                    <td className="p-3 text-slate-400 font-sans">{inv.category}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          inv.stockLevel <= inv.minThreshold
                            ? 'bg-rose-500/20 text-rose-500'
                            : 'bg-emerald-500/20 text-emerald-500'
                        }`}
                      >
                        {inv.stockLevel} units
                      </span>
                    </td>
                    <td className="p-3">₱{inv.unitCost}</td>
                    <td className="p-3 text-[#D9A514] font-bold">₱{inv.retailPrice}</td>
                    <td className="p-3 text-slate-400 font-sans">{inv.supplier}</td>
                    <td className="p-3 font-sans">
                      <button
                        onClick={() => restockItem(inv.id, 15)}
                        className="px-2 py-1 text-[11px] font-bold rounded bg-slate-200 dark:bg-slate-700 hover:bg-[#D9A514] hover:text-[#071A2F] transition-colors"
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

      {/* TAB 4: B2B PROCUREMENT / SUPPLY */}
      {activeTab === 'procurement' && (
        <div
          className={`rounded-2xl border p-5 space-y-4 ${
            isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold">TOGOSERVE Supply & B2B Procurement Marketplace</h3>
              <p className="text-xs text-slate-400">
                Direct wholesale purchasing from verified suppliers with automated replenishment triggers
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-[#FFC928]/20 text-[#D9A514] font-bold font-mono">
              AI Copilot Connected (A17 Procurement)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
                Active Reorder Recommendation (A17)
              </h4>
              <p className="text-sm font-semibold mb-1">
                Order 20kg Matcha Powder from Kyoto Tea Imports Direct
              </p>
              <p className="text-xs text-slate-400 mb-3">
                Stock is at 8 units (threshold: 10). Projected stockout in 36 hours based on morning drink orders.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="font-mono text-xs font-bold">Wholesale Quote: ₱17,000.00</span>
                <button
                  onClick={() => restockItem('inv-2', 20)}
                  className="px-3 py-1.5 bg-[#FFC928] text-[#071A2F] text-xs font-bold rounded-lg hover:bg-[#D9A514]"
                >
                  Generate Purchase Order
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
                Bakery Flour Replenishment
              </h4>
              <p className="text-sm font-semibold mb-1">
                Organic Unbleached Flour (50kg bags) from Golden Grain Milling Co.
              </p>
              <p className="text-xs text-slate-400 mb-3">
                Current inventory adequate for 5 days. Next bulk delivery window opens Wednesday.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="font-mono text-xs font-bold">Wholesale Quote: ₱4,200.00</span>
                <button
                  onClick={() => restockItem('inv-1', 10)}
                  className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 text-xs font-bold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Schedule Delivery
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FINANCIAL LEDGER & SETTLEMENT */}
      {activeTab === 'settlement' && (
        <div
          className={`rounded-2xl border p-5 ${
            isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B]'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold">Authoritative Ledger & Merchant Settlement</h3>
              <p className="text-xs text-slate-400">
                Immutable double-entry transaction record with platform commission audit
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Total Net Payable</div>
              <div className="text-base font-bold font-mono text-emerald-500">
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
                  <th className="p-3">Platform Fee</th>
                  <th className="p-3">Delivery Fee</th>
                  <th className="p-3">Net Merchant Payable</th>
                  <th className="p-3">Settlement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                {ledger.map((entry) => (
                  <tr key={entry.id}>
                    <td className="p-3 text-slate-400">{entry.timestamp}</td>
                    <td className="p-3 font-bold text-[#D9A514]">{entry.orderNumber}</td>
                    <td className="p-3 font-bold">₱{entry.grossAmount.toFixed(2)}</td>
                    <td className="p-3 text-slate-400">₱{entry.platformFee.toFixed(2)}</td>
                    <td className="p-3 text-slate-400">₱{entry.deliveryFee.toFixed(2)}</td>
                    <td className="p-3 font-bold text-[#16845B]">
                      ₱{entry.merchantPayable.toFixed(2)}
                    </td>
                    <td className="p-3 font-sans">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          entry.status === 'SETTLED'
                            ? 'bg-emerald-500/20 text-emerald-500'
                            : 'bg-amber-500/20 text-amber-500'
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
