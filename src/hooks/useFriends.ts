import { useState, useEffect, useCallback } from 'react';
import { useServices } from './useServices';
import type { Friend, FriendWithStats } from '@/types/friend';

export function useFriends() {
  const { friendService } = useServices();
  const [friends, setFriends] = useState<FriendWithStats[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFriends = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await friendService.getAllWithStats();
      setFriends(data);
    } catch (err) {
      console.error('Failed to load friends', err);
      setError('Unable to load friends list.');
    } finally {
      setIsLoading(false);
    }
  }, [friendService]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const addFriend = async (friendData: Omit<Friend, 'id' | 'createdAt'>): Promise<Friend> => {
    const created = await friendService.create(friendData);
    await fetchFriends();
    return created;
  };

  const updateFriend = async (
    id: string,
    updates: Partial<Omit<Friend, 'id' | 'createdAt'>>
  ): Promise<Friend> => {
    const updated = await friendService.update(id, updates);
    await fetchFriends();
    return updated;
  };

  const deleteFriend = async (id: string): Promise<boolean> => {
    const ok = await friendService.delete(id);
    if (ok) {
      setFriends((prev) => prev.filter((f) => f.id !== id));
    }
    return ok;
  };

  return {
    friends,
    isLoading,
    error,
    refresh: fetchFriends,
    addFriend,
    updateFriend,
    deleteFriend,
  };
}
