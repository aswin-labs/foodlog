import type { IRestaurantDataSource } from '../interfaces/IRestaurantDataSource';
import type { Restaurant } from '@/types/restaurant';
import { getSupabaseClient } from '@/lib/supabase';
import { mapRestaurantRowToEntity, mapRestaurantEntityToRow } from './mappers';

export class SupabaseRestaurantDataSource implements IRestaurantDataSource {
  async getAll(): Promise<Restaurant[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Supabase error fetching restaurants:', error);
      throw new Error(`Failed to load restaurants: ${error.message}`);
    }

    return (data || []).map(mapRestaurantRowToEntity);
  }

  async getById(id: string): Promise<Restaurant | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error(`Supabase error fetching restaurant ${id}:`, error);
      throw new Error(`Failed to load restaurant: ${error.message}`);
    }

    return data ? mapRestaurantRowToEntity(data) : null;
  }

  async create(
    restaurantInput: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Restaurant> {
    const supabase = getSupabaseClient();
    const row = mapRestaurantEntityToRow(restaurantInput);

    const { data, error } = await supabase
      .from('restaurants')
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating restaurant:', error);
      throw new Error(`Failed to create restaurant: ${error.message}`);
    }

    return mapRestaurantRowToEntity(data);
  }

  async update(
    id: string,
    updates: Partial<Omit<Restaurant, 'id' | 'createdAt'>>
  ): Promise<Restaurant> {
    const supabase = getSupabaseClient();
    const rowUpdates: Record<string, unknown> = {};

    if (updates.name !== undefined) rowUpdates.name = updates.name;
    if (updates.description !== undefined) rowUpdates.description = updates.description;
    if (updates.location !== undefined) rowUpdates.location = updates.location;
    if (updates.address !== undefined) rowUpdates.address = updates.address;
    if (updates.cuisineTypes !== undefined) rowUpdates.cuisine_types = updates.cuisineTypes;
    if (updates.coverImage !== undefined) rowUpdates.cover_image = updates.coverImage;
    if (updates.favourite !== undefined) rowUpdates.favourite = updates.favourite;

    const { data, error } = await supabase
      .from('restaurants')
      .update(rowUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Supabase error updating restaurant ${id}:`, error);
      throw new Error(`Failed to update restaurant: ${error.message}`);
    }

    return mapRestaurantRowToEntity(data);
  }

  async delete(id: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('restaurants').delete().eq('id', id);

    if (error) {
      console.error(`Supabase error deleting restaurant ${id}:`, error);
      throw new Error(`Failed to delete restaurant: ${error.message}`);
    }

    return true;
  }

  async toggleFavourite(id: string): Promise<Restaurant> {
    const current = await this.getById(id);
    if (!current) {
      throw new Error(`Restaurant with id ${id} not found.`);
    }

    return this.update(id, { favourite: !current.favourite });
  }
}
