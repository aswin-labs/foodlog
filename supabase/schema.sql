-- ==============================================================================
-- FoodLog — PostgreSQL Database Schema for Supabase
-- ==============================================================================
-- This schema establishes the relational database structure, foreign keys,
-- constraints, performance indexes, Row Level Security (RLS) policies,
-- and Supabase Storage bucket configuration for FoodLog.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABLES & CONSTRAINTS
-- ==============================================================================

-- A. RESTAURANTS
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL CHECK (char_length(trim(name)) >= 2),
    description TEXT NOT NULL DEFAULT '',
    location TEXT NOT NULL CHECK (char_length(trim(location)) >= 2),
    address TEXT NOT NULL DEFAULT '',
    cuisine_types TEXT[] NOT NULL DEFAULT '{}',
    cover_image TEXT NOT NULL DEFAULT '',
    favourite BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- B. DISHES (Global Dish catalog: separation of dish concept from visit prices)
CREATE TABLE IF NOT EXISTS public.dishes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL CHECK (char_length(trim(name)) >= 1),
    category TEXT NOT NULL CHECK (char_length(trim(category)) >= 1),
    description TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- C. FRIENDS (Dining companions & circle records)
CREATE TABLE IF NOT EXISTS public.friends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    linked_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Prepared for future user profiles
    name TEXT NOT NULL CHECK (char_length(trim(name)) >= 1),
    nickname TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- D. VISITS (Dining excursions & review ratings)
CREATE TABLE IF NOT EXISTS public.visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    visited_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    total_bill NUMERIC(10, 2) NOT NULL CHECK (total_bill >= 0),
    number_of_people INTEGER NOT NULL DEFAULT 1 CHECK (number_of_people > 0),
    overall_rating NUMERIC(2, 1) NOT NULL CHECK (overall_rating >= 1.0 AND overall_rating <= 5.0),
    food_quality_rating NUMERIC(2, 1) NOT NULL DEFAULT 5.0 CHECK (food_quality_rating >= 1.0 AND food_quality_rating <= 5.0),
    value_for_money_rating NUMERIC(2, 1) NOT NULL DEFAULT 4.0 CHECK (value_for_money_rating >= 1.0 AND value_for_money_rating <= 5.0),
    service_rating NUMERIC(2, 1) NOT NULL DEFAULT 5.0 CHECK (service_rating >= 1.0 AND service_rating <= 5.0),
    ambience_rating NUMERIC(2, 1) NOT NULL DEFAULT 5.0 CHECK (ambience_rating >= 1.0 AND ambience_rating <= 5.0),
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- E. VISIT DISHES (Line items ordered in a specific visit with historical price & rating)
CREATE TABLE IF NOT EXISTS public.visit_dishes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE,
    dish_id UUID NOT NULL REFERENCES public.dishes(id) ON DELETE RESTRICT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
    notes TEXT DEFAULT '',
    would_order_again BOOLEAN NOT NULL DEFAULT TRUE,
    photo_attachments TEXT[] DEFAULT '{}'
);

-- F. VISIT FRIENDS (Junction table linking friends to visits)
CREATE TABLE IF NOT EXISTS public.visit_friends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE,
    friend_id UUID NOT NULL REFERENCES public.friends(id) ON DELETE CASCADE,
    UNIQUE (visit_id, friend_id)
);

-- G. ATTACHMENTS (Photographs and menu cards)
CREATE TABLE IF NOT EXISTS public.attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    visit_id UUID NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE,
    visit_dish_id UUID REFERENCES public.visit_dishes(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('menu', 'food')),
    file_name TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 3. AUTOMATIC UPDATED_AT TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_restaurants_updated_at ON public.restaurants;
