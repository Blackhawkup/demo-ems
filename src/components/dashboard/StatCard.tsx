import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg?: string;
  badgeText?: string;
  badgeColor?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBg = 'bg-blue-50 text-blue-600',
  badgeText,
  badgeColor = 'bg-slate-100 text-slate-700',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200 p-4 shadow-2xs transition-colors duration-150 ${
        onClick
          ? 'cursor-pointer hover:border-slate-300 hover:shadow-xs active:scale-[0.99] select-none'
          : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="space-y-1 flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
              {value}
            </span>
            {badgeText && (
              <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded tabular-nums ${badgeColor}`}>
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 truncate">
              {subtitle}
            </p>
          )}
        </div>

        <div className={`p-2 rounded-lg shrink-0 flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
