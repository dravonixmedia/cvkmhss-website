-- Events: maps onto EventItem (src/types/index.ts) and eventSchema()
-- (src/lib/schema.ts). start_time/end_time stay nullable — the existing
-- type already treats them as optional and nothing requires an event to
-- have explicit times.

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  event_date date not null,
  start_time time,
  end_time time,
  location text not null,
  description text not null,
  image text,
  status public.content_status not null default 'draft',
  published_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_slug_key unique (slug),
  constraint events_slug_not_blank check (length(trim(slug)) > 0)
);

create index if not exists events_status_idx on public.events (status);
create index if not exists events_event_date_idx on public.events (event_date);

create trigger events_set_updated_at
  before update on public.events
  for each row
  execute function public.set_updated_at();

alter table public.events enable row level security;

create policy "events_public_read_published"
  on public.events
  for select
  to anon, authenticated
  using (status = 'published');

create policy "events_admin_manage"
  on public.events
  for all
  to authenticated
  using (public.is_active_admin())
  with check (public.is_active_admin());
