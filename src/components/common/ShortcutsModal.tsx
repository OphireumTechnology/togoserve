import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Keyboard } from 'lucide-react';

export const ShortcutsModal: React.FC = () => {
  const { isShortcutsOpen, setIsShortcutsOpen, isDarkMode } = useApp();

  if (!isShortcutsOpen) return null;

  const shortcuts = [
    { key: '⌘ / Ctrl + K', description: 'Open Command Palette & Quick Navigation' },
    { key: '?', description: 'Open Keyboard Shortcuts Helper' },
    { key: 'Alt + D', description: 'Toggle Dark Mode / Light Mode' },
    { key: '1', description: 'Jump to Customer Marketplace' },
    { key: '2', description: 'Jump to TOGO Padala (Express Logistics)' },
    { key: '3', description: 'Jump to TOGOSERVE Business (Merchant OS)' },
    { key: '4', description: 'Jump to TOGOSERVE POS Terminal' },
    { key: '5', description: 'Jump to Rider Hub & Dispatch' },
    { key: '6', description: 'Jump to AI Command Center (A00 Supervisor)' },
    { key: 'Esc', description: 'Close any active modal or drawer' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-lg rounded-2xl shadow-2xl p-6 sm:p-7 transition-colors ${
          isDarkMode
            ? 'bg-[#071A2F] border border-slate-700 text-white'
            : 'bg-white border border-slate-200 text-[#17212B]'
        }`}
      >
        <button
          onClick={() => setIsShortcutsOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-full transition-colors"
          aria-label="Close shortcuts modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="p-2 rounded-lg bg-[#FFC928]/20 text-[#D9A514]">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold">Keyboard Navigation Shortcuts</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Accelerate your workflow with quick single-key and modifier commands
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {shortcuts.map((sc, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                {sc.description}
              </span>
              <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono text-[11px] font-semibold">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 text-center">
          <button
            onClick={() => setIsShortcutsOpen(false)}
            className="px-5 py-2 bg-[#FFC928] text-[#071A2F] font-bold text-xs rounded-lg hover:bg-[#D9A514] transition-colors"
          >
            Got it, return to app
          </button>
        </div>
      </div>
    </div>
  );
};
