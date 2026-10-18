import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  color?: 'primary' | 'accent' | 'neutral' | 'red';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'primary',
}) => {
  let iconBg = 'bg-primary/10 text-primary';
  if (color === 'accent') iconBg = 'bg-accent/10 text-accent';
  if (color === 'red') iconBg = 'bg-red-50 text-red-600';
  if (color === 'neutral') iconBg = 'bg-softNeutral text-charcoal';

  return (
    <div className="bg-white border border-borderNeutral rounded-card p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-mutedGrey tracking-wide uppercase">
          {title}
        </span>
        <div className={`w-9 h-9 rounded-button flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
      </div>

      <div>
        <div className="text-2xl font-bold text-charcoal tracking-tight">
          {value}
        </div>
        {(subtitle || trend) && (
          <div className="flex items-center gap-2 mt-1 text-xs">
            {trend && <span className="text-primary font-semibold">{trend}</span>}
            {subtitle && <span className="text-mutedGrey">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
