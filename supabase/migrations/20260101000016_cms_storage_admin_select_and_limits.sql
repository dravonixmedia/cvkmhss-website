-- Additive hardening for the 5 original Phase 2A CMS buckets (news,
-- events, achievements, gallery, documents), applying the same two
-- refinements already made for the "management" bucket:
--
-- 1. An admin SELECT policy. The original storage.sql (migration 11)
--    only granted admins INSERT/UPDATE/DELETE on these buckets, because
--    no admin CRUD UI existed yet to need read access to draft-linked
--    assets. The News/Events/Achievements/Notices/Downloads/Gallery
--    admin modules now preview images and documents for DRAFT records
--    too, which the public "only if referenced by a published row"
--    policy correctly does not cover. Without this, an active admin
--    could upload/replace a file but never see a preview of it before
--    publishing.
-- 2. Bucket-level file_size_limit / allowed_mime_types, matching the
--    real content each bucket holds: images for news/events/
--    achievements/gallery, and a broader set of office/document formats
--    for "documents" (notices attachments + downloads files). This is
--    enforced by Supabase Storage itself, in addition to the existing
--    server-side validation pattern already used for photo uploads.
--
-- Nothing here weakens any existing policy — every statement is a new
-- CREATE POLICY or a column-level UPDATE on storage.buckets rows that
-- already exist; no policy is dropped or altered, no table is
-- recreated.

update storage.buckets
set file_size_limit = 5242880, -- 5 MB
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id in ('news', 'events', 'achievements', 'gallery');

update storage.buckets
set file_size_limit = 10485760, -- 10 MB
    allowed_mime_types = array[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png'
    ]
where id = 'documents';

create policy "storage_news_admin_select"
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'news' and public.is_active_admin());

create policy "storage_events_admin_select"
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'events' and public.is_active_admin());

create policy "storage_achievements_admin_select"
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'achievements' and public.is_active_admin());

create policy "storage_gallery_admin_select"
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'gallery' and public.is_active_admin());

create policy "storage_documents_admin_select"
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'documents' and public.is_active_admin());
