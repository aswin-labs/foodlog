import type { IRestaurantDataSource } from './interfaces/IRestaurantDataSource';
import type { IVisitDataSource } from './interfaces/IVisitDataSource';
import type { IDishDataSource } from './interfaces/IDishDataSource';
import type { IFriendDataSource } from './interfaces/IFriendDataSource';

import { MockRestaurantDataSource } from './mock/MockRestaurantDataSource';
import { MockVisitDataSource } from './mock/MockVisitDataSource';
import { MockDishDataSource } from './mock/MockDishDataSource';
import { MockFriendDataSource } from './mock/MockFriendDataSource';

import { SupabaseRestaurantDataSource } from './supabase/SupabaseRestaurantDataSource';
import { SupabaseVisitDataSource } from './supabase/SupabaseVisitDataSource';
import { SupabaseDishDataSource } from './supabase/SupabaseDishDataSource';
import { SupabaseFriendDataSource } from './supabase/SupabaseFriendDataSource';
import { getSupabaseConfig, isSupabaseConfigured } from '@/lib/supabase';

export * from './interfaces';
export * from './mock/MockRestaurantDataSource';
export * from './mock/MockVisitDataSource';
export * from './mock/MockDishDataSource';
export * from './mock/MockFriendDataSource';
export * from './mock/MockStorage';
export * from './supabase/SupabaseRestaurantDataSource';
export * from './supabase/SupabaseVisitDataSource';
export * from './supabase/SupabaseDishDataSource';
export * from './supabase/SupabaseFriendDataSource';
export * from './supabase/SupabaseStorageService';

export interface IDataSources {
  restaurant: IRestaurantDataSource;
  visit: IVisitDataSource;
  dish: IDishDataSource;
  friend: IFriendDataSource;
  mode: 'mock' | 'supabase';
}

/**
 * Factory function for creating data sources.
 * To connect Supabase, set VITE_DATA_SOURCE=supabase and provide valid credentials.
 * If credentials are missing, it safely falls back to Mock without crashing.
 */
export function createDataSources(preferredMode?: 'mock' | 'supabase'): IDataSources {
  const config = getSupabaseConfig();
  const targetMode = preferredMode || config.activeMode;

  if (targetMode === 'supabase') {
    if (isSupabaseConfigured()) {
      return {
        restaurant: new SupabaseRestaurantDataSource(),
        visit: new SupabaseVisitDataSource(),
        dish: new SupabaseDishDataSource(),
        friend: new SupabaseFriendDataSource(),
        mode: 'supabase',
      };
    } else {
      console.warn(
        '[FoodLog DataSources] Supabase mode requested via VITE_DATA_SOURCE="supabase", but VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY are missing or default. Falling back to Mock data sources.'
      );
    }
  }

  return {
    restaurant: new MockRestaurantDataSource(),
    visit: new MockVisitDataSource(),
    dish: new MockDishDataSource(),
    friend: new MockFriendDataSource(),
    mode: 'mock',
  };
}
