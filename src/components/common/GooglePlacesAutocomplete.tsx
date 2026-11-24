import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Search, Loader2, Sparkles, X } from 'lucide-react';
import {
  isGoogleMapsConfigured,
  loadGoogleMaps,
  extractPlaceDetails,
  type PlaceSelection,
} from '@/lib/googleMaps';

export interface GooglePlacesAutocompleteProps {
  onSelectPlace: (place: PlaceSelection) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
  onSelectPlace,
  placeholder = 'Search restaurant or cafe on Google Maps...',
  className = '',
  autoFocus = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<unknown>(null);
  const [isLoadingSdk, setIsLoadingSdk] = useState(false);
  const [isSdkReady, setIsSdkReady] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedPlaceName, setSelectedPlaceName] = useState<string | null>(null);

  const isConfigured = isGoogleMapsConfigured();

  useEffect(() => {
    if (!isConfigured) return;

    let isMounted = true;
    setIsLoadingSdk(true);

    loadGoogleMaps()
      .then((ready) => {
        if (!isMounted) return;
        setIsSdkReady(ready);
        setIsLoadingSdk(false);

        if (ready && inputRef.current && window.google?.maps?.places) {
          const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
            types: ['establishment'],
            fields: [
              'name',
              'formatted_address',
              'address_components',
              'photos',
              'geometry',
              'types',
              'url',
              'rating',
              'place_id',
            ],
          });

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place || !place.name) return;

            const extracted = extractPlaceDetails(place);
            setSelectedPlaceName(extracted.name);
            setQuery(extracted.name);
            onSelectPlace(extracted);
          });

          autocompleteRef.current = autocomplete;
        }
      })
      .catch((err) => {
        console.error('Error initializing Google Places Autocomplete:', err);
        if (isMounted) setIsLoadingSdk(false);
      });

    return () => {
      isMounted = false;
      if (autocompleteRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isConfigured, onSelectPlace]);

  // Prevent parent form submission on Enter when selecting an autocomplete item
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleClear = () => {
    setQuery('');
    setSelectedPlaceName(null);
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  };

  if (!isConfigured) {
    return null;
  }

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="relative flex items-center">
        <div className="absolute left-3 text-muted-foreground pointer-events-none flex items-center">
          {isLoadingSdk ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <Search className="h-4 w-4 text-primary" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (selectedPlaceName) setSelectedPlaceName(null);
          }}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          placeholder={isLoadingSdk ? 'Connecting to Google Maps...' : placeholder}
          disabled={isLoadingSdk || !isSdkReady}
          className="w-full h-11 pl-9 pr-9 rounded-xl border border-input bg-card text-xs text-foreground placeholder:text-muted-foreground/60 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {selectedPlaceName ? (
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium px-1">
          <Sparkles className="h-3 w-3 shrink-0" />
          <span className="truncate">
            Auto-filled details from Google Maps for <strong>{selectedPlaceName}</strong>
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1">
          <span>Type to search worldwide places & restaurants</span>
          <span className="flex items-center gap-1 font-semibold text-primary/80">
            <MapPin className="h-2.5 w-2.5" />
            Google Maps Places
          </span>
        </div>
      )}
    </div>
  );
};
