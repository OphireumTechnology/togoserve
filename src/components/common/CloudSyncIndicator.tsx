import React from 'react';
import { useApp } from '../../context/AppContext';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export const CloudSyncIndicator: React.FC = () => {
  const { cloudSync, triggerManualSync, isDarkMode } = useApp();

  const isSyncing = cloudSync.status === 'syncing';

  return (
    <button
      onClick={triggerManualSync}
      disabled={isSyncing}
      title={`Cloud sync: ${cloudSync.status}. Last sync: ${cloudSync.lastSyncedAt}. Click to force sync.`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[#D9A514] ${
        isDarkMode
          ? 'bg-[#0B223D] border border-slate-700/60 text-slate-300 hover:text-white hover:border-slate-600'
          : 'bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-xs'
      }`}
      aria-label="Cloud sync status and manual sync trigger"
    >
      {isSyncing ? (
        <RefreshCw className="w-3.5 h-3.5 text-[#D9A514] animate-spin" />
      ) : cloudSync.status === 'error' ? (
        <AlertCircle className="w-3.5 h-3.5 text-[#D64545]" />
      ) : (
        <CheckCircle2 className="w-3.5 h-3.5 text-[#16845B]" />
      )}

      <span className="hidden sm:inline font-mono text-[11px] tabular-nums">
        {isSyncing ? 'Syncing...' : 'Cloud Synced'}
      </span>
      <span className="hidden lg:inline text-[10px] text-slate-400 border-l border-slate-300 dark:border-slate-700 pl-1.5 font-mono">
        {cloudSync.lastSyncedAt}
      </span>
    </button>
  );
};
