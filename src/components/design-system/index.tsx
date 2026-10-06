import React from 'react';
import { ArrowUpRight, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
export { BrandLogo, BrandMark } from '../brand/BrandLogo';
export { ImageWithFallback } from '../common/ImageWithFallback';

// 1. StatusBadge
export interface StatusBadgeProps {
  status: string;
  variant?: 'success' | 'warning' | 'alert' | 'info' | 'neutral' | 'gold';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant,
  className = '',
}) => {
  const normalized = status.toUpperCase();
  let v = variant;

  if (!v) {
    if (['DELIVERED', 'COMPLETED', 'SETTLED', 'ACTIVE', 'IN_STOCK', 'APPROVED'].includes(normalized)) {
      v = 'success';
    } else if (['PREPARING', 'PENDING', 'PENDING_REVIEW', 'READY_FOR_PICKUP'].includes(normalized)) {
      v = 'warning';
    } else if (['CANCELLED', 'ALERT', 'LOW_STOCK', 'OUT_OF_STOCK', 'REJECTED', 'DISPUTED'].includes(normalized)) {
      v = 'alert';
    } else if (['IN_TRANSIT', 'DISPATCHED', 'PICKED_UP', 'BOOKED'].includes(normalized)) {
      v = 'info';
    } else if (['CONFIRMED', 'PAID', 'EXPRESS'].includes(normalized)) {
      v = 'gold';
    } else {
      v = 'neutral';
    }
  }

  const styles = {
    success: 'bg-[#16845B]/15 text-[#16845B] dark:text-emerald-400 border-[#16845B]/30',
    warning: 'bg-[#F59E0B]/15 text-[#F59E0B] dark:text-amber-400 border-[#F59E0B]/30',
    alert: 'bg-[#D64545]/15 text-[#D64545] dark:text-rose-400 border-[#D64545]/30',
    info: 'bg-[#0EA5E9]/15 text-[#0EA5E9] dark:text-sky-400 border-[#0EA5E9]/30',
    gold: 'bg-[#D9A514]/15 text-[#D9A514] dark:text-[#FFC928] border-[#D9A514]/30',
    neutral: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold font-mono uppercase tracking-wider border ${styles[v]} ${className}`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
};

// 2. MetricCard
export interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  trend?: {
    direction: 'up' | 'down';
    value: string;
  };
  className?: string;
  isDark?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subValue,
  icon,
  trend,
  className = '',
  isDark = false,
}) => {
  return (
    <div
      className={`p-5 rounded-2xl border transition-all ${
        isDark
          ? 'bg-[#0B223D] border-slate-800 text-white'
          : 'bg-white border-slate-200 text-[#17212B] shadow-xs'
      } ${className}`}
    >
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
        <span className="font-medium">{label}</span>
        {icon && <div className="text-[#D9A514]">{icon}</div>}
      </div>
      <div className="text-2xl font-bold font-mono tabular-nums leading-none tracking-tight">
        {value}
      </div>
      {(trend || subValue) && (
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          {trend ? (
            <span
              className={`inline-flex items-center gap-1 font-semibold ${
                trend.direction === 'up' ? 'text-[#16845B]' : 'text-[#D64545]'
              }`}
            >
              {trend.direction === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{trend.value}</span>
            </span>
          ) : (
            <span />
          )}
          {subValue && <span>{subValue}</span>}
        </div>
      )}
    </div>
  );
};

// 3. ActionButton
export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center font-bold rounded-xl transition-all active:scale-98 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap';

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm px-4 py-2.5 gap-2',
    lg: 'text-sm sm:text-base px-6 py-3 gap-2.5',
  };

  const variants = {
    primary:
      'bg-[#FFC928] hover:bg-[#D9A514] text-[#071A2F] shadow-sm focus:ring-[#FFC928]',
    secondary:
      'bg-[#071A2F] hover:bg-[#0c2a4b] text-white shadow-sm focus:ring-[#071A2F]',
    outline:
      'border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-[#D9A514]',
    danger:
      'bg-[#D64545] hover:bg-rose-700 text-white shadow-sm focus:ring-[#D64545]',
    ghost:
      'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-slate-400',
  };

  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {icon}
      <span>{children}</span>
    </button>
  );
};

// 4. PageHeader
export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: React.ReactNode;
  isDark?: boolean;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  actions,
  isDark = true,
  className = '',
}) => {
  return (
    <div
      className={`rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isDark ? 'bg-[#071A2F] text-white' : 'bg-white text-[#17212B]'
      } ${className}`}
    >
      <div className="space-y-1">
        {badge && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFC928]/20 text-[#FFC928] text-xs font-bold border border-[#FFC928]/30 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{badge}</span>
          </div>
        )}
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-400 max-w-xl">
            {subtitle}
          </p>
        )}
      </div>

      {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
};

// 5. EmptyState
export const EmptyState: React.FC<{
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}> = ({ title, description, icon, actionText, onAction }) => {
  return (
    <div className="p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 max-w-md mx-auto my-6">
      {icon && <div className="w-12 h-12 text-slate-400 mx-auto mb-3">{icon}</div>}
      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 bg-[#FFC928] hover:bg-[#D9A514] text-[#071A2F] text-xs font-bold rounded-xl transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

// 6. LoadingState
export const LoadingState: React.FC<{ message?: string }> = ({
  message = 'Loading platform data...',
}) => {
  return (
    <div className="py-16 text-center space-y-3">
      <div className="w-8 h-8 mx-auto border-3 border-[#D9A514] border-t-transparent rounded-full animate-spin" />
      <p className="text-xs font-medium text-slate-500 font-mono">{message}</p>
    </div>
  );
};

// 7. AIWidget
export const AIWidget: React.FC<{
  title: string;
  recommendation: string;
  impact: string;
  agentId: string;
  onApply?: () => void;
  isDark?: boolean;
}> = ({ title, recommendation, impact, agentId, onApply, isDark = false }) => {
  return (
    <div
      className={`p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 text-xs space-y-2`}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
          TOGOSERVE AI ({agentId})
        </span>
        <span className="text-[10px] text-slate-400">Automated Copilot</span>
      </div>
      <h4 className="font-bold text-slate-800 dark:text-slate-100">{title}</h4>
      <p className="text-slate-600 dark:text-slate-300">{recommendation}</p>
      <div className="pt-2 border-t border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between">
        <span className="text-[11px] text-[#16845B] font-semibold">{impact}</span>
        {onApply && (
          <button
            onClick={onApply}
            className="px-2.5 py-1 bg-[#071A2F] text-white dark:bg-[#FFC928] dark:text-[#071A2F] rounded-lg font-bold text-[10px] hover:opacity-90 transition-opacity"
          >
            Apply Insight
          </button>
        )}
      </div>
    </div>
  );
};
