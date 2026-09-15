-- Admin-facing policies on `profiles`, added now that is_super_admin()
-- exists. User/profile management is intentionally more restrictive than
-- content management: only super_admin may read, create, update, or
-- delete other users' profiles. An editor can still only ever see their
-- own row, via the profiles_select_own policy from the previous
-- migration.

create policy "profiles_super_admin_select_all"
  on public.profiles
  for select
  to authenticated
  using (public.is_super_admin());

create policy "profiles_super_admin_insert"
  on public.profiles
  for insert
  to authenticated
  with check (public.is_super_admin());

create policy "profiles_super_admin_update"
  on public.profiles
  for update
  to authenticated
  using (public.is_super_admin())
  with check (public.is_super_admin());

create policy "profiles_super_admin_delete"
  on public.profiles
  for delete
  to authenticated
  using (public.is_super_admin());

-- No anon policies are created for `profiles` at all: with RLS enabled and
-- no matching policy, anonymous clients get zero rows and every write is
-- denied by default.
