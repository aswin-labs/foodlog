import { create } from 'zustand';

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';
export type ThemeMode = 'light' | 'dark' | 'system';

interface PreferencesState {
  currency: Currency;
  theme: ThemeMode;
  setCurrency: (currency: Currency) => void;
  setTheme: (theme: ThemeMode) => void;
}

const PREF_STORAGE_KEY = 'foodlog_preferences_v1';

function getInitialPreferences(): { currency: Currency; theme: ThemeMode } {
  if (typeof window === 'undefined') {
    return { currency: 'INR', theme: 'light' };
  }
  try {
    const raw = window.localStorage.getItem(PREF_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        currency: parsed.currency || 'INR',
        theme: parsed.theme || 'light',
      };
    }
  } catch {
    // fallback
  }
  return { currency: 'INR', theme: 'light' };
}

export const usePreferencesStore = create<PreferencesState>((set) => {
  const initial = getInitialPreferences();

  return {
    currency: initial.currency,
    theme: initial.theme,
    setCurrency: (currency) => {
      set({ currency });
      if (typeof window !== 'undefined') {
        const raw = window.localStorage.getItem(PREF_STORAGE_KEY);
        const prev = raw ? JSON.parse(raw) : {};
        window.localStorage.setItem(PREF_STORAGE_KEY, JSON.stringify({ ...prev, currency }));
      }
    },
    setTheme: (theme) => {
      set({ theme });
      if (typeof window !== 'undefined') {
        const raw = window.localStorage.getItem(PREF_STORAGE_KEY);
        const prev = raw ? JSON.parse(raw) : {};
        window.localStorage.setItem(PREF_STORAGE_KEY, JSON.stringify({ ...prev, theme }));

        // Apply dark mode class to root document element
        const isDark =
          theme === 'dark' ||
          (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
  };
});
