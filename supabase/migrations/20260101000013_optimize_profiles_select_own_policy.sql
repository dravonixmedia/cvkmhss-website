-- Live performance advisor finding (Supabase database linter, project
-- sovppydnmstzwnstczua): profiles_select_own called auth.uid() directly
-- in its USING clause, which Postgres re-evaluates per row instead of
-- once per statement. Wrapping it as (select auth.uid()) lets it be
-- planned as an InitPlan and evaluated once. Same behavior, no security
-- change — auth.uid() is still the server-verified JWT subject.

drop policy "profiles_select_own" on public.profiles;

create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (id = (select auth.uid()));
