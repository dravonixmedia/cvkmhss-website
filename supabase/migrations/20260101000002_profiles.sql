-- Application-level authorization table, decoupled from auth.users.
--
-- Authorization decisions (role, is_active) must never rely on
-- auth.users metadata alone, since that is more easily modified via the
-- Auth admin API surface and mixes authentication concerns with
-- authorization concerns. `profiles` is the single source of truth for
-- "is this authenticated user allowed to use the admin backend, and as
-- what role."
--
-- Passwords are never stored here — Supabase Auth (auth.users) owns
-- credentials entirely.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role public.app_role not null default 'editor',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'Authorization profile for admin backend users. One row per auth.users '
  'row that should have any admin access. Absence of a row means no '
  'admin access at all.';
comment on column public.profiles.is_active is
  'Kill-switch independent of the Supabase Auth session. When false, the '
  'user must lose all protected admin access even with a valid session '
  'cookie, enforced by both server-side authorization helpers and RLS.';

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

alter table public.profiles enable row level security;

-- A user may always read their own profile (needed for the admin shell to
-- know its own role/active state). Admin-management policies covering
-- other users' profiles are added in a later migration once the
-- is_super_admin() helper function exists.
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());
