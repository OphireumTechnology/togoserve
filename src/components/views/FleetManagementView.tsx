import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MetricCard, StatusBadge, PageHeader } from '../design-system';
import { Truck, Navigation, ShieldCheck, AlertCircle, Wrench, Calendar, Phone, CheckCircle2 } from 'lucide-react';

export const FleetManagementView: React.FC = () => {
  const { fleetVehicles, isDarkMode, addToast } = useApp();
  const [filterType, setFilterType] = useState<string>('ALL');

  const filtered = fleetVehicles.filter(
    (v) => filterType === 'ALL' || v.vehicleType === filterType
  );

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      <PageHeader
        title="Fleet Management & Telematics"
        subtitle="Real-time multi-modal vehicle dispatch, driver assignments, route telemetry, and preventative maintenance schedules."
        badge="Logistics Core"
        actions={
          <button
            onClick={() => addToast('info', 'Register Vehicle', 'Vehicle registration flow opened.')}
            className="px-4 py-2 bg-[#FFC928] hover:bg-[#D9A514] text-[#071A2F] font-bold text-xs rounded-xl transition-colors"
          >
            + Register Fleet Vehicle
          </button>
        }
        isDark={true}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Active Fleet Units"
          value={fleetVehicles.length}
          icon={<Truck className="w-4 h-4" />}
          subValue="Motorcycle, Van & Light Truck"
          isDark={isDarkMode}
        />
        <MetricCard
          label="Vehicles on Route"
          value={fleetVehicles.filter((v) => v.status === 'DISPATCHED' || v.status === 'ACTIVE').length}
          icon={<Navigation className="w-4 h-4 text-[#16845B]" />}
          subValue="Real-time GPS online"
          isDark={isDarkMode}
        />
        <MetricCard
          label="Deliveries Today"
          value={fleetVehicles.reduce((a, b) => a + b.todayDeliveries, 0)}
          icon={<CheckCircle2 className="w-4 h-4 text-[#FFC928]" />}
          subValue="Zero reported delays"
          isDark={isDarkMode}
        />
        <MetricCard
          label="Fleet Capacity Deployed"
          value="4,525 kg"
          icon={<ShieldCheck className="w-4 h-4 text-[#0EA5E9]" />}
          subValue="98.5% capacity utilization"
          isDark={isDarkMode}
        />
      </div>

      {/* Vehicles Table */}
      <div
        className={`rounded-2xl border p-5 ${
          isDarkMode ? 'bg-[#0B223D] border-slate-800 text-white' : 'bg-white border-slate-200 text-[#17212B]'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold">Authorized Fleet Vehicles & Drivers</h3>
            <p className="text-xs text-slate-400">Live operational status and assigned driver contacts</p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['ALL', 'MOTORCYCLE', 'CAR', 'VAN', 'TRUCK'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterType === type
                    ? 'bg-[#071A2F] dark:bg-[#FFC928] text-white dark:text-[#071A2F] font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3">Plate / Unit</th>
                <th className="p-3">Vehicle Class</th>
                <th className="p-3">Model</th>
                <th className="p-3">Assigned Driver</th>
                <th className="p-3">Current Sector</th>
                <th className="p-3">Max Payload</th>
                <th className="p-3">Deliveries</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                  <td className="p-3 font-bold text-[#D9A514]">{v.plateNumber}</td>
                  <td className="p-3 font-bold">{v.vehicleType}</td>
                  <td className="p-3 font-sans text-slate-400">{v.model}</td>
                  <td className="p-3 font-sans">
                    <div className="font-bold">{v.driverName}</div>
                    <div className="text-[10px] text-slate-400">{v.driverPhone}</div>
                  </td>
                  <td className="p-3 font-sans">{v.currentZone}</td>
                  <td className="p-3">{v.capacityKg} kg</td>
                  <td className="p-3 font-bold">{v.todayDeliveries}</td>
                  <td className="p-3 font-sans">
                    <StatusBadge status={v.status} />
                  </td>
                  <td className="p-3 font-sans">
                    <button
                      onClick={() => addToast('info', 'Telemetry Ping', `Telemetry requested for ${v.plateNumber}`)}
                      className="px-2.5 py-1 text-[11px] font-bold rounded bg-slate-200 dark:bg-slate-700 hover:bg-[#D9A514] hover:text-[#071A2F] transition-colors"
                    >
                      Ping Route
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
