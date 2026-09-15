-- Storage for Management & Leadership portrait photographs.
--
-- Decision: a dedicated private bucket ("management"), not a shared path
-- inside an existing bucket. Rationale: portraits have their own upload
-- constraints (image-only mime types, a stricter size limit than a mixed
-- documents bucket) which Supabase Storage can enforce at the bucket
-- level via file_size_limit/allowed_mime_types — that only works cleanly
-- with a dedicated bucket, not a shared one whose other content (e.g.
-- PDFs in "documents") needs different limits. This otherwise follows
-- the exact pattern established in 20260101000011_storage.sql.
--
-- Private (public = false): a management member's photo must not be
-- publicly fetchable merely because someone knows/guesses the object
-- path. The SELECT policy below grants read access only to objects
-- referenced by a PUBLISHED management_members row, mirroring every
-- other CMS bucket's policy.
--
-- Unlike the original Phase 2A storage migration, this one also adds an
-- explicit admin SELECT policy. The Phase 2A admin policies only covered
-- INSERT/UPDATE/DELETE because no admin CRUD UI existed yet to need read
-- access to draft-linked assets. The Management admin UI now previews
-- photos for draft (not yet published) members too, which the public
-- read policy correctly does not cover — so an authenticated active admin
-- needs its own read path, independent of publish status.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'management',
  'management',
  false,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "storage_management_public_read_published"
  on storage.objects
  for select
  to anon, authenticated
  using (
    bucket_id = 'management'
    and exists (
      select 1 from public.management_members m
      where m.photo_path = storage.objects.name
        and m.status = 'published'
    )
  );

create policy "storage_management_admin_select"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'management'
    and public.is_active_admin()
  );

create policy "storage_management_admin_insert"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'management'
    and public.is_active_admin()
  );

create policy "storage_management_admin_update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'management'
    and public.is_active_admin()
  )
  with check (
    bucket_id = 'management'
    and public.is_active_admin()
  );

create policy "storage_management_admin_delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'management'
    and public.is_active_admin()
  );
