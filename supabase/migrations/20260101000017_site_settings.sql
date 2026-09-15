-- Global, editable school/website settings — a singleton table (always
-- exactly one row, id = 1). This is NOT infrastructure/developer
-- configuration (no Supabase/Cloudflare/API credentials belong here,
-- ever) — it holds ordinary school-identity, contact and social-link
-- content that both admin roles may edit, mirroring the shape of the
-- existing static src/data/site.ts (which stays as the fallback when a
-- field here is blank/unset — see src/lib/settings/public.ts).
--
-- All columns are nullable free text: unknown information stays blank
-- rather than being fabricated. There is no draft/published concept
-- here (unlike every content table) — a saved value applies immediately,
-- same as any other site configuration.

create table if not exists public.site_settings (
  id smallint primary key default 1,
  school_name text,
  short_name text,
  established_year integer,
  school_code text,
  hss_code text,
  udise_code text,
  phone text,
  phone_secondary text,
  email text,
  address_locality text,
  address_district text,
  address_state text,
  address_postal_code text,
  google_maps_url text,
  facebook_url text,
  instagram_url text,
  youtube_url text,
  updated_by uuid references public.profiles (id) on delete set null,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

comment on table public.site_settings is
  'Singleton row (id = 1) of editable school/website content: identity, '
  'contact, and social links only. Never store infrastructure or '
  'developer configuration (Supabase/Cloudflare/API credentials) here.';

create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row
  execute function public.set_updated_at();

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

alter table public.site_settings enable row level security;

-- Every column here is intended for public display (school identity,
-- contact, social links) — there is no privileged column to hide, unlike
-- a content table's draft rows. Unrestricted public read is therefore
-- correct, not a shortcut.
create policy "site_settings_public_read"
  on public.site_settings
  for select
  to anon, authenticated
  using (true);

-- Both admin roles may edit ordinary school/contact/social content —
-- same is_active_admin() gate as every CMS content table. Nothing stored
-- here is sensitive enough to require super_admin.
create policy "site_settings_admin_update"
  on public.site_settings
  for update
  to authenticated
  using (public.is_active_admin())
  with check (public.is_active_admin());

-- No insert/delete policy: the singleton row is seeded once by this
-- migration and only ever updated afterward.
