-- Server-side authorization helper functions used inside RLS policies.
--
-- These are SECURITY DEFINER so they run as the function owner (the
-- migration role, which owns `profiles` and therefore bypasses RLS on it).
-- That is deliberate and is what avoids infinite RLS recursion: a policy
-- on `profiles` that called a normal SECURITY INVOKER function which
-- itself queried `profiles` under RLS would re-trigger the same policy.
--
-- `set search_path = public, pg_catalog` on every function pins name
-- resolution and prevents search_path hijacking by a session that has set
-- a malicious search_path before calling into these functions.
--
-- Nothing here trusts anything supplied by the browser: `auth.uid()` is
-- derived server-side from the verified JWT for the current request, not
-- from any client-sent parameter.

create or replace function public.is_active_admin()
returns boolean
language sql
security definer
stable
set search_path = public, pg_catalog
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_active = true
  );
$$;

comment on function public.is_active_admin() is
  'True if the current auth.uid() has an active admin profile, '
  'regardless of role (super_admin or editor). Use for authorizing '
  'CMS content operations that both roles may perform.';

create or replace function public.is_super_admin()
returns boolean
language sql
security definer
stable
set search_path = public, pg_catalog
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_active = true
      and p.role = 'super_admin'
  );
$$;

comment on function public.is_super_admin() is
  'True if the current auth.uid() has an active profile with role '
  'super_admin. Use for authorizing user management, settings, and any '
  'operation more sensitive than routine content management.';

-- Explicit, minimal privilege grants. Revoke the default PUBLIC execute
-- grant first, then grant only to the roles that need it (both anon and
-- authenticated need to be able to *call* these — they will simply
-- evaluate to false for anon/non-admin callers, since auth.uid() is null
-- or the profile lookup fails).
revoke execute on function public.is_active_admin() from public;
revoke execute on function public.is_super_admin() from public;
grant execute on function public.is_active_admin() to anon, authenticated;
grant execute on function public.is_super_admin() to anon, authenticated;
