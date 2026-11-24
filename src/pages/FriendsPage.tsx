import React, { useState } from 'react';
import { UserPlus, Pencil, Trash2, Users } from 'lucide-react';
import { useFriends } from '@/hooks/useFriends';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { formatDate } from '@/lib/utils';
import type { FriendWithStats } from '@/types/friend';

export const FriendsPage: React.FC = () => {
  const { friends, addFriend, updateFriend, deleteFriend } = useFriends();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFriend, setEditingFriend] = useState<FriendWithStats | null>(null);
  const [friendToDelete, setFriendToDelete] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAdd = () => {
    setName('');
    setNickname('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (friend: FriendWithStats) => {
    setEditingFriend(friend);
    setName(friend.name);
    setNickname(friend.nickname || '');
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    try {
      setIsSubmitting(true);
      if (editingFriend) {
        await updateFriend(editingFriend.id, {
          name: name.trim(),
          nickname: nickname.trim() || undefined,
        });
        setEditingFriend(null);
      } else {
        await addFriend({
          name: name.trim(),
          nickname: nickname.trim() || undefined,
        });
        setIsAddModalOpen(false);
      }
      setName('');
      setNickname('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!friendToDelete) return;
    await deleteFriend(friendToDelete);
    setFriendToDelete(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-serif">
            Friends Circle
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            People you dine with, visits attended together, and favorite shared spots
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="font-semibold shadow-sm shrink-0">
          <UserPlus className="h-4 w-4 mr-1.5" />
          Add Friend
        </Button>
      </div>

      {/* Friends Cards Grid */}
      {friends.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No dining friends added yet"
          description="Keep track of friends who join you on restaurant visits to see where you dine together most often."
          actionLabel="Add First Friend"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {friends.map((friend) => (
            <Card key={friend.id} className="flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-serif font-bold text-lg border border-primary/20">
                    {friend.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base">{friend.name}</h3>
                    {friend.nickname && (
                      <p className="text-xs text-primary font-medium">"{friend.nickname}"</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(friend)}
                    className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setFriendToDelete(friend.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-2">
              <div className="p-3 rounded-xl bg-secondary/50 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Visits together:</span>
                  <strong className="text-foreground">{friend.visitsCount}</strong>
                </div>

                {friend.lastVisitedTogether && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last outing:</span>
                    <span className="font-medium text-foreground">
                      {formatDate(friend.lastVisitedTogether)}
                    </span>
                  </div>
                )}
              </div>

              {friend.favoriteRestaurants.length > 0 && (
                <div className="space-y-1 text-xs">
                  <span className="text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                    Top Shared Spots:
                  </span>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {friend.favoriteRestaurants.map((fr) => (
                      <span
                        key={fr.restaurantId}
                        className="px-2 py-0.5 rounded-md bg-secondary text-foreground text-[11px]"
                      >
                        {fr.restaurantName} ({fr.visitsTogetherCount})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    )}

      {/* Add / Edit Friend Modal */}
      <Modal
        isOpen={isAddModalOpen || Boolean(editingFriend)}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingFriend(null);
        }}
        title={editingFriend ? 'Edit Friend Details' : 'Add Friend to Circle'}
        description="Save your dining buddy's name so you can tag them in restaurant visits."
        maxWidth="sm"
      >
        <div className="space-y-4">
          <Input
            label="Full Name *"
            placeholder="e.g. Priya Venkatesh"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Nickname / Moniker"
            placeholder="e.g. Pree"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingFriend(null);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              isLoading={isSubmitting}
              disabled={!name.trim()}
            >
              {editingFriend ? 'Update Friend' : 'Save Friend'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(friendToDelete)}
        onClose={() => setFriendToDelete(null)}
        onConfirm={handleDelete}
        title="Remove Friend"
        description="Are you sure you want to remove this friend? Their historical attendance records will be detached."
        confirmLabel="Remove Friend"
      />
    </div>
  );
};
