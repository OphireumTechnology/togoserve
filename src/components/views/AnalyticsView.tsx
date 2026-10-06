import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  Users,
  ShoppingBag,
  Truck,
  DollarSign,
  FileSpreadsheet,
  CheckCircle2,
  PieChart
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { orders, ledger, padalaShipments, isDarkMode, addToast } = useApp();

  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days'>('7days');
  const [reportType, setReportType] = useState<'revenue' | 'orders' | 'logistics' | 'merchants'>('revenue');

  // Hourly traffic & GMV data for SVG visualization
  const hourlyData = [
    { hour: '06:00', orders: 12, gmv: 9800 },
    { hour: '08:00', orders: 48, gmv: 34200 },
    { hour: '10:00', orders: 94, gmv: 71500 },
    { hour: '12:00', orders: 182, gmv: 142000 },
    { hour: '14:00', orders: 86, gmv: 62400 },
    { hour: '16:00', orders: 110, gmv: 88900 },
    { hour: '18:00', orders: 215, gmv: 189400 },
    { hour: '20:00', orders: 145, gmv: 118000 },
  ];

  const maxGmv = Math.max(...hourlyData.map((d) => d.gmv));

  // Funnel calculations
  const funnelSteps = [
    { label: 'Marketplace Store Impressions', count: 48920, pct: '100%' },
    { label: 'Product Added to Cart', count: 18450, pct: '37.7%' },
    { label: 'Checkout Gate Initiated', count: 9120, pct: '18.6%' },
    { label: 'Payment Completed & Dispatched', count: 7840, pct: '16.0%' },
  ];

  const handleExportCSV = () => {
    // Generate real CSV string
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Order Ref,Timestamp,Total (PHP),Payment Method,Status\n' +
      orders
        .map((o) => `"${o.orderNumber}","${o.createdAt}",${o.total},"${o.paymentMethod}","${o.status}"`)
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TOGOSERVE_Report_${dateRange}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'Report Exported', 'CSV summary downloaded to your device.');
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-[#071A2F] text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Real-time Telemetry & Business Intelligence</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Platform Analytics & Report Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Live user engagement, order velocity, omnichannel conversion funnels, and automated CSV audit exports.
          </p>
        </div>

        {/* Date Filter & Export Action */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-white/10 p-1 rounded-xl text-xs font-bold">
            {(['today', '7days', '30days'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  dateRange === r
                    ? 'bg-[#FFC928] text-[#071A2F] shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {r === 'today' ? 'Today' : r === '7days' ? 'Last 7 Days' : 'Last 30 Days'}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-[#FFC928] hover:bg-[#D9A514] text-[#071A2F] font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Generate CSV Report</span>
          </button>
        </div>
      </div>

      {/* Top Real-time KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`p-5 rounded-2xl border ${
            isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B] shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Live Platform GMV</span>
            <DollarSign className="w-4 h-4 text-[#FFC928]" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[#D9A514]">
            ₱696,400.00
          </div>
          <div className="mt-2 text-[11px] text-[#16845B] font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24.8% vs last week</span>
          </div>
        </div>

        <div
          className={`p-5 rounded-2xl border ${
            isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B] shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Orders Completed Today</span>
            <ShoppingBag className="w-4 h-4 text-[#16845B]" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums">893 Orders</div>
          <div className="mt-2 text-[11px] text-slate-400 font-mono">
            99.2% on-time fulfillment rate
          </div>
        </div>

        <div
          className={`p-5 rounded-2xl border ${
            isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B] shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Active Users Online</span>
            <Users className="w-4 h-4 text-[#6366F1]" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-indigo-400">
            3,418 Active
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Across Mobile PWA & Web Portals
          </div>
        </div>

        <div
          className={`p-5 rounded-2xl border ${
            isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B] shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Avg Delivery Duration</span>
            <Truck className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-500">
            21.4 Mins
          </div>
          <div className="mt-2 text-[11px] text-emerald-500 font-semibold">
            -3.8 mins vs industry benchmark
          </div>
        </div>
      </div>

      {/* Hourly GMV & Order Volume Interactive Chart */}
      <div
        className={`p-6 rounded-2xl border ${
          isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B] shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold">Hourly Sales & Transaction Velocity</h3>
            <p className="text-xs text-slate-400">Peak ordering windows across Metro Manila</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-3 rounded-sm bg-[#D9A514]" />
              <span>Gross Volume (₱)</span>
            </span>
          </div>
        </div>

        {/* CSS/SVG Bar Chart */}
        <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 pt-4 border-b border-slate-200 dark:border-slate-800">
          {hourlyData.map((item, idx) => {
            const heightPct = Math.round((item.gmv / maxGmv) * 100);
            return (
              <div key={idx} className="grow flex flex-col items-center gap-2 group h-full justify-end">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono font-bold bg-[#071A2F] text-white px-1.5 py-0.5 rounded shadow-sm">
                  ₱{(item.gmv / 1000).toFixed(1)}k
                </div>
                <div
                  className="w-full max-w-[42px] rounded-t-lg bg-gradient-to-t from-[#D9A514] to-[#FFC928] transition-all group-hover:brightness-110"
                  style={{ height: `${heightPct}%` }}
                />
                <span className="text-[10px] font-mono text-slate-400 mt-1">{item.hour}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Conversion Funnel & Logistics Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Funnel */}
        <div
          className={`p-6 rounded-2xl border ${
            isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B] shadow-xs'
          }`}
        >
          <h3 className="text-sm font-bold mb-4">Omnichannel Conversion Funnel</h3>
          <div className="space-y-4">
            {funnelSteps.map((step, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span>{step.label}</span>
                  <span className="font-mono font-bold text-[#D9A514]">
                    {step.count.toLocaleString()} ({step.pct})
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#D9A514] h-full rounded-full transition-all duration-500"
                    style={{ width: step.pct }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logistics & Dispatch Efficiency */}
        <div
          className={`p-6 rounded-2xl border ${
            isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B] shadow-xs'
          }`}
        >
          <h3 className="text-sm font-bold mb-4">Logistics & Fleet Dispatch Telemetry</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xs text-slate-400">Total Distance Covered</span>
              <div className="text-xl font-bold font-mono text-[#D9A514] mt-1">4,812 km</div>
              <span className="text-[10px] text-slate-400">Across 224 active riders</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xs text-slate-400">e-POD OTP Success Rate</span>
              <div className="text-xl font-bold font-mono text-emerald-500 mt-1">99.8%</div>
              <span className="text-[10px] text-slate-400">Zero disputed handovers</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xs text-slate-400">Batching Efficiency</span>
              <div className="text-xl font-bold font-mono text-indigo-400 mt-1">1.8 orders/trip</div>
              <span className="text-[10px] text-slate-400">Optimized via A21 AI</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xs text-slate-400">Merchant Acceptance Time</span>
              <div className="text-xl font-bold font-mono text-amber-500 mt-1">42 secs</div>
              <span className="text-[10px] text-slate-400">Average response time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
