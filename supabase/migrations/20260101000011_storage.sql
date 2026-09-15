-- Storage buckets and policies for CMS-managed assets.
--
-- Buckets are created PRIVATE (public = false). A private bucket with no
-- policy denies all access by default; the SELECT policies below grant
-- anonymous/public read access only to objects that are actually
-- referenced by a PUBLISHED row in the corresponding content table. This
-- is deliberately stricter than making the buckets public: a public
-- bucket would let anyone fetch a draft-only image by direct URL (e.g. a
-- news article's featured image before it is published) purely because
-- they know or guess the storage path, which is exactly the kind of
-- storage-as-authorization-bypass the Phase 2A brief calls out.
--
-- Conceptual layout:
--   news/                  -- News.featured_image
--   events/                -- Events.image
--   achievements/           -- Achievements.image
--   gallery/{album-id}/     -- Gallery_images.image_path, gallery_albums.cover_image_path
--   documents/notices/      -- Notices.attachment_path
--   documents/downloads/    -- Downloads.file_path
--
-- Filenames stored in *_path columns are always server-generated
-- identifiers (e.g. a random UUID + safe extension), never the
-- uploader-supplied original filename — that generation happens in the
-- server-side upload handler (Phase 2B), not in SQL.

insert into storage.buckets (id, name, public)
values
  ('news', 'news', false),
  ('events', 'events', false),
  ('achievements', 'achievements', false),
  ('gallery', 'gallery', false),
  ('documents', 'documents', false)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- Public read: only objects referenced by a published row.
-- ---------------------------------------------------------------------

create policy "storage_news_public_read_published"
  on storage.objects
  for select
  to anon, authenticated
  using (
    bucket_id = 'news'
    and exists (
      select 1 from public.news n
      where n.featured_image = storage.objects.name
        and n.status = 'published'
    )
  );

create policy "storage_events_public_read_published"
  on storage.objects
  for select
  to anon, authenticated
  using (
    bucket_id = 'events'
    and exists (
      select 1 from public.events e
      where e.image = storage.objects.name
        and e.status = 'published'
    )
  );

create policy "storage_achievements_public_read_published"
  on storage.objects
  for select
  to anon, authenticated
  using (
    bucket_id = 'achievements'
    and exists (
      select 1 from public.achievements a
      where a.image = storage.objects.name
        and a.status = 'published'
    )
  );

create policy "storage_gallery_public_read_published"
  on storage.objects
  for select
  to anon, authenticated
  using (
    bucket_id = 'gallery'
    and (
      exists (
        select 1 from public.gallery_images gi
        join public.gallery_albums ga on ga.id = gi.album_id
        where gi.image_path = storage.objects.name
          and ga.status = 'published'
      )
      or exists (
        select 1 from public.gallery_albums ga
        where ga.cover_image_path = storage.objects.name
          and ga.status = 'published'
      )
    )
  );

create policy "storage_documents_public_read_published"
  on storage.objects
  for select
  to anon, authenticated
  using (
    bucket_id = 'documents'
    and (
      exists (
        select 1 from public.notices n
        where n.attachment_path = storage.objects.name
          and n.status = 'published'
      )
      or exists (
        select 1 from public.downloads d
        where d.file_path = storage.objects.name
          and d.status = 'published'
      )
    )
  );

-- ---------------------------------------------------------------------
-- Admin write: authenticated, active admins (super_admin or editor) may
-- upload/update/delete objects in any of the five CMS buckets.
-- Unauthenticated users get no write policy at all, so writes are denied
-- by default. Inactive users fail is_active_admin() the same way they
-- fail every other authorization check in this schema.
-- ---------------------------------------------------------------------

create policy "storage_cms_admin_insert"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id in ('news', 'events', 'achievements', 'gallery', 'documents')
    and public.is_active_admin()
  );

create policy "storage_cms_admin_update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id in ('news', 'events', 'achievements', 'gallery', 'documents')
    and public.is_active_admin()
  )
  with check (
    bucket_id in ('news', 'events', 'achievements', 'gallery', 'documents')
    and public.is_active_admin()
  );

create policy "storage_cms_admin_delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id in ('news', 'events', 'achievements', 'gallery', 'documents')
    and public.is_active_admin()
  );
