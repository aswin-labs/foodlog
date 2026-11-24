import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ChevronLeft,
  Plus,
  Trash2,
  Users,
  UtensilsCrossed,
  Sparkles,
  Camera,
  Check,
  UserPlus,
  ThumbsUp,
  FileText,
  PlusCircle,
  Upload,
  Loader2,
} from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { SupabaseStorageService } from '@/datasources/supabase/SupabaseStorageService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { RatingStars } from '@/components/common/RatingStars';
import { Modal } from '@/components/ui/Modal';
import { GooglePlacesAutocomplete } from '@/components/common/GooglePlacesAutocomplete';
import type { PlaceSelection } from '@/lib/googleMaps';
import { formatCurrency } from '@/lib/utils';
import { usePreferencesStore } from '@/stores/usePreferencesStore';
import type { Restaurant } from '@/types/restaurant';
import type { Friend } from '@/types/friend';

const visitDishSchema = z.object({
  dishName: z.string().min(2, 'Dish name required'),
  category: z.string().min(1, 'Category required'),
  price: z.number().min(0, 'Price must be positive'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  rating: z.number().min(1).max(5),
  notes: z.string().optional(),
  wouldOrderAgain: z.boolean(),
  photoUrl: z.string().optional(),
});

const attachmentSchema = z.object({
  type: z.enum(['menu', 'food']),
  fileName: z.string().min(1, 'File name required'),
  storagePath: z.string().min(1, 'Path or URL required'),
});

const visitFormSchema = z.object({
  restaurantId: z.string().min(1, 'Please select a restaurant'),
  visitedAt: z.string().min(1, 'Visit date is required'),
  numberOfPeople: z.number().min(1, 'At least 1 person'),
  totalBill: z.number().min(0, 'Total bill must be positive'),
  overallRating: z.number().min(1).max(5),
  foodQualityRating: z.number().min(1).max(5),
  valueForMoneyRating: z.number().min(1).max(5),
  serviceRating: z.number().min(1).max(5),
  ambienceRating: z.number().min(1).max(5),
  notes: z.string().optional(),
  dishes: z.array(visitDishSchema).min(1, 'Add at least one dish'),
  friendIds: z.array(z.string()),
  attachments: z.array(attachmentSchema),
});

type VisitFormData = z.infer<typeof visitFormSchema>;

export const AddVisitPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [searchParams] = useSearchParams();
  const preselectedRestaurantId = searchParams.get('restaurantId') || '';
  const navigate = useNavigate();
  const { currency } = usePreferencesStore();
  const { restaurantService, visitService, friendService, dataSources } = useServices();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick Inline Restaurant creation modal
  const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState(false);
  const [newRestName, setNewRestName] = useState('');
  const [newRestLocation, setNewRestLocation] = useState('');
  const [newRestCuisine, setNewRestCuisine] = useState('');
  const [newRestDescription, setNewRestDescription] = useState('');
  const [isCreatingRest, setIsCreatingRest] = useState(false);

  // Quick Friend modal
  const [isFriendModalOpen, setIsFriendModalOpen] = useState(false);
  const [newFriendName, setNewFriendName] = useState('');
  const [newFriendNickname, setNewFriendNickname] = useState('');

  // Attachment inputs
  const [newAttUrl, setNewAttUrl] = useState('');
  const [newAttType, setNewAttType] = useState<'food' | 'menu'>('food');
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<VisitFormData>({
    resolver: zodResolver(visitFormSchema),
    defaultValues: {
      restaurantId: preselectedRestaurantId,
      visitedAt: new Date().toISOString().split('T')[0],
      numberOfPeople: 1,
      totalBill: 0,
      overallRating: 5,
      foodQualityRating: 5,
      valueForMoneyRating: 4,
      serviceRating: 5,
      ambienceRating: 5,
      notes: '',
      friendIds: [],
      dishes: [
        {
          dishName: '',
          category: 'Main Course',
          price: 0,
          quantity: 1,
          rating: 5,
          notes: '',
          wouldOrderAgain: true,
          photoUrl: '',
        },
      ],
      attachments: [],
    },
  });

  const { fields: dishFields, append: appendDish, remove: removeDish } = useFieldArray({
    control,
    name: 'dishes',
  });

  const watchedDishes = watch('dishes') || [];
  const watchedFriendIds = watch('friendIds') || [];
  const watchedAttachments = watch('attachments') || [];

  const watchedOverallRating = watch('overallRating');
  const watchedFoodQuality = watch('foodQualityRating');
  const watchedValueForMoney = watch('valueForMoneyRating');
  const watchedService = watch('serviceRating');
  const watchedAmbience = watch('ambienceRating');

  // Calculate live food total
  const calculatedFoodTotal = watchedDishes.reduce((acc, d) => {
    const p = Number(d.price) || 0;
    const q = Number(d.quantity) || 0;
    return acc + p * q;
  }, 0);

  // Load available restaurants and friends
  useEffect(() => {
    async function loadData() {
      try {
        const [rList, fList] = await Promise.all([
          restaurantService.getAllWithStats(),
          friendService.getAllWithStats(),
        ]);
        setRestaurants(rList);
        setFriends(fList);

        if (!isEditMode && preselectedRestaurantId) {
          setValue('restaurantId', preselectedRestaurantId);
        }
      } catch (err) {
        console.error('Failed to load initial form data', err);
      }
    }
    loadData();
  }, [preselectedRestaurantId, isEditMode, restaurantService, friendService, setValue]);

  // Load existing visit data if in Edit Mode
  useEffect(() => {
    if (isEditMode && id) {
      setInitialLoading(true);
      visitService
        .getById(id)
        .then((existing) => {
          if (existing) {
            reset({
              restaurantId: existing.restaurantId,
              visitedAt: existing.visitedAt.split('T')[0],
              numberOfPeople: existing.numberOfPeople,
              totalBill: existing.totalBill,
              overallRating: existing.overallRating,
              foodQualityRating: existing.foodQualityRating,
              valueForMoneyRating: existing.valueForMoneyRating,
              serviceRating: existing.serviceRating,
              ambienceRating: existing.ambienceRating,
              notes: existing.notes || '',
              friendIds: existing.friends.map((f) => f.id),
              dishes: existing.dishes.map((vd) => ({
                dishName: vd.dish.name,
                category: vd.dish.category,
                price: vd.price,
                quantity: vd.quantity,
                rating: vd.rating,
                notes: vd.notes || '',
                wouldOrderAgain: vd.wouldOrderAgain,
                photoUrl: vd.photoAttachments?.[0] || '',
              })),
              attachments: existing.attachments.map((att) => ({
                type: att.type,
                fileName: att.fileName,
                storagePath: att.storagePath,
              })),
            });
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setInitialLoading(false);
        });
    }
  }, [id, isEditMode, visitService, reset]);

  const toggleFriend = (friendId: string) => {
    const current = new Set(watchedFriendIds);
    if (current.has(friendId)) {
      current.delete(friendId);
    } else {
      current.add(friendId);
    }
    setValue('friendIds', Array.from(current));
  };

  const handleCreateFriend = async () => {
    if (!newFriendName.trim()) return;
    try {
      const created = await friendService.create({
        name: newFriendName.trim(),
        nickname: newFriendNickname.trim() || undefined,
      });
      setFriends((prev) => [...prev, created as any]);
      setValue('friendIds', [...watchedFriendIds, created.id]);
      setNewFriendName('');
      setNewFriendNickname('');
      setIsFriendModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateRestaurant = async () => {
    if (!newRestName.trim() || !newRestLocation.trim()) return;
    try {
      setIsCreatingRest(true);
      const parsedCuisines = newRestCuisine
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c.length > 0);

      const created = await restaurantService.create({
        name: newRestName.trim(),
        location: newRestLocation.trim(),
        address: newRestLocation.trim(),
        description: newRestDescription.trim() || `Authentic ${newRestCuisine || 'dining'} establishment.`,
        cuisineTypes: parsedCuisines.length > 0 ? parsedCuisines : ['Contemporary'],
        coverImage:
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
        favourite: false,
      });

      setRestaurants((prev) => [created as any, ...prev]);
      setValue('restaurantId', created.id);
      setIsRestaurantModalOpen(false);
      setNewRestName('');
      setNewRestLocation('');
      setNewRestCuisine('');
      setNewRestDescription('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingRest(false);
    }
  };

  const handleGooglePlaceAutoCreate = async (place: PlaceSelection) => {
    try {
      setIsCreatingRest(true);
      const ratingText = place.googleRating ? ` (Google rated ${place.googleRating}★)` : '';
      const created = await restaurantService.create({
        name: place.name,
        location: place.location,
        address: place.address || place.location,
        description: `${place.name} is a ${place.cuisineTypes.join(' & ')} spot in ${place.location}${ratingText}.`,
        cuisineTypes: place.cuisineTypes.length > 0 ? place.cuisineTypes : ['Casual Dining'],
        coverImage:
          place.coverImage ||
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
        favourite: false,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setRestaurants((prev) => [created as any, ...prev]);
      setValue('restaurantId', created.id, { shouldValidate: true });
      setIsRestaurantModalOpen(false);
    } catch (err) {
      console.error('Failed to auto-create restaurant from Google Place:', err);
    } finally {
      setIsCreatingRest(false);
    }
  };

  const handleAddAttachment = () => {
    if (!newAttUrl.trim()) return;
    const item = {
      type: newAttType,
      fileName: newAttType === 'menu' ? 'Menu Card' : 'Food Photograph',
      storagePath: newAttUrl.trim(),
    };
    setValue('attachments', [...watchedAttachments, item]);
    setNewAttUrl('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingMedia(true);
      setUploadError(null);

      if (dataSources.mode === 'supabase') {
        const result = await SupabaseStorageService.uploadMedia(file, newAttType);
        setValue('attachments', [
          ...watchedAttachments,
          {
            type: newAttType,
            fileName: result.fileName,
            storagePath: result.publicUrl,
          },
        ]);
      } else {
        // Mock mode: local preview via FileReader
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          if (dataUrl) {
            setValue('attachments', [
              ...watchedAttachments,
              {
                type: newAttType,
                fileName: file.name,
                storagePath: dataUrl,
              },
            ]);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error('File upload failed:', err);
      setUploadError(err instanceof Error ? err.message : 'Media upload failed');
    } finally {
      setIsUploadingMedia(false);
      e.target.value = '';
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setValue(
      'attachments',
      watchedAttachments.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (data: VisitFormData) => {
    try {
      setIsSubmitting(true);

      const payload = {
        visit: {
          restaurantId: data.restaurantId,
          visitedAt: new Date(data.visitedAt).toISOString(),
          numberOfPeople: Number(data.numberOfPeople),
          totalBill: Number(data.totalBill),
          overallRating: data.overallRating,
          foodQualityRating: data.foodQualityRating,
          valueForMoneyRating: data.valueForMoneyRating,
          serviceRating: data.serviceRating,
          ambienceRating: data.ambienceRating,
          notes: data.notes || '',
        },
        dishes: data.dishes.map((d) => ({
          dishName: d.dishName.trim(),
          category: d.category,
          price: Number(d.price),
          quantity: Number(d.quantity),
          rating: Number(d.rating),
          notes: d.notes,
          wouldOrderAgain: d.wouldOrderAgain,
          photoAttachments: d.photoUrl ? [d.photoUrl] : [],
        })),
        friendIds: data.friendIds,
        attachments: data.attachments.map((a) => ({
          type: a.type,
          fileName: a.fileName,
          storagePath: a.storagePath,
        })),
      };

      if (isEditMode && id) {
        const updated = await visitService.updateWithDetails(id, payload);
        navigate(`/visits/${updated.id}`);
      } else {
        const created = await visitService.create(payload);
        navigate(`/visits/${created.id}`);
      }
    } catch (err) {
      console.error('Failed to save visit', err);
      alert('Error saving visit. Please check the form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="p-12 text-center text-muted-foreground animate-pulse">
        Loading visit details...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Back</span>
      </button>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-serif">
          {isEditMode ? 'Edit Dining Visit' : 'Log a New Dining Experience'}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isEditMode
            ? 'Update your records, ratings, dish prices, or memories for this visit'
            : 'Record where you went, what you ordered, true prices, and how it was.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Restaurant & Date */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5 text-primary" />
              <span>Section 1: Restaurant & Date</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quick Google Maps Instant Add */}
            <div className="p-3.5 rounded-xl border border-primary/25 bg-primary/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Quick Find on Google Maps
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Select to add & choose in 1 click
                </span>
              </div>
              <GooglePlacesAutocomplete
                onSelectPlace={handleGooglePlaceAutoCreate}
                placeholder="Search restaurant on Google Maps to select or add instantly..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Select Restaurant *
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsRestaurantModalOpen(true)}
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Add New Restaurant</span>
                  </button>
                </div>
                <select
                  {...register('restaurantId')}
                  className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">-- Choose a restaurant --</option>
                  {restaurants.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.location})
                    </option>
                  ))}
                </select>
                {errors.restaurantId && (
                  <p className="text-xs text-destructive font-medium">
                    {errors.restaurantId.message}
                  </p>
                )}
              </div>

              <Input
                label="Visit Date *"
                type="date"
                error={errors.visitedAt?.message}
                {...register('visitedAt')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: People & Friends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Section 2: People & Company</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-w-xs">
              <Input
                label="Total Number of People *"
                type="number"
                min={1}
                max={50}
                error={errors.numberOfPeople?.message}
                {...register('numberOfPeople', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Friends Who Attended
                </label>
                <button
                  type="button"
                  onClick={() => setIsFriendModalOpen(true)}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Add Friend</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {friends.map((f) => {
                  const isSelected = watchedFriendIds.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => toggleFriend(f.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                          : 'bg-card text-foreground border-border hover:bg-secondary/60'
                      }`}
                    >
                      {f.name} {f.nickname ? `(${f.nickname})` : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Ordered Food (Dynamic Dishes) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <span>Section 3: Ordered Food ({dishFields.length})</span>
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add each dish ordered, individual prices, ratings, and reorder recommendation
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendDish({
                  dishName: '',
                  category: 'Main Course',
                  price: 0,
                  quantity: 1,
                  rating: 5,
                  notes: '',
                  wouldOrderAgain: true,
                  photoUrl: '',
                })
              }
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Another Dish
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            {dishFields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 rounded-xl border border-border/80 bg-card/60 space-y-3 relative group shadow-2xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Dish #{index + 1}
                  </span>

                  {dishFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDish(index)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    label="Dish Name *"
                    placeholder="e.g. Truffle Burrata, Pepperoni Pizza"
                    error={errors.dishes?.[index]?.dishName?.message}
                    {...register(`dishes.${index}.dishName`)}
                  />

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Category
                    </label>
                    <select
                      {...register(`dishes.${index}.category`)}
                      className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="Appetizer">Appetizer / Starter</option>
                      <option value="Main Course">Main Course</option>
                      <option value="Dessert">Dessert</option>
                      <option value="Beverage">Beverage / Cocktail</option>
                      <option value="Salad">Salad</option>
                      <option value="Snack">Snack</option>
                      <option value="Breads">Breads</option>
                      <option value="Special">Chef Special</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="Price *"
                      type="number"
                      min={0}
                      error={errors.dishes?.[index]?.price?.message}
                      {...register(`dishes.${index}.price`, { valueAsNumber: true })}
                    />
                    <Input
                      label="Qty *"
                      type="number"
                      min={1}
                      error={errors.dishes?.[index]?.quantity?.message}
                      {...register(`dishes.${index}.quantity`, { valueAsNumber: true })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Individual Rating
                    </label>
                    <RatingStars
                      rating={watch(`dishes.${index}.rating`)}
                      interactive
                      onChange={(r) => setValue(`dishes.${index}.rating`, r)}
                      size="md"
                      showValue
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Input
                      label="Dish Notes / Taste profile"
                      placeholder="e.g. Crisp crust, slightly mild salt..."
                      {...register(`dishes.${index}.notes`)}
                    />
                  </div>
                </div>

                {/* Reorder toggle & photo url */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs border-t border-border/30">
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                      {...register(`dishes.${index}.wouldOrderAgain`)}
                    />
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      Would definitely order this again
                    </span>
                  </label>

                  <div className="flex-1 max-w-xs">
                    <Input
                      placeholder="Optional food photo URL"
                      {...register(`dishes.${index}.photoUrl`)}
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Subtotal food calculation banner */}
            <div className="p-3.5 rounded-xl bg-secondary/60 flex items-center justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground font-medium">Calculated Food Subtotal:</span>
              <span className="font-bold text-foreground font-mono text-base">
                {formatCurrency(calculatedFoodTotal, currency)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Visit Review & Ratings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>Section 4: Experience Review & Ratings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-3 rounded-xl border border-border bg-card space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Overall Experience *
                </span>
                <RatingStars
                  rating={watchedOverallRating}
                  interactive
                  onChange={(r) => setValue('overallRating', r)}
                  size="md"
                  showValue
                />
              </div>

              <div className="p-3 rounded-xl border border-border bg-card space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Food Quality
                </span>
                <RatingStars
                  rating={watchedFoodQuality}
                  interactive
                  onChange={(r) => setValue('foodQualityRating', r)}
                  size="md"
                  showValue
                />
              </div>

              <div className="p-3 rounded-xl border border-border bg-card space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Value for Money
                </span>
                <RatingStars
                  rating={watchedValueForMoney}
                  interactive
                  onChange={(r) => setValue('valueForMoneyRating', r)}
                  size="md"
                  showValue
                />
              </div>

              <div className="p-3 rounded-xl border border-border bg-card space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Hospitality & Service
                </span>
                <RatingStars
                  rating={watchedService}
                  interactive
                  onChange={(r) => setValue('serviceRating', r)}
                  size="md"
                  showValue
                />
              </div>

              <div className="p-3 rounded-xl border border-border bg-card space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Ambience & Vibe
                </span>
                <RatingStars
                  rating={watchedAmbience}
                  interactive
                  onChange={(r) => setValue('ambienceRating', r)}
                  size="md"
                  showValue
                />
              </div>

              <div className="p-3 rounded-xl border border-border bg-card space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Final Actual Bill *
                </span>
                <div className="relative">
                  <Input
                    type="number"
                    min={0}
                    placeholder="Enter total bill"
                    error={errors.totalBill?.message}
                    {...register('totalBill', { valueAsNumber: true })}
                  />
                </div>
              </div>
            </div>

            <Textarea
              label="Visit Notes & Memories"
              placeholder="What stood out? Would you come back? Was the service fast or slow?"
              rows={3}
              {...register('notes')}
            />
          </CardContent>
        </Card>

        {/* Section 5: Attachments (Menu & Food) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              <span>Section 5: Photographs & Menu Cards</span>
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Attach food photos or menu cards via direct upload or image URL (optional)
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={newAttType}
                onChange={(e) => setNewAttType(e.target.value as 'food' | 'menu')}
                className="h-10 px-3 rounded-lg border border-input bg-card text-xs font-medium text-foreground focus:outline-none"
              >
                <option value="food">Food Photograph</option>
                <option value="menu">Menu Card</option>
              </select>

              <input
                type="url"
                value={newAttUrl}
                onChange={(e) => setNewAttUrl(e.target.value)}
                placeholder="Paste photo URL (https://...)"
                className="flex-1 h-10 px-3 rounded-lg border border-input bg-card text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
              />

              <Button type="button" variant="secondary" size="md" onClick={handleAddAttachment}>
                Add URL
              </Button>

              <div className="relative">
                <input
                  type="file"
                  id="media-file-input"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploadingMedia}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => document.getElementById('media-file-input')?.click()}
                  disabled={isUploadingMedia}
                  className="w-full sm:w-auto"
                >
                  {isUploadingMedia ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-1.5" />
                      Upload File
                    </>
                  )}
                </Button>
              </div>
            </div>

            {uploadError && (
              <p className="text-xs text-destructive bg-destructive/10 p-2 rounded-lg">{uploadError}</p>
            )}

            {/* Attachments preview list */}
            {watchedAttachments.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {watchedAttachments.map((att, index) => (
                  <div
                    key={index}
                    className="relative group aspect-square rounded-xl overflow-hidden border border-border bg-secondary"
                  >
                    <img
                      src={att.storagePath}
                      alt={att.fileName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(index)}
                        className="p-1.5 rounded-full bg-destructive text-white hover:scale-110 transition-transform"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-white">
                      {att.type === 'menu' ? 'Menu' : 'Food'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button type="submit" isLoading={isSubmitting} size="lg" className="font-semibold shadow-md">
            <Check className="h-5 w-5 mr-2" />
            {isEditMode ? 'Update Visit Record' : 'Complete & Save Visit'}
          </Button>
        </div>
      </form>

      {/* Quick Add Restaurant Modal (During Visit Creation) */}
      <Modal
        isOpen={isRestaurantModalOpen}
        onClose={() => setIsRestaurantModalOpen(false)}
        title="Add New Restaurant"
        description="Quickly register a new dining place to log your visit right now."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl border border-primary/25 bg-primary/5 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Auto-Fill via Google Maps
            </span>
            <GooglePlacesAutocomplete
              onSelectPlace={(place) => {
                setNewRestName(place.name);
                setNewRestLocation(place.location);
                setNewRestCuisine(place.cuisineTypes.join(', '));
                setNewRestDescription(
                  `${place.name} is a ${place.cuisineTypes.join(' & ')} spot in ${place.location}.`
                );
              }}
              placeholder="Search restaurant on Google Maps to auto-fill..."
            />
          </div>

          <Input
            label="Restaurant Name *"
            placeholder="e.g. Blue Tokai Roasters"
            value={newRestName}
            onChange={(e) => setNewRestName(e.target.value)}
          />

          <Input
            label="Location / Area *"
            placeholder="e.g. Koramangala 4th Block, Bangalore"
            value={newRestLocation}
            onChange={(e) => setNewRestLocation(e.target.value)}
          />

          <Input
            label="Cuisines (Comma separated)"
            placeholder="e.g. Cafe, Specialty Coffee, Bakery"
            value={newRestCuisine}
            onChange={(e) => setNewRestCuisine(e.target.value)}
          />

          <Textarea
            label="Brief Description"
            placeholder="Quick notes on the vibe or location..."
            value={newRestDescription}
            onChange={(e) => setNewRestDescription(e.target.value)}
            rows={2}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRestaurantModalOpen(false)}
              disabled={isCreatingRest}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCreateRestaurant}
              isLoading={isCreatingRest}
              disabled={!newRestName.trim() || !newRestLocation.trim()}
            >
              <Check className="h-4 w-4 mr-1.5" />
              Add & Select Restaurant
            </Button>
          </div>
        </div>
      </Modal>

      {/* Quick Add Friend Modal */}
      <Modal
        isOpen={isFriendModalOpen}
        onClose={() => setIsFriendModalOpen(false)}
        title="Add Friend to Circle"
        description="Add a friend's name to tag them in restaurant visits"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Rahul Sharma"
            value={newFriendName}
            onChange={(e) => setNewFriendName(e.target.value)}
          />
          <Input
            label="Nickname / Moniker"
            placeholder="e.g. Ro"
            value={newFriendNickname}
            onChange={(e) => setNewFriendNickname(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsFriendModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateFriend} disabled={!newFriendName.trim()}>
              Save Friend
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
