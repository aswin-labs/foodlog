import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Automatically sanitize URL: strip trailing slashes or accidental '/rest/v1' path suffixes
export const cleanSupabaseUrl = rawSupabaseUrl
  ? rawSupabaseUrl.trim().replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '')
  : undefined;

let clientInstance: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    cleanSupabaseUrl &&
      supabaseAnonKey &&
      cleanSupabaseUrl.startsWith('https://') &&
      !cleanSupabaseUrl.includes('your-project') &&
      supabaseAnonKey.length > 20
  );
}

export function getSupabaseConfig(): {
  url: string | null;
  isConfigured: boolean;
  activeMode: 'mock' | 'supabase';
} {
  const configured = isSupabaseConfigured();
  const explicitPreference = (import.meta.env.VITE_DATA_SOURCE as string) || '';

  const activeMode: 'mock' | 'supabase' =
    explicitPreference === 'supabase' && configured ? 'supabase' : 'mock';

  return {
    url: cleanSupabaseUrl || null,
    isConfigured: configured,
    activeMode,
  };
}

export function getSupabaseClient(): SupabaseClient {
  if (clientInstance) return clientInstance;

  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not properly configured. Please define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
    );
  }

  clientInstance = createClient(cleanSupabaseUrl!, supabaseAnonKey!.trim(), {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return clientInstance;
}
