import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  BarChart3,
  History,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const MobileNav: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-lg border-t border-border px-2 py-2 flex items-center justify-around shadow-lg">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center gap-1 text-[10px] font-medium transition-colors px-1.5 py-1',
            isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          )
        }
      >
        <LayoutDashboard className="h-5 w-5" />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/restaurants"
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center gap-1 text-[10px] font-medium transition-colors px-1.5 py-1',
            isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          )
        }
      >
        <UtensilsCrossed className="h-5 w-5" />
        <span>Places</span>
      </NavLink>

      {/* Floating Center Add Button */}
      <button
        onClick={() => navigate('/visits/new')}
        aria-label="Add New Visit"
        className="relative -top-3 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/35 hover:scale-105 active:scale-95 transition-transform shrink-0"
      >
        <Plus className="h-6 w-6" />
      </button>

      <NavLink
        to="/analytics"
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center gap-1 text-[10px] font-medium transition-colors px-1.5 py-1',
            isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          )
        }
      >
        <BarChart3 className="h-5 w-5" />
        <span>Insights</span>
      </NavLink>

      <NavLink
        to="/visits"
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center gap-1 text-[10px] font-medium transition-colors px-1.5 py-1',
            isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          )
        }
      >
        <History className="h-5 w-5" />
        <span>Visits</span>
      </NavLink>
    </nav>
  );
};

