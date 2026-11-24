import React from 'react';
import { TrendingUp, UtensilsCrossed } from 'lucide-react';
import type { SpendingOverview } from '@/services/AnalyticsService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { usePreferencesStore } from '@/stores/usePreferencesStore';

export interface SpendingAnalyticsViewProps {
  spending: SpendingOverview;
}

export const SpendingAnalyticsView: React.FC<SpendingAnalyticsViewProps> = ({ spending }) => {
  const { currency } = usePreferencesStore();

  const maxMonthSpend = Math.max(
    ...spending.monthlyData.map((m) => m.totalExpenditure),
    1
  );

  return (
    <div className="space-y-6">
      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1 bg-gradient-to-br from-card to-accent/20 border-primary/20">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
            Total Spend (All Time)
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
            {formatCurrency(spending.totalSpendAllTime, currency)}
          </div>
          <span className="text-xs text-muted-foreground">Across all recorded dining outings</span>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Average Monthly Spend
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
            {formatCurrency(spending.averageSpendPerMonth, currency)}
          </div>
          <span className="text-xs text-muted-foreground">Over {spending.monthlyData.length} active months</span>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Average Bill Per Visit
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
            {formatCurrency(spending.averageVisitBill, currency)}
          </div>
          <span className="text-xs text-muted-foreground">Per restaurant outing</span>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Average Cost Per Person
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
            {formatCurrency(spending.averageCostPerPerson, currency)}
          </div>
          <span className="text-xs text-muted-foreground">Per diner per outing</span>
        </Card>
      </div>

      {/* Monthly Expenditure Visual Breakdown */}
      <Card>
        <CardHeader className="pb-3 border-b border-border/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Monthly Food Expenditure Timeline</span>
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Monthly spending trajectory and volume of dining experiences
              </p>
            </div>

            {spending.highestSpendMonth && (
              <div className="self-start sm:self-center px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-700 dark:text-amber-400">
                Peak: {spending.highestSpendMonth.label} (
                {formatCurrency(spending.highestSpendMonth.totalExpenditure, currency)})
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-5">
          {spending.monthlyData.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <TrendingUp className="h-8 w-8 text-muted-foreground/30 mx-auto" />
              <p className="text-sm font-medium text-foreground">No spending recorded yet</p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Log restaurant visits with total bills to generate your monthly expenditure analytics.
              </p>
            </div>
          ) : (
            spending.monthlyData.map((item) => {
              const barWidthPercent = Math.round((item.totalExpenditure / maxMonthSpend) * 100);

              return (
                <div key={item.monthKey} className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{item.label}</span>
                      <span className="text-muted-foreground">
                        ({item.visitCount} {item.visitCount === 1 ? 'visit' : 'visits'})
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono">
                      <span className="text-muted-foreground">
                        Avg/person: {formatCurrency(item.averageCostPerPerson, currency)}
                      </span>
                      <span className="font-bold text-foreground text-sm">
                        {formatCurrency(item.totalExpenditure, currency)}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      style={{ width: `${barWidthPercent}%` }}
                      className="h-full rounded-full bg-primary transition-all duration-500"
                    />
                  </div>

                  {/* Restaurants visited during this month */}
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <UtensilsCrossed className="h-3 w-3 shrink-0 text-muted-foreground/60" />
                    <span className="truncate">Visited: {item.restaurantsVisited.join(', ')}</span>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
};
