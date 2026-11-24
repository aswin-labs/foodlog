import React from 'react';
import { cn } from '@/lib/utils';

export const LoadingSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-secondary/70 dark:bg-muted/50',
        className
      )}
    />
  );
};

export const RestaurantCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs space-y-3 p-4">
      <LoadingSkeleton className="h-48 w-full rounded-lg" />
      <div className="space-y-2 pt-2">
        <div className="flex justify-between items-center">
          <LoadingSkeleton className="h-5 w-3/5" />
          <LoadingSkeleton className="h-4 w-12" />
        </div>
        <LoadingSkeleton className="h-4 w-2/5" />
        <div className="flex gap-2 pt-2">
          <LoadingSkeleton className="h-5 w-16" />
          <LoadingSkeleton className="h-5 w-16" />
        </div>
      </div>
    </div>
  );
};
