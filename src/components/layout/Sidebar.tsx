import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  History,
  BarChart3,
  Users,
  Settings,
  PlusCircle,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/restaurants', label: 'Restaurants', icon: UtensilsCrossed },
    { to: '/visits', label: 'Visit History', icon: History },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/friends', label: 'Friends', icon: Users },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/60 backdrop-blur-md h-screen sticky top-0 shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-border/40 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm shadow-primary/30">
          <UtensilsCrossed className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground font-serif">
            Food<span className="text-primary">Log</span>
          </h1>
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Personal Journal
          </p>
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="p-4">
        <Button
          onClick={() => navigate('/visits/new')}
          className="w-full justify-center shadow-md shadow-primary/25 font-semibold text-sm"
          size="md"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Quick Add Visit
        </Button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
              )
            }
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Journal Status Card */}
      <div className="p-4 m-3 rounded-xl bg-secondary/50 border border-border/50 text-xs space-y-1.5">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <BookOpen className="h-3.5 w-3.5 text-primary" />
          <span>Private Circle Edition</span>
        </div>
        <p className="text-muted-foreground text-[11px] leading-relaxed">
          Tracking meals, honest ratings, and true dish prices with friends.
        </p>
      </div>
    </aside>
  );
};
