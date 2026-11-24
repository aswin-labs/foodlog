import React, { useState } from 'react';
import {
  BarChart3,
  Award,
  DollarSign,
  Sparkles,
  ArrowLeftRight,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { DishRankingsView } from '@/components/analytics/DishRankingsView';
import { SpendingAnalyticsView } from '@/components/analytics/SpendingAnalyticsView';
import { RevisitRecommendationsView } from '@/components/analytics/RevisitRecommendationsView';
import { RestaurantComparisonView } from '@/components/analytics/RestaurantComparisonView';
import { Button } from '@/components/ui/Button';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';

type AnalyticsTab = 'dishes' | 'spending' | 'revisits' | 'comparison';

export const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('dishes');

  const {
    dishRankings,
    spendingOverview,
    revisitRecommendations,
    allRestaurants,
    selectedCompareIds,
    comparisonItems,
    isLoading,
    error,
    refresh,
    toggleCompareRestaurant,
  } = useAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton className="h-28 w-full rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <LoadingSkeleton className="h-24 rounded-xl" />
          <LoadingSkeleton className="h-24 rounded-xl" />
          <LoadingSkeleton className="h-24 rounded-xl" />
          <LoadingSkeleton className="h-24 rounded-xl" />
        </div>
        <LoadingSkeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (error || !dishRankings || !spendingOverview) {
    return (
      <div className="p-12 text-center rounded-2xl border border-border bg-card space-y-4">
        <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
        <h2 className="text-xl font-bold">{error || 'Failed to load analytics'}</h2>
        <Button onClick={refresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  const tabs = [
    {
      id: 'dishes' as const,
      label: 'Dish Rankings & Prices',
      icon: Award,
      badge: `${dishRankings.highestRated.length} dishes`,
    },
    {
      id: 'spending' as const,
      label: 'Monthly Expenditure',
      icon: DollarSign,
      badge: `${spendingOverview.monthlyData.length} months`,
    },
    {
      id: 'revisits' as const,
      label: 'Worth Revisiting',
      icon: Sparkles,
      badge: `${revisitRecommendations.length} spots`,
    },
    {
      id: 'comparison' as const,
      label: 'Restaurant Comparison',
      icon: ArrowLeftRight,
      badge: `${selectedCompareIds.length} compared`,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <BarChart3 className="h-4 w-4" />
          <span>Culinary Intelligence & Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground font-serif mt-1">
          Dining Analytics & Taste Patterns
        </h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          Everything calculated from your recorded visits: dish satisfaction curves, spending trajectories,
          and algorithmic restaurant recommendations.
        </p>
      </div>

      {/* Nav Tabs Bar */}
      <div className="flex overflow-x-auto pb-1 gap-2 border-b border-border/50 text-xs sm:text-sm scrollbar-none">
        {tabs.map(({ id, label, icon: Icon, badge }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all shrink-0 border ${
                isActive
                  ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                  : 'bg-card text-muted-foreground border-border hover:bg-secondary/70 hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-black/20 text-white'
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                {badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'dishes' && <DishRankingsView rankings={dishRankings} />}

      {activeTab === 'spending' && <SpendingAnalyticsView spending={spendingOverview} />}

      {activeTab === 'revisits' && (
        <RevisitRecommendationsView
          recommendations={revisitRecommendations}
          favouriteRestaurants={allRestaurants.filter((r) => r.favourite)}
        />
      )}

      {activeTab === 'comparison' && (
        <RestaurantComparisonView
          allRestaurants={allRestaurants}
          selectedIds={selectedCompareIds}
          comparisonItems={comparisonItems}
          onToggleRestaurant={toggleCompareRestaurant}
        />
      )}
    </div>
  );
};
