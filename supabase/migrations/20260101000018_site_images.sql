-- Predefined static-website photography slots (Home Hero, About Hero,
-- etc.) — distinct from the six content CMS domains (news, events,
-- achievements, gallery, management_members) which already have their
-- own image-bearing columns. This table exists only for a small, fixed
-- set of application-controlled positions on otherwise-static pages; it
-- is not a media library and admins cannot create new slot_key values
-- through the app — every row is seeded once below by slot_key, and the
-- app only ever UPDATEs an existing row, never INSERTs a new one.
--
-- No draft/published workflow here (unlike content tables): a saved
-- image applies immediately, same as site_settings.

create table if not exists public.site_images (
  id uuid primary key default gen_random_uuid(),
  slot_key text not null unique,
  image_path text,
  alt_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) on delete set null,
  constraint site_images_slot_key_known check (
    slot_key in (
      'home_hero',
      'home_campus_highlight',
      'home_student_life_highlight',
      'about_hero',
      'academics_hero',
      'campus_hero',
      'student_life_hero',
      'admissions_hero'
    )
  )
);

comment on table public.site_images is
  'Predefined static-website photography slots (page heroes and home '
  'section highlights). slot_key is a closed, application-controlled '
  'set — see src/lib/site-images/slots.ts. Separate from every content '
  'CMS domain''s own image columns, which are unaffected by this table.';

create trigger site_images_set_updated_at
  before update on public.site_images
  for each row
  execute function public.set_updated_at();

insert into public.site_images (slot_key) values
  ('home_hero'),
  ('home_campus_highlight'),
  ('home_student_life_highlight'),
  ('about_hero'),
  ('academics_hero'),
  ('campus_hero'),
  ('student_life_hero'),
  ('admissions_hero')
on conflict (slot_key) do nothing;

alter table public.site_images enable row level security;

-- Every column here is required to render the public page (which slot,
-- what image, its alt text) — there is no privileged column to hide.
create policy "site_images_public_read"
  on public.site_images
  for select
  to anon, authenticated
  using (true);

-- Admins may only UPDATE existing (pre-seeded) rows — no insert/delete
-- policy, so the fixed set of slot_key values can never be added to or
-- removed via the app, regardless of role.
create policy "site_images_admin_update"
  on public.site_images
  for update
  to authenticated
  using (public.is_active_admin())
  with check (public.is_active_admin());
