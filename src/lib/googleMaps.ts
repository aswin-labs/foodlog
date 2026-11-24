/**
 * Google Maps JavaScript API & Places Autocomplete Loader
 */

export interface GooglePlaceResultRaw {
  name?: string;
  formatted_address?: string;
  address_components?: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  photos?: Array<{
    getUrl: (options: { maxWidth?: number; maxHeight?: number }) => string;
  }>;
  geometry?: {
    location?: {
      lat: () => number;
      lng: () => number;
    };
  };
  types?: string[];
  url?: string;
  rating?: number;
  place_id?: string;
}

export interface PlaceSelection {
  name: string;
  address: string;
  location: string;
  cuisineTypes: string[];
  coverImage?: string;
  latitude?: number;
  longitude?: number;
  googlePlaceId?: string;
  googleMapsUrl?: string;
  googleRating?: number;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google?: any;
  }
}

let mapsPromise: Promise<boolean> | null = null;

export function isGoogleMapsConfigured(): boolean {
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  return Boolean(
    key &&
      key.trim().length > 15 &&
      !key.includes('your_google_maps_api_key')
  );
}

export function loadGoogleMaps(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.google?.maps?.places) return Promise.resolve(true);
  if (mapsPromise) return mapsPromise;

  const key = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined)?.trim();
  if (!key || key.includes('your_google_maps_api_key')) {
    return Promise.resolve(false);
  }

  mapsPromise = new Promise((resolve) => {
    // If script is already in document, wait for it
    if (document.getElementById('google-maps-api-script')) {
      const interval = setInterval(() => {
        if (window.google?.maps?.places) {
          clearInterval(interval);
          resolve(true);
        }
      }, 100);
      return;
    }

    const callbackName = '__initGoogleMaps_' + Math.random().toString(36).substring(2, 9);
    (window as unknown as Record<string, () => void>)[callbackName] = () => {
      delete (window as unknown as Record<string, unknown>)[callbackName];
      resolve(true);
    };

    const script = document.createElement('script');
    script.id = 'google-maps-api-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      key
    )}&libraries=places&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    script.onerror = (e) => {
      console.error('Failed to load Google Maps SDK:', e);
      delete (window as unknown as Record<string, unknown>)[callbackName];
      resolve(false);
    };

    document.head.appendChild(script);
  });

  return mapsPromise;
}

/**
 * Extracts structured, friendly restaurant details from a Google PlaceResult
 */
export function extractPlaceDetails(place: GooglePlaceResultRaw): PlaceSelection {
  const name = place.name || '';
  const address = place.formatted_address || '';

  let neighborhood = '';
  let city = '';
  let state = '';
  let country = '';

  if (place.address_components) {
    for (const comp of place.address_components) {
      if (
        comp.types.includes('sublocality') ||
        comp.types.includes('sublocality_level_1') ||
        comp.types.includes('neighborhood')
      ) {
        neighborhood = comp.long_name;
      }
      if (comp.types.includes('locality')) {
        city = comp.long_name;
      }
      if (comp.types.includes('administrative_area_level_1')) {
        state = comp.short_name || comp.long_name;
      }
      if (comp.types.includes('country')) {
        country = comp.long_name;
      }
    }
  }

  let location = '';
  if (neighborhood && city) {
    location = `${neighborhood}, ${city}`;
  } else if (city && state) {
    location = `${city}, ${state}`;
  } else if (city) {
    location = `${city}, ${country}`;
  } else if (address) {
    const parts = address.split(',').map((p: string) => p.trim());
    location = parts.slice(-3, -1).join(', ') || parts[0];
  } else {
    location = 'Local';
  }

  // Derive human-readable cuisine tags from place types
  const cuisineMap: Record<string, string> = {
    bakery: 'Bakery',
    bar: 'Bar & Drinks',
    cafe: 'Cafe',
    meal_delivery: 'Takeaway',
    meal_takeaway: 'Takeaway',
    restaurant: 'Restaurant',
  };

  const cuisines: string[] = [];
  if (place.types) {
    for (const type of place.types) {
      if (cuisineMap[type]) {
        cuisines.push(cuisineMap[type]);
      } else if (type.endsWith('_restaurant')) {
        const clean = type.replace('_restaurant', '');
        cuisines.push(clean.charAt(0).toUpperCase() + clean.slice(1));
      }
    }
  }
  if (cuisines.length === 0) {
    cuisines.push('Casual Dining');
  }

  // High-resolution photo from Google Places API
  let coverImage: string | undefined;
  if (place.photos && place.photos.length > 0) {
    try {
      coverImage = place.photos[0].getUrl({ maxWidth: 1200, maxHeight: 800 });
    } catch {
      // Photo url fallback
    }
  }

  return {
    name,
    address,
    location,
    cuisineTypes: Array.from(new Set(cuisines)).slice(0, 3),
    coverImage,
    latitude: place.geometry?.location?.lat ? place.geometry.location.lat() : undefined,
    longitude: place.geometry?.location?.lng ? place.geometry.location.lng() : undefined,
    googlePlaceId: place.place_id,
    googleMapsUrl: place.url,
    googleRating: place.rating,
  };
}
