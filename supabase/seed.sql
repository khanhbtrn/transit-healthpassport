-- Optional seed for Supabase environments.
-- The Next.js demo mode seeds Maria Santos from local data/ without requiring Supabase.

insert into public.profiles (
  id,
  full_name,
  date_of_birth,
  current_country,
  destination_country,
  current_city,
  destination_city,
  move_date,
  preferred_language
) values (
  '11111111-1111-1111-1111-111111111111',
  'Maria Santos',
  '1992-03-18',
  'United Kingdom',
  'Spain',
  'London',
  'Barcelona',
  '2026-09-14',
  'English'
) on conflict (id) do nothing;
