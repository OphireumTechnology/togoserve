import React, { useState, useEffect, useRef } from 'react';
import { useApp, ActivePortal } from '../../context/AppContext';
import { Search, ShoppingBag, Truck, Store, CreditCard, Cpu, BarChart3, Sun, Moon, RefreshCw, X } from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setActivePortal,
    toggleDarkMode,
    triggerManualSync,
    isDarkMode,
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  interface CommandItem {
    id: string;
    title: string;
    subtitle: string;
    category: string;
    icon: React.ReactNode;
    action: () => void;
  }

  const commands: CommandItem[] = [
    {
      id: 'cmd-market',
      title: 'Customer Marketplace',
      subtitle: 'Browse restaurants, groceries, order food and essentials',
      category: 'Navigation',
      icon: <ShoppingBag className="w-4 h-4 text-[#D9A514]" />,
      action: () => {
        setActivePortal('marketplace');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd-padala',
      title: 'TOGO Padala (Express Logistics)',
      subtitle: 'Book point-to-point package courier and freight delivery',
      category: 'Navigation',
      icon: <Truck className="w-4 h-4 text-[#FFC928]" />,
      action: () => {
        setActivePortal('padala');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd-merchant',
      title: 'TOGOSERVE Business Portal',
      subtitle: 'Store operations, inventory, procurement, and settlements',
      category: 'Navigation',
      icon: <Store className="w-4 h-4 text-emerald-500" />,
      action: () => {
        setActivePortal('merchant');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd-pos',
      title: 'TOGOSERVE POS Terminal',
      subtitle: 'Fast touch point-of-sale checkout & barcode lookup',
      category: 'Navigation',
      icon: <CreditCard className="w-4 h-4 text-sky-500" />,
      action: () => {
        setActivePortal('pos');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd-rider',
      title: 'Rider Hub & Dispatch App',
      subtitle: 'Manage delivery routes, e-POD verification, and earnings',
      category: 'Navigation',
      icon: <Truck className="w-4 h-4 text-amber-500" />,
      action: () => {
        setActivePortal('rider');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd-ai',
      title: 'AI Command Center (A00 Supervisor)',
      subtitle: 'Multi-agent governance, HITL approvals, risk policies',
      category: 'Intelligence',
      icon: <Cpu className="w-4 h-4 text-indigo-400" />,
      action: () => {
        setActivePortal('ai-center');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd-analytics',
      title: 'Real-time Analytics & Report Generation',
      subtitle: 'Conversion funnel, live metrics, and CSV summary export',
      category: 'Intelligence',
      icon: <BarChart3 className="w-4 h-4 text-emerald-400" />,
      action: () => {
        setActivePortal('analytics');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd-sync',
      title: 'Force Cloud Synchronization',
      subtitle: 'Trigger instant sync to Cloud Run & Firestore',
      category: 'System',
      icon: <RefreshCw className="w-4 h-4 text-cyan-400" />,
      action: () => {
        triggerManualSync();
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd-theme',
      title: 'Toggle Dark / Light Theme',
      subtitle: 'Switch application color contrast mode',
      category: 'Preferences',
      icon: isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />,
      action: () => {
        toggleDarkMode();
        setIsCommandPaletteOpen(false);
      },
    },
  ];

  const filtered = commands.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`relative w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border ${
          isDarkMode
            ? 'bg-[#071A2F] border-slate-700 text-white'
            : 'bg-white border-slate-200 text-[#17212B]'
        }`}
      >
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-4 h-4 text-slate-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands, portals, products, or actions... (Esc to exit)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm focus:outline-none placeholder:text-slate-400"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-200 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching commands or actions found for "{query}".
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors flex items-center gap-3 group focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-800"
              >
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                  {item.icon}
                </div>
                <div className="grow min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold truncate group-hover:text-[#D9A514]">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {item.subtitle}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
          <span>Tip: Press 1-6 to quickly switch portals</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
};
