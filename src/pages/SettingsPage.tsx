import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Laptop,
  DollarSign,
  RotateCcw,
  ShieldCheck,
  Check,
  Database,
  Copy,
  Server,
  Cloud,
  FileCode,
  CheckCircle2,
} from 'lucide-react';
import { usePreferencesStore, type Currency, type ThemeMode } from '@/stores/usePreferencesStore';
import { MockStorage } from '@/datasources/mock/MockStorage';
import { useServices } from '@/hooks/useServices';
import { getSupabaseConfig } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

export const SettingsPage: React.FC = () => {
  const { currency, setCurrency, theme, setTheme } = usePreferencesStore();
  const { dataSources } = useServices();
  const supabaseConfig = getSupabaseConfig();

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  const handleResetData = () => {
    MockStorage.resetToDefaults();
    setIsResetConfirmOpen(false);
    setResetSuccess(true);
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  const handleCopySchema = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_SCHEMA_REFERENCE);
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 2000);
    } catch (err) {
      console.error('Failed to copy schema:', err);
    }
  };

  const currencies: { code: Currency; symbol: string; label: string }[] = [
    { code: 'INR', symbol: '₹', label: 'Indian Rupee (INR)' },
    { code: 'USD', symbol: '$', label: 'US Dollar (USD)' },
    { code: 'EUR', symbol: '€', label: 'Euro (EUR)' },
    { code: 'GBP', symbol: '£', label: 'British Pound (GBP)' },
  ];

  const themeOptions: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
    { mode: 'light', label: 'Warm Off-White (Light)', icon: Sun },
    { mode: 'dark', label: 'Charcoal & Terracotta (Dark)', icon: Moon },
    { mode: 'system', label: 'System Default', icon: Laptop },
  ];

  const isSupabaseActive = dataSources.mode === 'supabase';

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-serif">
          Settings & Preferences
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customize your display currency, appearance themes, and manage your database connection.
        </p>
      </div>

      {resetSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-medium flex items-center gap-2">
          <Check className="h-4 w-4" />
          <span>Local journal database successfully reset to default sample data. Reloading...</span>
        </div>
      )}

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Sun className="h-5 w-5 text-primary" />
            <span>Theme & Appearance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {themeOptions.map(({ mode, label, icon: Icon }) => {
              const isSelected = theme === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setTheme(mode)}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-2 ${
                    isSelected
                      ? 'border-primary bg-primary/5 text-foreground shadow-xs'
                      : 'border-border bg-card text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isSelected ? 'text-primary' : ''}`} />
                  <span className="text-xs font-semibold">{label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Currency Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <span>Currency Display</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currencies.map(({ code, symbol, label }) => {
              const isSelected = currency === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setCurrency(code)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-primary bg-primary/5 text-foreground shadow-xs'
                      : 'border-border bg-card text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-sm font-semibold text-foreground">{label}</div>
                    <div className="text-xs text-muted-foreground">Symbol: {symbol}</div>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Database & Backend Status */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <span>Database & Cloud Backend</span>
            </CardTitle>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  isSupabaseActive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isSupabaseActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                />
                {isSupabaseActive ? 'Supabase Connected' : 'Local Storage Active'}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-secondary/40 border border-border/50 space-y-1">
              <div className="text-[11px] font-semibold uppercase text-muted-foreground">
                Active Storage Engine
              </div>
              <div className="font-semibold text-foreground flex items-center gap-1.5">
                {isSupabaseActive ? (
                  <>
                    <Cloud className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Supabase PostgreSQL + Storage</span>
                  </>
                ) : (
                  <>
                    <Server className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span>Browser LocalStorage (Offline)</span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground pt-1">
                {isSupabaseActive
                  ? 'All visits, dishes, and media are safely stored in your cloud database.'
                  : 'Operating in local offline sandbox mode.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-secondary/40 border border-border/50 space-y-1">
              <div className="text-[11px] font-semibold uppercase text-muted-foreground">
                Connection Endpoint
              </div>
              <div className="font-semibold text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="truncate">
                  {supabaseConfig.url
                    ? supabaseConfig.url.replace('https://', '')
                    : 'Local In-Memory'}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground pt-1">
                Media bucket <code className="bg-background px-1 py-0.5 rounded text-foreground font-mono text-[10px]">foodlog-media</code> active.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setIsSchemaModalOpen(true)}
            >
              <FileCode className="h-3.5 w-3.5 mr-1.5 text-primary" />
              View Database Schema Reference
            </Button>

            <span className="text-[11px] text-muted-foreground">
              Mode: <code className="font-mono text-foreground">{dataSources.mode}</code>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Dataset Reset (Available in Mock Mode) */}
      {!isSupabaseActive && (
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-destructive">
              <RotateCcw className="h-5 w-5" />
              <span>Reset Local Sample Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Restore the original demo dataset (restaurants, visits, dish ratings, and friends).
            </p>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setIsResetConfirmOpen(true)}
            >
              Reset to Sample Data
            </Button>
          </CardContent>
        </Card>
      )}

      {/* System & Architecture Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <span>Architecture & Data Isolation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs leading-relaxed text-muted-foreground">
          <p>
            FoodLog implements a clean 5-layer decoupled architecture. All business logic, rating aggregations, price history tracking, and analytics operate independently from the underlying storage layer.
          </p>
          <div className="flex flex-wrap gap-2 text-[11px] font-mono">
            <span className="px-2 py-1 rounded bg-secondary text-foreground">React UI</span>
            <span className="text-muted-foreground self-center">→</span>
            <span className="px-2 py-1 rounded bg-secondary text-foreground">Hooks & Controllers</span>
            <span className="text-muted-foreground self-center">→</span>
            <span className="px-2 py-1 rounded bg-secondary text-foreground">Domain Services</span>
            <span className="text-muted-foreground self-center">→</span>
            <span className="px-2 py-1 rounded bg-primary/10 text-primary font-semibold">
              {isSupabaseActive ? 'Supabase PostgREST' : 'Mock LocalStorage'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetData}
        title="Reset Sample Data?"
        description="This will restore the original demo dataset, discarding any modifications made in local offline mode."
        confirmLabel="Reset Everything"
      />

      {/* SQL Schema Reference Modal */}
      <Modal
        isOpen={isSchemaModalOpen}
        onClose={() => setIsSchemaModalOpen(false)}
        title="PostgreSQL Schema Reference"
        description="Relational database tables, constraints, indexes, and storage configuration"
        maxWidth="2xl"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 p-2 bg-secondary rounded-lg">
            <span className="text-xs text-muted-foreground font-mono">
              supabase/schema.sql &bull; 7 Tables &bull; RLS Enabled
            </span>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleCopySchema}
              className="text-xs"
            >
              {copiedSchema ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copy SQL
                </>
              )}
            </Button>
          </div>

          <pre className="p-3.5 rounded-xl bg-charcoal-900 text-zinc-100 font-mono text-[11px] leading-relaxed max-h-[50vh] overflow-y-auto border border-border">
            {SUPABASE_SCHEMA_REFERENCE}
          </pre>

          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsSchemaModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const SUPABASE_SCHEMA_REFERENCE = `-- FoodLog Database Schema Reference
-- Tables: restaurants, visits, dishes, visit_dishes, friends, visit_friends, attachments
-- Storage: foodlog-media bucket
-- Schema file located at: supabase/schema.sql

-- For full script with triggers and RLS policies, inspect supabase/schema.sql in the project root.
`;
