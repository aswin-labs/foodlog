import type { IVisitDataSource } from '../interfaces/IVisitDataSource';
import type { Visit, VisitDish, VisitFriend } from '@/types/visit';
import type { Attachment } from '@/types/attachment';
import { getSupabaseClient } from '@/lib/supabase';
import {
  mapVisitRowToEntity,
  mapVisitEntityToRow,
  mapVisitDishRowToEntity,
  mapVisitFriendRowToEntity,
  mapAttachmentRowToEntity,
} from './mappers';

export class SupabaseVisitDataSource implements IVisitDataSource {
  async getAll(): Promise<Visit[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('visits')
      .select('*')
      .order('visited_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching visits:', error);
      throw new Error(`Failed to load visits: ${error.message}`);
    }

    return (data || []).map(mapVisitRowToEntity);
  }

  async getById(id: string): Promise<Visit | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('visits')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error(`Supabase error fetching visit ${id}:`, error);
      throw new Error(`Failed to load visit: ${error.message}`);
    }

    return data ? mapVisitRowToEntity(data) : null;
  }

  async getByRestaurantId(restaurantId: string): Promise<Visit[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('visits')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('visited_at', { ascending: false });

    if (error) {
      console.error(`Supabase error fetching visits for restaurant ${restaurantId}:`, error);
      throw new Error(`Failed to load visits: ${error.message}`);
    }

    return (data || []).map(mapVisitRowToEntity);
  }

  async create(
    visitInput: Omit<Visit, 'id' | 'createdAt' | 'updatedAt'>,
    dishesInput: Omit<VisitDish, 'id' | 'visitId'>[],
    friendIds: string[],
    attachmentsInput?: Omit<Attachment, 'id' | 'visitId' | 'createdAt'>[]
  ): Promise<Visit> {
    const supabase = getSupabaseClient();
    const visitRow = mapVisitEntityToRow(visitInput);

    // 1. Insert Visit row
    const { data: createdVisit, error: visitError } = await supabase
      .from('visits')
      .insert(visitRow)
      .select()
      .single();

    if (visitError) {
      console.error('Supabase error creating visit:', visitError);
      throw new Error(`Failed to record visit: ${visitError.message}`);
    }

    const visitId = createdVisit.id;

    // 2. Insert Visit Dishes
    if (dishesInput.length > 0) {
      const dishRows = dishesInput.map((d) => ({
        visit_id: visitId,
        dish_id: d.dishId,
        price: d.price,
        quantity: d.quantity,
        rating: d.rating,
        notes: d.notes || null,
        would_order_again: d.wouldOrderAgain,
        photo_attachments: d.photoAttachments || [],
      }));

      const { error: dishError } = await supabase.from('visit_dishes').insert(dishRows);
      if (dishError) {
        console.error('Supabase error inserting visit dishes:', dishError);
      }
    }

    // 3. Insert Visit Friends
    if (friendIds.length > 0) {
      const friendRows = friendIds.map((fId) => ({
        visit_id: visitId,
        friend_id: fId,
      }));

      const { error: friendError } = await supabase.from('visit_friends').insert(friendRows);
      if (friendError) {
        console.error('Supabase error inserting visit friends:', friendError);
      }
    }

    // 4. Insert Attachments
    if (attachmentsInput && attachmentsInput.length > 0) {
      const attachmentRows = attachmentsInput.map((att) => ({
        visit_id: visitId,
        type: att.type,
        file_name: att.fileName,
        storage_path: att.storagePath,
      }));

      const { error: attError } = await supabase.from('attachments').insert(attachmentRows);
      if (attError) {
        console.error('Supabase error inserting attachments:', attError);
      }
    }

    return mapVisitRowToEntity(createdVisit);
  }

  async update(
    id: string,
    updates: Partial<Omit<Visit, 'id' | 'createdAt'>>
  ): Promise<Visit> {
    const supabase = getSupabaseClient();
    const rowUpdates: Record<string, unknown> = {};

    if (updates.restaurantId !== undefined) rowUpdates.restaurant_id = updates.restaurantId;
    if (updates.visitedAt !== undefined) rowUpdates.visited_at = updates.visitedAt;
    if (updates.totalBill !== undefined) rowUpdates.total_bill = updates.totalBill;
    if (updates.numberOfPeople !== undefined) rowUpdates.number_of_people = updates.numberOfPeople;
    if (updates.overallRating !== undefined) rowUpdates.overall_rating = updates.overallRating;
    if (updates.foodQualityRating !== undefined) rowUpdates.food_quality_rating = updates.foodQualityRating;
    if (updates.valueForMoneyRating !== undefined) rowUpdates.value_for_money_rating = updates.valueForMoneyRating;
    if (updates.serviceRating !== undefined) rowUpdates.service_rating = updates.serviceRating;
    if (updates.ambienceRating !== undefined) rowUpdates.ambience_rating = updates.ambienceRating;
    if (updates.notes !== undefined) rowUpdates.notes = updates.notes;

    const { data, error } = await supabase
      .from('visits')
      .update(rowUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Supabase error updating visit ${id}:`, error);
      throw new Error(`Failed to update visit: ${error.message}`);
    }

    return mapVisitRowToEntity(data);
  }

  async updateWithDetails(
    id: string,
    visitUpdates: Partial<Omit<Visit, 'id' | 'createdAt'>>,
    dishesInput: Omit<VisitDish, 'id' | 'visitId'>[],
    friendIds: string[],
    attachmentsInput?: Omit<Attachment, 'id' | 'visitId' | 'createdAt'>[]
  ): Promise<Visit> {
    const supabase = getSupabaseClient();

    // 1. Update Visit row
    const updatedVisit = await this.update(id, visitUpdates);

    // 2. Synchronize dishes: delete existing for visit, insert new
    await supabase.from('visit_dishes').delete().eq('visit_id', id);
    if (dishesInput.length > 0) {
      const dishRows = dishesInput.map((d) => ({
        visit_id: id,
        dish_id: d.dishId,
        price: d.price,
        quantity: d.quantity,
        rating: d.rating,
        notes: d.notes || null,
        would_order_again: d.wouldOrderAgain,
        photo_attachments: d.photoAttachments || [],
      }));
      await supabase.from('visit_dishes').insert(dishRows);
    }

    // 3. Synchronize friends
    await supabase.from('visit_friends').delete().eq('visit_id', id);
    if (friendIds.length > 0) {
      const friendRows = friendIds.map((fId) => ({
        visit_id: id,
        friend_id: fId,
      }));
      await supabase.from('visit_friends').insert(friendRows);
    }

    // 4. Synchronize attachments if provided
    if (attachmentsInput) {
      await supabase.from('attachments').delete().eq('visit_id', id);
      if (attachmentsInput.length > 0) {
        const attRows = attachmentsInput.map((att) => ({
          visit_id: id,
          type: att.type,
          file_name: att.fileName,
          storage_path: att.storagePath,
        }));
        await supabase.from('attachments').insert(attRows);
      }
    }

    return updatedVisit;
  }

  async delete(id: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('visits').delete().eq('id', id);

    if (error) {
      console.error(`Supabase error deleting visit ${id}:`, error);
      throw new Error(`Failed to delete visit: ${error.message}`);
    }

    return true;
  }

  async getVisitDishes(visitId?: string): Promise<VisitDish[]> {
    const supabase = getSupabaseClient();
    let query = supabase.from('visit_dishes').select('*');

    if (visitId) {
      query = query.eq('visit_id', visitId);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Supabase error fetching visit dishes:', error);
      return [];
    }

    return (data || []).map(mapVisitDishRowToEntity);
  }

  async getVisitFriends(visitId?: string): Promise<VisitFriend[]> {
    const supabase = getSupabaseClient();
    let query = supabase.from('visit_friends').select('*');

    if (visitId) {
      query = query.eq('visit_id', visitId);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Supabase error fetching visit friends:', error);
      return [];
    }

    return (data || []).map(mapVisitFriendRowToEntity);
  }

  async getAttachments(visitId?: string): Promise<Attachment[]> {
    const supabase = getSupabaseClient();
    let query = supabase.from('attachments').select('*');

    if (visitId) {
      query = query.eq('visit_id', visitId);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Supabase error fetching attachments:', error);
      return [];
    }

    return (data || []).map(mapAttachmentRowToEntity);
  }

  async addAttachment(attachmentInput: Omit<Attachment, 'id' | 'createdAt'>): Promise<Attachment> {
    const supabase = getSupabaseClient();
    const row = {
      visit_id: attachmentInput.visitId,
      visit_dish_id: attachmentInput.visitDishId || null,
      type: attachmentInput.type,
      file_name: attachmentInput.fileName,
      storage_path: attachmentInput.storagePath,
    };

    const { data, error } = await supabase.from('attachments').insert(row).select().single();
    if (error) {
      console.error('Supabase error adding attachment:', error);
      throw new Error(`Failed to save attachment: ${error.message}`);
    }

    return mapAttachmentRowToEntity(data);
  }

  async deleteAttachment(id: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('attachments').delete().eq('id', id);
    if (error) {
      console.error(`Supabase error deleting attachment ${id}:`, error);
      return false;
    }
    return true;
  }
}
