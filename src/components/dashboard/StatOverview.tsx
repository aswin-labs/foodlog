import React from 'react';
import { UtensilsCrossed, CalendarCheck2, Star, Sparkles } from 'lucide-react';
import { StatCard } from '@/components/common/StatCard';
import type { DashboardMetrics } from '@/services/AnalyticsService';

export interface StatOverviewProps {
  metrics: DashboardMetrics;
}

export const StatOverview: React.FC<StatOverviewProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
      <StatCard
        title="Restaurants Visited"
        value={metrics.totalRestaurants}
        subtitle="Saved in your journal"
        icon={UtensilsCrossed}
        trend={metrics.totalRestaurants > 0 ? `${metrics.totalRestaurants} places` : undefined}
      />
      <StatCard
        title="Dining Visits"
        value={metrics.totalVisits}
        subtitle="Individual food runs"
        icon={CalendarCheck2}
        trend={metrics.totalVisits > 0 ? `${metrics.totalVisits} logged` : undefined}
      />
      <StatCard
        title="Dishes Reviewed"
        value={metrics.totalDishes}
        subtitle="Rated & price tracked"
        icon={Sparkles}
        trend={metrics.totalDishes > 0 ? `${metrics.totalDishes} unique` : undefined}
      />
      <StatCard
        title="Average Rating"
        value={metrics.totalVisits > 0 ? `${metrics.averageRating.toFixed(1)} ★` : '—'}
        subtitle="Culinary experience score"
        icon={Star}
        highlight
      />
    </div>
  );
};
