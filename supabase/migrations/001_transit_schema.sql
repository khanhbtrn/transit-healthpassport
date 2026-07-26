-- Transit healthcare relocation schema
-- Demo-ready foundation with row-level security

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  date_of_birth date,
  current_country text,
  destination_country text,
  current_city text,
  destination_city text,
  move_date date,
  preferred_language text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conditions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  diagnosed_at date,
  status text,
  notes text,
  confidence text,
  verification_status text,
  created_at timestamptz not null default now()
);

create table if not exists public.medications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  dosage text,
  frequency text,
  start_date date,
  end_date date,
  status text,
  reason_stopped text,
  prescribing_specialist text,
  confidence text,
  verification_status text,
  created_at timestamptz not null default now()
);

create table if not exists public.allergies (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  substance text not null,
  reaction text,
  severity text,
  verification_status text,
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  document_type text,
  file_path text,
  source_provider text,
  document_date date,
  language text,
  processing_status text,
  created_at timestamptz not null default now()
);

create table if not exists public.extracted_facts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  document_id uuid references public.documents(id) on delete set null,
  category text,
  value text not null,
  source_text text,
  confidence text,
  verification_status text,
  created_at timestamptz not null default now()
);

create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  event_date date,
  approximate_date boolean default false,
  event_type text,
  title text not null,
  description text,
  source_type text,
  source_id text,
  confidence text,
  verification_status text,
  created_at timestamptz not null default now()
);

create table if not exists public.relocation_tasks (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  phase text,
  title text not null,
  description text,
  status text,
  priority text,
  owner text,
  due_date date,
  source_status text,
  action_type text,
  created_at timestamptz not null default now()
);

create table if not exists public.doctor_candidates (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  doctor_name text not null,
  organization text,
  specialty text,
  languages text[],
  location text,
  distance_minutes integer,
  care_route text,
  availability_text text,
  expertise text[],
  match_score integer,
  match_reason text,
  fictional boolean default true,
  created_at timestamptz not null default now()
);

create table if not exists public.handoffs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  language text,
  clinical_summary text,
  patient_summary text,
  unresolved_questions text[],
  generated_at timestamptz not null default now(),
  approved_at timestamptz
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text not null,
  content text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.consents (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  consent_type text not null,
  granted boolean not null default false,
  granted_at timestamptz,
  revoked_at timestamptz
);

alter table public.profiles enable row level security;
alter table public.conditions enable row level security;
alter table public.medications enable row level security;
alter table public.allergies enable row level security;
alter table public.documents enable row level security;
alter table public.extracted_facts enable row level security;
alter table public.timeline_events enable row level security;
alter table public.relocation_tasks enable row level security;
alter table public.doctor_candidates enable row level security;
alter table public.handoffs enable row level security;
alter table public.conversations enable row level security;
alter table public.consents enable row level security;

-- Demo policies: authenticated users can manage their own profile rows.
-- In production, map auth.uid() to profiles.id (or a user_id column).

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "conditions_select_own" on public.conditions
  for select using (auth.uid() = profile_id);

create policy "conditions_write_own" on public.conditions
  for all using (auth.uid() = profile_id);

create policy "medications_select_own" on public.medications
  for select using (auth.uid() = profile_id);

create policy "medications_write_own" on public.medications
  for all using (auth.uid() = profile_id);

create policy "allergies_select_own" on public.allergies
  for select using (auth.uid() = profile_id);

create policy "allergies_write_own" on public.allergies
  for all using (auth.uid() = profile_id);

create policy "documents_select_own" on public.documents
  for select using (auth.uid() = profile_id);

create policy "documents_write_own" on public.documents
  for all using (auth.uid() = profile_id);

create policy "facts_select_own" on public.extracted_facts
  for select using (auth.uid() = profile_id);

create policy "facts_write_own" on public.extracted_facts
  for all using (auth.uid() = profile_id);

create policy "timeline_select_own" on public.timeline_events
  for select using (auth.uid() = profile_id);

create policy "timeline_write_own" on public.timeline_events
  for all using (auth.uid() = profile_id);

create policy "tasks_select_own" on public.relocation_tasks
  for select using (auth.uid() = profile_id);

create policy "tasks_write_own" on public.relocation_tasks
  for all using (auth.uid() = profile_id);

create policy "doctors_select_own" on public.doctor_candidates
  for select using (auth.uid() = profile_id);

create policy "doctors_write_own" on public.doctor_candidates
  for all using (auth.uid() = profile_id);

create policy "handoffs_select_own" on public.handoffs
  for select using (auth.uid() = profile_id);

create policy "handoffs_write_own" on public.handoffs
  for all using (auth.uid() = profile_id);

create policy "conversations_select_own" on public.conversations
  for select using (auth.uid() = profile_id);

create policy "conversations_write_own" on public.conversations
  for all using (auth.uid() = profile_id);

create policy "consents_select_own" on public.consents
  for select using (auth.uid() = profile_id);

create policy "consents_write_own" on public.consents
  for all using (auth.uid() = profile_id);
