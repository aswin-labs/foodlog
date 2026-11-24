import type { Restaurant } from '@/types/restaurant';
import type { Visit, VisitDish, VisitFriend } from '@/types/visit';
import type { Dish } from '@/types/dish';
import type { Friend } from '@/types/friend';
import type { Attachment } from '@/types/attachment';

/* eslint-disable @typescript-eslint/no-explicit-any */

export function mapRestaurantRowToEntity(row: any): Restaurant {
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    location: row.location,
    address: row.address || '',
    cuisineTypes: row.cuisine_types || [],
    coverImage: row.cover_image || '',
    favourite: Boolean(row.favourite),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ownerId: row.owner_id || undefined,
  };
}

export function mapRestaurantEntityToRow(
  restaurant: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'>
): Record<string, any> {
  return {
    name: restaurant.name,
    description: restaurant.description,
    location: restaurant.location,
    address: restaurant.address,
    cuisine_types: restaurant.cuisineTypes,
    cover_image: restaurant.coverImage,
    favourite: restaurant.favourite,
    ...(restaurant.ownerId ? { owner_id: restaurant.ownerId } : {}),
  };
}

export function mapVisitRowToEntity(row: any): Visit {
  return {
    id: row.id,
    restaurantId: row.restaurant_id,
    visitedAt: row.visited_at,
    totalBill: Number(row.total_bill),
    numberOfPeople: Number(row.number_of_people),
    overallRating: Number(row.overall_rating),
    foodQualityRating: Number(row.food_quality_rating),
    valueForMoneyRating: Number(row.value_for_money_rating),
    serviceRating: Number(row.service_rating),
    ambienceRating: Number(row.ambience_rating),
    notes: row.notes || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ownerId: row.owner_id || undefined,
  };
}

export function mapVisitEntityToRow(
  visit: Omit<Visit, 'id' | 'createdAt' | 'updatedAt'>
): Record<string, any> {
  return {
    restaurant_id: visit.restaurantId,
    visited_at: visit.visitedAt,
    total_bill: visit.totalBill,
    number_of_people: visit.numberOfPeople,
    overall_rating: visit.overallRating,
    food_quality_rating: visit.foodQualityRating,
    value_for_money_rating: visit.valueForMoneyRating,
    service_rating: visit.serviceRating,
    ambience_rating: visit.ambienceRating,
    notes: visit.notes || '',
    ...(visit.ownerId ? { owner_id: visit.ownerId } : {}),
  };
}

export function mapDishRowToEntity(row: any): Dish {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description || '',
    createdAt: row.created_at,
    ownerId: row.owner_id || undefined,
  };
}

export function mapDishEntityToRow(
  dish: Omit<Dish, 'id' | 'createdAt'>
): Record<string, any> {
  return {
    name: dish.name,
    category: dish.category,
    description: dish.description || '',
    ...(dish.ownerId ? { owner_id: dish.ownerId } : {}),
  };
}

export function mapVisitDishRowToEntity(row: any): VisitDish {
  return {
    id: row.id,
    visitId: row.visit_id,
    dishId: row.dish_id,
    price: Number(row.price),
    quantity: Number(row.quantity),
    rating: Number(row.rating),
    notes: row.notes || undefined,
    wouldOrderAgain: Boolean(row.would_order_again),
    photoAttachments: row.photo_attachments || [],
  };
}

export function mapVisitFriendRowToEntity(row: any): VisitFriend {
  return {
    id: row.id,
    visitId: row.visit_id,
    friendId: row.friend_id,
  };
}

export function mapFriendRowToEntity(row: any): Friend {
  return {
    id: row.id,
    name: row.name,
    nickname: row.nickname || undefined,
    createdAt: row.created_at,
    ownerId: row.owner_id || undefined,
    linkedUserId: row.linked_user_id || undefined,
  };
}

export function mapFriendEntityToRow(
  friend: Omit<Friend, 'id' | 'createdAt'>
): Record<string, any> {
  return {
    name: friend.name,
    nickname: friend.nickname || null,
    ...(friend.ownerId ? { owner_id: friend.ownerId } : {}),
    ...(friend.linkedUserId ? { linked_user_id: friend.linkedUserId } : {}),
  };
}

export function mapAttachmentRowToEntity(row: any): Attachment {
  return {
    id: row.id,
    visitId: row.visit_id,
    visitDishId: row.visit_dish_id || undefined,
    type: row.type,
    fileName: row.file_name,
    storagePath: row.storage_path,
    createdAt: row.created_at,
    ownerId: row.owner_id || undefined,
  };
}
