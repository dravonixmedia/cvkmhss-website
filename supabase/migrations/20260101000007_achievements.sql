-- Achievements: maps onto AchievementItem. category reuses the existing
-- fixed 6-value achievement_category enum (see 20260101000000) rather
-- than inventing new categories.

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  category public.achievement_category not null,
  achievement_date date not null,
  description text not null,
  image text,
  status public.content_status not null default 'draft',
  published_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint achievements_slug_key unique (slug),
  constraint achievements_slug_not_blank check (length(trim(slug)) > 0)
);

create index if not exists achievements_status_idx on public.achievements (status);
create index if not exists achievements_category_idx on public.achievements (category);
create index if not exists achievements_date_idx on public.achievements (achievement_date desc);

create trigger achievements_set_updated_at
  before update on public.achievements
  for each row
  execute function public.set_updated_at();

alter table public.achievements enable row level security;

create policy "achievements_public_read_published"
  on public.achievements
  for select
  to anon, authenticated
  using (status = 'published');

create policy "achievements_admin_manage"
  on public.achievements
  for all
  to authenticated
  using (public.is_active_admin())
  with check (public.is_active_admin());