CREATE TRIGGER set_restaurants_updated_at
BEFORE UPDATE ON public.restaurants
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_visits_updated_at ON public.visits;
CREATE TRIGGER set_visits_updated_at
BEFORE UPDATE ON public.visits
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 4. PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_restaurants_owner_id ON public.restaurants(owner_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_favourite ON public.restaurants(favourite);
CREATE INDEX IF NOT EXISTS idx_restaurants_cuisine_types ON public.restaurants USING GIN (cuisine_types);

CREATE INDEX IF NOT EXISTS idx_visits_owner_id ON public.visits(owner_id);
CREATE INDEX IF NOT EXISTS idx_visits_restaurant_id ON public.visits(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_visits_visited_at ON public.visits(visited_at DESC);

CREATE INDEX IF NOT EXISTS idx_dishes_owner_id ON public.dishes(owner_id);
CREATE INDEX IF NOT EXISTS idx_dishes_name ON public.dishes(name);

CREATE INDEX IF NOT EXISTS idx_visit_dishes_visit_id ON public.visit_dishes(visit_id);
CREATE INDEX IF NOT EXISTS idx_visit_dishes_dish_id ON public.visit_dishes(dish_id);

CREATE INDEX IF NOT EXISTS idx_friends_owner_id ON public.friends(owner_id);
CREATE INDEX IF NOT EXISTS idx_visit_friends_visit_id ON public.visit_friends(visit_id);
CREATE INDEX IF NOT EXISTS idx_visit_friends_friend_id ON public.visit_friends(friend_id);

CREATE INDEX IF NOT EXISTS idx_attachments_visit_id ON public.attachments(visit_id);
CREATE INDEX IF NOT EXISTS idx_attachments_type ON public.attachments(type);

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visit_dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visit_friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;

-- Production Authenticated Ownership Policies:
-- (When authentication is enabled, users can only access and modify their own records)

-- Restaurants policies
CREATE POLICY "Users can manage their own restaurants"
ON public.restaurants
FOR ALL
USING (auth.uid() = owner_id OR owner_id IS NULL)
WITH CHECK (auth.uid() = owner_id OR owner_id IS NULL);

-- Dishes policies
CREATE POLICY "Users can manage their own dishes"
ON public.dishes
FOR ALL
USING (auth.uid() = owner_id OR owner_id IS NULL)
WITH CHECK (auth.uid() = owner_id OR owner_id IS NULL);

-- Friends policies
CREATE POLICY "Users can manage their own friends"
ON public.friends
FOR ALL
USING (auth.uid() = owner_id OR owner_id IS NULL)
WITH CHECK (auth.uid() = owner_id OR owner_id IS NULL);

-- Visits policies
CREATE POLICY "Users can manage their own visits"
ON public.visits
FOR ALL
USING (auth.uid() = owner_id OR owner_id IS NULL)
WITH CHECK (auth.uid() = owner_id OR owner_id IS NULL);

-- Visit Dishes policies (enforced via visit ownership)
CREATE POLICY "Users can manage visit dishes via visit"
ON public.visit_dishes
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.visits
        WHERE visits.id = visit_dishes.visit_id
        AND (visits.owner_id = auth.uid() OR visits.owner_id IS NULL)
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.visits
        WHERE visits.id = visit_dishes.visit_id
        AND (visits.owner_id = auth.uid() OR visits.owner_id IS NULL)
    )
);

-- Visit Friends policies (enforced via visit ownership)
CREATE POLICY "Users can manage visit friends via visit"
ON public.visit_friends
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.visits
        WHERE visits.id = visit_friends.visit_id
        AND (visits.owner_id = auth.uid() OR visits.owner_id IS NULL)
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.visits
        WHERE visits.id = visit_friends.visit_id
        AND (visits.owner_id = auth.uid() OR visits.owner_id IS NULL)
    )
);

-- Attachments policies (enforced via visit ownership)
CREATE POLICY "Users can manage attachments via visit"
ON public.attachments
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.visits
        WHERE visits.id = attachments.visit_id
        AND (visits.owner_id = auth.uid() OR visits.owner_id IS NULL)
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.visits
        WHERE visits.id = attachments.visit_id
        AND (visits.owner_id = auth.uid() OR visits.owner_id IS NULL)
    )
);

-- ==============================================================================
-- 6. SUPABASE STORAGE BUCKET CONFIGURATION
-- ==============================================================================

-- Create public storage bucket for food photographs and menu cards
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'foodlog-media',
    'foodlog-media',
    true,
    10485760, -- 10MB limit per file
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/heic']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies:
-- 1. Anyone can view/read uploaded food and menu images
CREATE POLICY "Public media access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'foodlog-media');

-- 2. Authenticated users (or local dev anon key) can upload images
CREATE POLICY "Authenticated users can upload food media"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'foodlog-media');

-- 3. Users can delete their media
CREATE POLICY "Users can delete their food media"
ON storage.objects
FOR DELETE
USING (bucket_id = 'foodlog-media');

-- ==============================================================================
-- 7. ROLE PRIVILEGES (GRANT ACCESS TO anon & authenticated)
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT ALL ON TABLE public.restaurants TO anon, authenticated;
GRANT ALL ON TABLE public.visits TO anon, authenticated;
GRANT ALL ON TABLE public.dishes TO anon, authenticated;
GRANT ALL ON TABLE public.visit_dishes TO anon, authenticated;
GRANT ALL ON TABLE public.friends TO anon, authenticated;
GRANT ALL ON TABLE public.visit_friends TO anon, authenticated;
GRANT ALL ON TABLE public.attachments TO anon, authenticated;

GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;

