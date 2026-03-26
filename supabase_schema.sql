-- Create a table for public profiles linked to Supabase Auth
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  strava_athlete_id text unique,
  strava_access_token text,
  strava_refresh_token text,
  strava_token_expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Create a table for Strava activities
create table public.activities (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  strava_activity_id text unique not null,
  name text,
  distance real, -- in meters
  moving_time integer, -- in seconds
  start_date timestamp with time zone,
  type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS for activities
alter table public.activities enable row level security;

create policy "Activities are viewable by everyone." on public.activities
  for select using (true);

create policy "Users can insert their own activities." on public.activities
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own activities." on public.activities
  for update using (auth.uid() = user_id);

-- Create a trigger to automatically create a profile when a new user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
