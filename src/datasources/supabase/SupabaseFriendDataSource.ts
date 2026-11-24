import type { IFriendDataSource } from '../interfaces/IFriendDataSource';
import type { Friend } from '@/types/friend';
import { getSupabaseClient } from '@/lib/supabase';
import { mapFriendRowToEntity, mapFriendEntityToRow } from './mappers';

export class SupabaseFriendDataSource implements IFriendDataSource {
  async getAll(): Promise<Friend[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('friends')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Supabase error fetching friends:', error);
      throw new Error(`Failed to load friends: ${error.message}`);
    }

    return (data || []).map(mapFriendRowToEntity);
  }

  async getById(id: string): Promise<Friend | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('friends')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error(`Supabase error fetching friend ${id}:`, error);
      throw new Error(`Failed to load friend: ${error.message}`);
    }

    return data ? mapFriendRowToEntity(data) : null;
  }

  async create(friendInput: Omit<Friend, 'id' | 'createdAt'>): Promise<Friend> {
    const supabase = getSupabaseClient();
    const row = mapFriendEntityToRow(friendInput);

    const { data, error } = await supabase
      .from('friends')
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating friend:', error);
      throw new Error(`Failed to create friend: ${error.message}`);
    }

    return mapFriendRowToEntity(data);
  }

  async update(id: string, updates: Partial<Omit<Friend, 'id' | 'createdAt'>>): Promise<Friend> {
    const supabase = getSupabaseClient();
    const rowUpdates: Record<string, unknown> = {};

    if (updates.name !== undefined) rowUpdates.name = updates.name;
    if (updates.nickname !== undefined) rowUpdates.nickname = updates.nickname;

    const { data, error } = await supabase
      .from('friends')
      .update(rowUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Supabase error updating friend ${id}:`, error);
      throw new Error(`Failed to update friend: ${error.message}`);
    }

    return mapFriendRowToEntity(data);
  }

  async delete(id: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('friends').delete().eq('id', id);

    if (error) {
      console.error(`Supabase error deleting friend ${id}:`, error);
      throw new Error(`Failed to delete friend: ${error.message}`);
    }

    return true;
  }
}
