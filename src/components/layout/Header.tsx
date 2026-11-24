import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Plus, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { usePreferencesStore } from '@/stores/usePreferencesStore';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = usePreferencesStore();

  const toggleTheme = () => {
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-4 sm:px-8">
      {/* Mobile Brand */}
      <div className="flex md:hidden items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-xs">
          <UtensilsCrossed className="h-4 w-4" />
        </div>
        <span className="font-bold tracking-tight text-foreground font-serif text-lg">
          Food<span className="text-primary">Log</span>
        </span>
      </div>

      <div className="hidden md:block">
        <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
          Curated Food Journal & Experience Tracker
        </span>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="rounded-full h-9 w-9 text-muted-foreground hover:text-foreground"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Button
          onClick={() => navigate('/visits/new')}
          size="sm"
          className="font-medium shadow-sm"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          <span>Add Visit</span>
        </Button>
      </div>
    </header>
  );
};
