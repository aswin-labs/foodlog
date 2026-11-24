import type { IVisitDataSource } from '../interfaces/IVisitDataSource';
import type { Visit, VisitDish, VisitFriend } from '@/types/visit';
import type { Attachment } from '@/types/attachment';
import { MockStorage } from './MockStorage';

export class MockVisitDataSource implements IVisitDataSource {
  private async delay(ms = 80): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getAll(): Promise<Visit[]> {
    await this.delay();
    const visits = MockStorage.getVisits();
    return [...visits].sort((a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime());
  }

  async getById(id: string): Promise<Visit | null> {
    await this.delay();
    const all = MockStorage.getVisits();
    return all.find((v) => v.id === id) || null;
  }

  async getByRestaurantId(restaurantId: string): Promise<Visit[]> {
    await this.delay();
    const all = MockStorage.getVisits();
    return all
      .filter((v) => v.restaurantId === restaurantId)
      .sort((a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime());
  }

  async create(
    visitInput: Omit<Visit, 'id' | 'createdAt' | 'updatedAt'>,
    dishesInput: Omit<VisitDish, 'id' | 'visitId'>[],
    friendIds: string[],
    attachmentsInput?: Omit<Attachment, 'id' | 'visitId' | 'createdAt'>[]
  ): Promise<Visit> {
    await this.delay();
    const now = new Date().toISOString();
    const visitId = `visit-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`;

    const newVisit: Visit = {
      ...visitInput,
      id: visitId,
      createdAt: now,
      updatedAt: now,
    };

    // Save visit
    const visits = MockStorage.getVisits();
    MockStorage.setVisits([newVisit, ...visits]);

    // Save visit dishes
    const currentDishes = MockStorage.getVisitDishes();
    const newVisitDishes: VisitDish[] = dishesInput.map((d, index) => ({
      ...d,
      id: `vd-${Date.now()}-${index}`,
      visitId,
    }));
    MockStorage.setVisitDishes([...currentDishes, ...newVisitDishes]);

    // Save visit friends
    const currentFriends = MockStorage.getVisitFriends();
    const newVisitFriends: VisitFriend[] = friendIds.map((fId, index) => ({
      id: `vf-${Date.now()}-${index}`,
      visitId,
      friendId: fId,
    }));
    MockStorage.setVisitFriends([...currentFriends, ...newVisitFriends]);

    // Save attachments if provided
    if (attachmentsInput && attachmentsInput.length > 0) {
      const currentAttachments = MockStorage.getAttachments();
      const newAttachments: Attachment[] = attachmentsInput.map((att, index) => ({
        ...att,
        id: `att-${Date.now()}-${index}`,
        visitId,
        createdAt: now,
      }));
      MockStorage.setAttachments([...currentAttachments, ...newAttachments]);
    }

    return newVisit;
  }

  async update(id: string, updates: Partial<Omit<Visit, 'id' | 'createdAt'>>): Promise<Visit> {
    await this.delay();
    const all = MockStorage.getVisits();
    const index = all.findIndex((v) => v.id === id);
    if (index === -1) {
      throw new Error(`Visit with id ${id} not found.`);
    }
    const updated: Visit = {
      ...all[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    all[index] = updated;
    MockStorage.setVisits([...all]);
    return updated;
  }

  async updateWithDetails(
    id: string,
    visitUpdates: Partial<Omit<Visit, 'id' | 'createdAt'>>,
    dishesInput: Omit<VisitDish, 'id' | 'visitId'>[],
    friendIds: string[],
    attachmentsInput?: Omit<Attachment, 'id' | 'visitId' | 'createdAt'>[]
  ): Promise<Visit> {
    await this.delay();
    const visits = MockStorage.getVisits();
    const index = visits.findIndex((v) => v.id === id);
    if (index === -1) {
      throw new Error(`Visit with id ${id} not found.`);
    }
    const now = new Date().toISOString();
    const updatedVisit: Visit = {
      ...visits[index],
      ...visitUpdates,
      updatedAt: now,
    };
    visits[index] = updatedVisit;
    MockStorage.setVisits([...visits]);

    // Update dishes: remove old, add new
    const otherDishes = MockStorage.getVisitDishes().filter((vd) => vd.visitId !== id);
    const newVisitDishes: VisitDish[] = dishesInput.map((d, i) => ({
      ...d,
      id: `vd-${Date.now()}-${i}`,
      visitId: id,
    }));
    MockStorage.setVisitDishes([...otherDishes, ...newVisitDishes]);

    // Update friends: remove old, add new
    const otherFriends = MockStorage.getVisitFriends().filter((vf) => vf.visitId !== id);
    const newVisitFriends: VisitFriend[] = friendIds.map((fId, i) => ({
      id: `vf-${Date.now()}-${i}`,
      visitId: id,
      friendId: fId,
    }));
    MockStorage.setVisitFriends([...otherFriends, ...newVisitFriends]);

    // Update attachments if provided
    if (attachmentsInput) {
      const otherAttachments = MockStorage.getAttachments().filter((att) => att.visitId !== id);
      const newAttachments: Attachment[] = attachmentsInput.map((att, i) => ({
        ...att,
        id: `att-${Date.now()}-${i}`,
        visitId: id,
        createdAt: now,
      }));
      MockStorage.setAttachments([...otherAttachments, ...newAttachments]);
    }

    return updatedVisit;
  }

  async delete(id: string): Promise<boolean> {
    await this.delay();
    const visits = MockStorage.getVisits();
    const filtered = visits.filter((v) => v.id !== id);
    if (filtered.length === visits.length) return false;

    MockStorage.setVisits(filtered);

    // Clean up related records
    const vDishes = MockStorage.getVisitDishes().filter((vd) => vd.visitId !== id);
    MockStorage.setVisitDishes(vDishes);

    const vFriends = MockStorage.getVisitFriends().filter((vf) => vf.visitId !== id);
    MockStorage.setVisitFriends(vFriends);

    const attachments = MockStorage.getAttachments().filter((att) => att.visitId !== id);
    MockStorage.setAttachments(attachments);

    return true;
  }

  async getVisitDishes(visitId?: string): Promise<VisitDish[]> {
    await this.delay();
    const all = MockStorage.getVisitDishes();
    if (!visitId) return all;
    return all.filter((vd) => vd.visitId === visitId);
  }

  async getVisitFriends(visitId?: string): Promise<VisitFriend[]> {
    await this.delay();
    const all = MockStorage.getVisitFriends();
    if (!visitId) return all;
    return all.filter((vf) => vf.visitId === visitId);
  }

  async getAttachments(visitId?: string): Promise<Attachment[]> {
    await this.delay();
    const all = MockStorage.getAttachments();
    if (!visitId) return all;
    return all.filter((att) => att.visitId === visitId);
  }

  async addAttachment(attachmentInput: Omit<Attachment, 'id' | 'createdAt'>): Promise<Attachment> {
    await this.delay();
    const all = MockStorage.getAttachments();
    const newAtt: Attachment = {
      ...attachmentInput,
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    MockStorage.setAttachments([...all, newAtt]);
    return newAtt;
  }

  async deleteAttachment(id: string): Promise<boolean> {
    await this.delay();
    const all = MockStorage.getAttachments();
    const filtered = all.filter((att) => att.id !== id);
    if (filtered.length === all.length) return false;
    MockStorage.setAttachments(filtered);
    return true;
  }
}
