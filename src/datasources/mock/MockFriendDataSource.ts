import type { IFriendDataSource } from '../interfaces/IFriendDataSource';
import type { Friend } from '@/types/friend';
import { MockStorage } from './MockStorage';

export class MockFriendDataSource implements IFriendDataSource {
  private async delay(ms = 80): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getAll(): Promise<Friend[]> {
    await this.delay();
    const friends = MockStorage.getFriends();
    return [...friends].sort((a, b) => a.name.localeCompare(b.name));
  }

  async getById(id: string): Promise<Friend | null> {
    await this.delay();
    const all = MockStorage.getFriends();
    return all.find((f) => f.id === id) || null;
  }

  async create(friendInput: Omit<Friend, 'id' | 'createdAt'>): Promise<Friend> {
    await this.delay();
    const all = MockStorage.getFriends();
    const newFriend: Friend = {
      ...friendInput,
      id: `friend-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    MockStorage.setFriends([...all, newFriend]);
    return newFriend;
  }

  async update(id: string, updates: Partial<Omit<Friend, 'id' | 'createdAt'>>): Promise<Friend> {
    await this.delay();
    const all = MockStorage.getFriends();
    const index = all.findIndex((f) => f.id === id);
    if (index === -1) {
      throw new Error(`Friend with id ${id} not found.`);
    }
    const updated: Friend = { ...all[index], ...updates };
    all[index] = updated;
    MockStorage.setFriends([...all]);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    await this.delay();
    const all = MockStorage.getFriends();
    const filtered = all.filter((f) => f.id !== id);
    if (filtered.length === all.length) return false;
    MockStorage.setFriends(filtered);

    // Remove relationships
    const currentVf = MockStorage.getVisitFriends().filter((vf) => vf.friendId !== id);
    MockStorage.setVisitFriends(currentVf);

    return true;
  }
}
