-- Gallery: album-based architecture (gallery_albums + gallery_images),
-- not a single flat table, matching GalleryAlbum/GalleryImage. Image
-- ordering within an album is controlled explicitly via sort_order rather
-- than relying on insertion order or filename.

create table if not exists public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  description text not null,
  category public.gallery_category not null,
  album_date date not null,
  cover_image_path text,
  status public.content_status not null default 'draft',
  published_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gallery_albums_slug_key unique (slug),
  constraint gallery_albums_slug_not_blank check (length(trim(slug)) > 0)
);

create index if not exists gallery_albums_status_idx on public.gallery_albums (status);
create index if not exists gallery_albums_category_idx on public.gallery_albums (category);

create trigger gallery_albums_set_updated_at
  before update on public.gallery_albums
  for each row
  execute function public.set_updated_at();

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.gallery_albums (id) on delete cascade,
  image_path text not null,
  alt_text text not null,
  caption text,
  sort_order integer not null default 0,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists gallery_images_album_order_idx
  on public.gallery_images (album_id, sort_order);

alter table public.gallery_albums enable row level security;
alter table public.gallery_images enable row level security;

create policy "gallery_albums_public_read_published"
  on public.gallery_albums
  for select
  to anon, authenticated
  using (status = 'published');

create policy "gallery_albums_admin_manage"
  on public.gallery_albums
  for all
  to authenticated
  using (public.is_active_admin())
  with check (public.is_active_admin());

-- gallery_images has no status of its own — visibility follows the
-- parent album's status. The EXISTS subquery below is itself subject to
-- gallery_albums' own RLS, so this stays consistent even if the album
-- policy above changes.
create policy "gallery_images_public_read_published_album"
  on public.gallery_images
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.gallery_albums ga
      where ga.id = gallery_images.album_id
        and ga.status = 'published'
    )
  );

create policy "gallery_images_admin_manage"
  on public.gallery_images
  for all
  to authenticated
  using (public.is_active_admin())
  with check (public.is_active_admin());
