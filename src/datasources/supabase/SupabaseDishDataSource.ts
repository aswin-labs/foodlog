import type { IDishDataSource } from '../interfaces/IDishDataSource';
import type { Dish } from '@/types/dish';
import { getSupabaseClient } from '@/lib/supabase';
import { mapDishRowToEntity, mapDishEntityToRow } from './mappers';

export class SupabaseDishDataSource implements IDishDataSource {
  async getAll(): Promise<Dish[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('dishes')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Supabase error fetching dishes:', error);
      throw new Error(`Failed to load dishes: ${error.message}`);
    }

    return (data || []).map(mapDishRowToEntity);
  }

  async getById(id: string): Promise<Dish | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('dishes')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error(`Supabase error fetching dish ${id}:`, error);
      throw new Error(`Failed to load dish: ${error.message}`);
    }

    return data ? mapDishRowToEntity(data) : null;
  }

  async getByName(name: string): Promise<Dish | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('dishes')
      .select('*')
      .ilike('name', name.trim())
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(`Supabase error checking dish by name "${name}":`, error);
      return null;
    }

    return data ? mapDishRowToEntity(data) : null;
  }

  async create(dishInput: Omit<Dish, 'id' | 'createdAt'>): Promise<Dish> {
    const supabase = getSupabaseClient();
    const row = mapDishEntityToRow(dishInput);

    const { data, error } = await supabase
      .from('dishes')
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating dish:', error);
      throw new Error(`Failed to create dish: ${error.message}`);
    }

    return mapDishRowToEntity(data);
  }

  async getOrCreate(name: string, category: string, description?: string): Promise<Dish> {
    const existing = await this.getByName(name);
    if (existing) return existing;

    return this.create({
      name: name.trim(),
      category: category || 'Main Course',
      description: description || '',
    });
  }

  async update(id: string, updates: Partial<Omit<Dish, 'id' | 'createdAt'>>): Promise<Dish> {
    const supabase = getSupabaseClient();
    const rowUpdates: Record<string, unknown> = {};

    if (updates.name !== undefined) rowUpdates.name = updates.name;
    if (updates.category !== undefined) rowUpdates.category = updates.category;
    if (updates.description !== undefined) rowUpdates.description = updates.description;

    const { data, error } = await supabase
      .from('dishes')
      .update(rowUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Supabase error updating dish ${id}:`, error);
      throw new Error(`Failed to update dish: ${error.message}`);
    }

    return mapDishRowToEntity(data);
  }

  async delete(id: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('dishes').delete().eq('id', id);

    if (error) {
      console.error(`Supabase error deleting dish ${id}:`, error);
      throw new Error(`Failed to delete dish: ${error.message}`);
    }

    return true;
  }
}
