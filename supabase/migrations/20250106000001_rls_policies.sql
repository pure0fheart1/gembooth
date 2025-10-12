-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gifs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_stats ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Photos policies
CREATE POLICY "Users can view their own photos"
  ON public.photos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Public photos are viewable by everyone"
  ON public.photos FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can insert their own photos"
  ON public.photos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own photos"
  ON public.photos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos"
  ON public.photos FOR DELETE
  USING (auth.uid() = user_id);

-- GIFs policies
CREATE POLICY "Users can view their own gifs"
  ON public.gifs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Public gifs are viewable by everyone"
  ON public.gifs FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can insert their own gifs"
  ON public.gifs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gifs"
  ON public.gifs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own gifs"
  ON public.gifs FOR DELETE
  USING (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Users can view their own favorites"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Usage stats policies
CREATE POLICY "Users can view their own usage stats"
  ON public.usage_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage stats"
  ON public.usage_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);
