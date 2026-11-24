import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Utensils, RefreshCw, BarChart3 } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { StatOverview } from '@/components/dashboard/StatOverview';
import { RecentVisitsCard } from '@/components/dashboard/RecentVisitsCard';
import { TopDishesCard } from '@/components/dashboard/TopDishesCard';
import { FavouriteRestaurantsCard } from '@/components/dashboard/FavouriteRestaurantsCard';
import { RecentActivityFeed } from '@/components/dashboard/RecentActivityFeed';
import { Button } from '@/components/ui/Button';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { metrics, isLoading, error, refresh } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton className="h-28 w-full rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <LoadingSkeleton className="h-28 rounded-xl" />
          <LoadingSkeleton className="h-28 rounded-xl" />
          <LoadingSkeleton className="h-28 rounded-xl" />
          <LoadingSkeleton className="h-28 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <LoadingSkeleton className="h-96 rounded-xl lg:col-span-2" />
          <LoadingSkeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-destructive font-medium">{error || 'Failed to load dashboard'}</p>
        <Button onClick={refresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Editorial Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-card via-card to-accent/20 p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <span className="text-xs font-semibold tracking-wider uppercase text-primary">
              Personal Culinary Journal
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground font-serif">
              Welcome back to FoodLog
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Track authentic dining moments, compare dish prices over time, and revisit your
              favorite spots with friends.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={() => navigate('/visits/new')}
              size="md"
              className="shadow-md shadow-primary/25 font-semibold"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Quick Add Visit
            </Button>
            <Button
              onClick={() => navigate('/restaurants')}
              variant="outline"
              size="md"
            >
              <Utensils className="h-4 w-4 mr-2" />
              Explore Places
            </Button>
            <Button
              onClick={() => navigate('/analytics')}
              variant="outline"
              size="md"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics & Trends
            </Button>
          </div>
        </div>
      </div>

      {/* Primary Metrics Overview */}
      <StatOverview metrics={metrics} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          <RecentVisitsCard visits={metrics.recentVisits} />
          <TopDishesCard dishes={metrics.highestRatedDishes} />
        </div>

        {/* Right 1 Column */}
        <div className="space-y-6">
          <FavouriteRestaurantsCard restaurants={metrics.favouriteRestaurants} />
          <RecentActivityFeed activities={metrics.recentActivity} />
        </div>
      </div>
    </div>
  );
};
