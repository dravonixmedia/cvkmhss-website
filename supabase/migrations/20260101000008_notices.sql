-- Notices: maps onto NoticeItem. The existing local type used a flat
-- `published: boolean` flag; this schema replaces it with the shared
-- content_status enum for consistency with every other CMS domain
-- (published boolean true <=> status = 'published'). expiry_date is kept
-- as a plain nullable date — expiry is a display/sort concern for the
-- future public integration, not a security boundary, so it is not baked
-- into the RLS policy.

create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  notice_date date not null,
  category public.notice_category not null,
  description text not null,
  attachment_path text,
  expiry_date date,
  important boolean not null default false,
  status public.content_status not null default 'draft',
  published_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint notices_slug_key unique (slug),
  constraint notices_slug_not_blank check (length(trim(slug)) > 0)
);

create index if not exists notices_status_idx on public.notices (status);
create index if not exists notices_date_idx on public.notices (notice_date desc);
create index if not exists notices_important_idx
  on public.notices (important)
  where important = true;

create trigger notices_set_updated_at
  before update on public.notices
  for each row
  execute function public.set_updated_at();

alter table public.notices enable row level security;

create policy "notices_public_read_published"
  on public.notices
  for select
  to anon, authenticated
  using (status = 'published');

create policy "notices_admin_manage"
  on public.notices
  for all
  to authenticated
  using (public.is_active_admin())
  with check (public.is_active_admin());
