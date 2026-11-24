import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ChevronLeft,
  Image as ImageIcon,
  Check,
  Sparkles,
  Heart,
  MapPin,
} from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import {
  GooglePlacesAutocomplete,
} from '@/components/common/GooglePlacesAutocomplete';
import type { PlaceSelection } from '@/lib/googleMaps';

const restaurantSchema = z.object({
  name: z.string().min(2, 'Restaurant name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(3, 'Location is required (e.g., Indiranagar, Bangalore)'),
  address: z.string().min(5, 'Full street address is required'),
  cuisineTypes: z.string().min(2, 'Enter at least one cuisine (comma separated)'),
  coverImage: z.string().url('Must be a valid image URL').or(z.literal('')),
  favourite: z.boolean(),
});

type RestaurantFormData = z.infer<typeof restaurantSchema>;

const PRESET_IMAGES = [
  {
    label: 'Artisanal Pizzeria',
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Asian / Zen Bistro',
    url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Vibrant Bar & Kitchen',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Courtyard & European Cafe',
    url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Craft Dining & Cocktails',
    url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Coastal Seafood Tavern',
    url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=80',
  },
];

const COMMON_CUISINES = [
  'Italian',
  'Asian',
  'Burmese',
  'Modern Indian',
  'Coastal Seafood',
  'Goan',
  'Mediterranean',
  'Artisanal Pizza',
  'Bakery & Cafe',
  'Desserts',
  'Cocktails',
];

export const AddEditRestaurantPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { restaurantService } = useServices();

  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: '',
      description: '',
      location: '',
      address: '',
      cuisineTypes: '',
      coverImage: PRESET_IMAGES[0].url,
      favourite: false,
    },
  });

  const watchedCoverImage = watch('coverImage');
  const watchedCuisines = watch('cuisineTypes') || '';
  const watchedFavourite = watch('favourite');

  useEffect(() => {
    if (isEditMode && id) {
      setInitialLoading(true);
      restaurantService
        .getByIdWithStats(id)
        .then((rest) => {
          if (rest) {
            setValue('name', rest.name);
            setValue('description', rest.description);
            setValue('location', rest.location);
            setValue('address', rest.address);
            setValue('cuisineTypes', rest.cuisineTypes.join(', '));
            setValue('coverImage', rest.coverImage);
            setValue('favourite', rest.favourite);
          } else {
            setServerError('Restaurant not found');
          }
        })
        .catch((err) => {
          console.error(err);
          setServerError('Failed to fetch restaurant');
        })
        .finally(() => setInitialLoading(false));
    }
  }, [id, isEditMode, restaurantService, setValue]);

  const toggleCuisineTag = (tag: string) => {
    const list = watchedCuisines
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const exists = list.some((c) => c.toLowerCase() === tag.toLowerCase());
    let nextList: string[];
    if (exists) {
      nextList = list.filter((c) => c.toLowerCase() !== tag.toLowerCase());
    } else {
      nextList = [...list, tag];
    }
    setValue('cuisineTypes', nextList.join(', '));
  };

  const handleGooglePlaceSelected = (place: PlaceSelection) => {
    setValue('name', place.name, { shouldValidate: true });
    setValue('address', place.address, { shouldValidate: true });
    setValue('location', place.location, { shouldValidate: true });
    if (place.cuisineTypes && place.cuisineTypes.length > 0) {
      setValue('cuisineTypes', place.cuisineTypes.join(', '), { shouldValidate: true });
    }
    if (place.coverImage) {
      setValue('coverImage', place.coverImage, { shouldValidate: true });
    }
    const currentDesc = watch('description') || '';
    if (currentDesc.length < 10) {
      const ratingText = place.googleRating ? ` (Google rated ${place.googleRating}★)` : '';
      setValue(
        'description',
        `${place.name} is a ${place.cuisineTypes.join(' & ')} spot located in ${place.location}${ratingText}.`,
        { shouldValidate: true }
      );
    }
  };

  const onSubmit = async (data: RestaurantFormData) => {
    try {
      setIsLoading(true);
      setServerError(null);

      const parsedCuisines = data.cuisineTypes
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c.length > 0);

      const payload = {
        name: data.name.trim(),
        description: data.description.trim(),
        location: data.location.trim(),
        address: data.address.trim(),
        cuisineTypes: parsedCuisines,
        coverImage: data.coverImage || PRESET_IMAGES[0].url,
        favourite: data.favourite,
      };

      if (isEditMode && id) {
        await restaurantService.update(id, payload);
        navigate(`/restaurants/${id}`);
      } else {
        const created = await restaurantService.create(payload);
        navigate(`/restaurants/${created.id}`);
      }
    } catch (err) {
      console.error(err);
      setServerError('An error occurred while saving the restaurant.');
    } finally {
      setIsLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="p-12 text-center text-muted-foreground animate-pulse">
        Loading restaurant details...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
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
          {isEditMode ? 'Edit Restaurant Profile' : 'Add New Restaurant'}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isEditMode
            ? 'Update restaurant information, address, and culinary details'
            : 'Register a new place to log future dining experiences with friends'}
        </p>
      </div>

      {serverError && (
        <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {!isEditMode && (
          <div className="p-4 rounded-2xl border border-primary/30 bg-primary/5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
                Quick Auto-Fill with Google Maps
              </span>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                <MapPin className="h-3 w-3 text-primary" />
                Search & Auto-fill
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Search any restaurant or cafe to automatically populate its verified name, address, location, and photo:
            </p>
            <GooglePlacesAutocomplete onSelectPlace={handleGooglePlaceSelected} />
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Restaurant Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Input
              label="Restaurant Name *"
              placeholder="e.g. Bombay Canteen, Burma Burma"
              error={errors.name?.message}
              {...register('name')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Neighborhood / City *"
                placeholder="e.g. Indiranagar, Bangalore"
                error={errors.location?.message}
                {...register('location')}
              />

              <div className="space-y-1.5">
                <Input
                  label="Cuisine Types (Comma separated) *"
                  placeholder="e.g. Italian, Artisanal Pizza"
                  error={errors.cuisineTypes?.message}
                  {...register('cuisineTypes')}
                />
              </div>
            </div>

            {/* Quick Cuisine Pill Picker */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Quick Add Cuisines:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_CUISINES.map((cuisine) => {
                  const isSelected = watchedCuisines
                    .split(',')
                    .map((c) => c.trim().toLowerCase())
                    .includes(cuisine.toLowerCase());
                  return (
                    <button
                      key={cuisine}
                      type="button"
                      onClick={() => toggleCuisineTag(cuisine)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                          : 'bg-secondary text-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {cuisine}
                    </button>
                  );
                })}
              </div>
            </div>

            <Textarea
              label="Description & Culinary Style *"
              placeholder="Tell what makes this spot special, signature dishes, vibe, or memories..."
              rows={3}
              error={errors.description?.message}
              {...register('description')}
            />

            <Input
              label="Full Street Address *"
              placeholder="e.g. 42 Main Boulevard, Downtown"
              error={errors.address?.message}
              {...register('address')}
            />

            {/* Cover Image & Presets */}
            <div className="space-y-3 pt-2">
              <Input
                label="Cover Image URL"
                placeholder="https://images.unsplash.com/photo-..."
                hint="Provide a high-quality photo URL or choose a preset below"
                error={errors.coverImage?.message}
                {...register('coverImage')}
              />

              {/* Presets Grid */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  Or Choose a Curated Photo Preset:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PRESET_IMAGES.map((preset) => {
                    const isSelected = watchedCoverImage === preset.url;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setValue('coverImage', preset.url)}
                        className={`relative rounded-xl overflow-hidden border p-1 text-left transition-all ${
                          isSelected
                            ? 'border-primary ring-2 ring-primary/30'
                            : 'border-border/60 hover:border-border'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="h-16 w-full object-cover rounded-lg"
                        />
                        <span className="block text-[10px] font-medium text-foreground truncate mt-1 px-0.5">
                          {preset.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cover Image Preview */}
              {watchedCoverImage && (
                <div className="mt-2 relative aspect-[21/9] rounded-xl overflow-hidden border border-border bg-secondary">
                  <img
                    src={watchedCoverImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PRESET_IMAGES[0].url;
                    }}
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs flex items-center gap-1">
                    <ImageIcon className="h-3 w-3" />
                    Cover Preview
                  </span>
                </div>
              )}
            </div>

            {/* Favourite toggle */}
            <div className="pt-3 border-t border-border/40">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  id="favourite"
                  className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  {...register('favourite')}
                />
                <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Heart
                    className={`h-4 w-4 ${
                      watchedFavourite ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground'
                    }`}
                  />
                  Mark as a personal favourite restaurant
                </span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button type="submit" isLoading={isLoading} className="font-semibold shadow-sm">
            <Check className="h-4 w-4 mr-1.5" />
            {isEditMode ? 'Update Restaurant' : 'Save Restaurant'}
          </Button>
        </div>
      </form>
    </div>
  );
};
