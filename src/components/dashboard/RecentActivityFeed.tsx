import React from 'react';
import { Activity, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { formatRelativeTime } from '@/lib/utils';

export interface RecentActivityFeedProps {
  activities: {
    id: string;
    type: 'visit' | 'favourite' | 'milestone';
    title: string;
    description: string;
    timestamp: string;
    meta?: string;
  }[];
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ activities }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <span>Activity Timeline</span>
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-0.5">
          Chronological record of dining and discoveries
        </p>
      </CardHeader>

      <CardContent className="pt-2">
        {activities.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <Activity className="h-7 w-7 text-muted-foreground/30 mx-auto" />
            <p className="text-sm font-medium text-foreground">No recent activity</p>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Your dining timeline and journal milestones will be recorded here.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-border">
            {activities.map((act) => (
              <div key={act.id} className="relative">
                {/* Dot indicator */}
                <div className="absolute -left-6 top-1 h-3 w-3 rounded-full border-2 border-background bg-primary ring-2 ring-primary/20" />

                <div className="space-y-0.5">
                  <div className="flex items-center justify-between text-xs">
                    <h4 className="font-semibold text-foreground text-sm">{act.title}</h4>
                    <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                      <Clock className="h-3 w-3" />
                      {formatRelativeTime(act.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{act.description}</p>
                  {act.meta && (
                    <span className="inline-block mt-1 text-[11px] font-medium text-primary">
                      {act.meta}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
