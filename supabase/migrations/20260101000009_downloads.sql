-- Downloads: maps onto DownloadItem. No slug/detail page — downloads are
-- direct file links, not content with its own public detail URL, matching
-- the existing local type exactly. `file_path` is a Storage object path
-- (bucket "documents", prefix "downloads/"), never the file itself.

create table if not exists public.downloads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category public.download_category not null,
  description text,
  file_path text not null,
  status public.content_status not null default 'draft',
  published_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists downloads_status_idx on public.downloads (status);
create index if not exists downloads_category_idx on public.downloads (category);

create trigger downloads_set_updated_at
  before update on public.downloads
  for each row
  execute function public.set_updated_at();

alter table public.downloads enable row level security;

create policy "downloads_public_read_published"
  on public.downloads
  for select
  to anon, authenticated
  using (status = 'published');

create policy "downloads_admin_manage"
  on public.downloads
  for all
  to authenticated
  using (public.is_active_admin())
  with check (public.is_active_admin());
