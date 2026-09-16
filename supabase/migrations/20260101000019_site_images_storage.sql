-- Dedicated private Storage bucket for the site_images slots (separate
-- from every content domain's own bucket — management/news/events/
-- achievements/gallery/documents). Same private-bucket + signed-URL
-- pattern as every other CMS bucket in this project.
--
-- There is no draft/published distinction for site_images (unlike
-- content tables), so a single public-read policy — "readable if some
-- site_images row currently points at this object" — covers both public
-- rendering and the admin's own preview of the currently-saved image;
-- no separate admin-only SELECT policy is needed here.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-images', 'site-images', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "storage_site_images_public_read"
  on storage.objects
  for select
  to anon, authenticated
  using (
    bucket_id = 'site-images'
    and exists (
      select 1 from public.site_images si
      where si.image_path = storage.objects.name
    )
  );

create policy "storage_site_images_admin_insert"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'site-images'
    and public.is_active_admin()
  );

create policy "storage_site_images_admin_update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'site-images'
    and public.is_active_admin()
  )
  with check (
    bucket_id = 'site-images'
    and public.is_active_admin()
  );

create policy "storage_site_images_admin_delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'site-images'
    and public.is_active_admin()
  );
