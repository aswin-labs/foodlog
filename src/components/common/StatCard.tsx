import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  className?: string;
  highlight?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
  highlight = false,
}) => {
  return (
    <Card
      className={cn(
        'p-5 transition-all relative overflow-hidden group',
        highlight && 'bg-gradient-to-br from-card to-accent/25 border-primary/20',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-serif">
              {value}
            </h3>
            {trend && (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {trend}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-muted-foreground pt-0.5">{subtitle}</p>}
        </div>

        <div
          className={cn(
            'p-2.5 rounded-xl transition-colors',
            highlight
              ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
              : 'bg-secondary text-foreground/80 group-hover:bg-primary/10 group-hover:text-primary'
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
};
