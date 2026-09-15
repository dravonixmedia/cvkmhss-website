-- Live security advisor finding (Supabase database linter, run against
-- project sovppydnmstzwnstczua after applying the Phase 2A migrations):
-- "Public Can Execute SECURITY DEFINER Function" — is_active_admin() and
-- is_super_admin() were granted EXECUTE to `anon`, but no anon-facing RLS
-- policy actually calls them (only `authenticated`-scoped admin policies
-- do — see profiles_policies.sql / news.sql etc.). The anon grant was
-- unnecessary privilege exposure: both functions only ever return a
-- boolean and touch no sensitive data, so this was low-risk, but it's
-- exactly the kind of excess-privilege finding worth fixing rather than
-- leaving in place.
--
-- Revoke anon's ability to call these directly via
-- /rest/v1/rpc/is_active_admin and /rest/v1/rpc/is_super_admin. Keep the
-- authenticated grant — RLS policy evaluation for the authenticated role
-- requires it, since Postgres checks EXECUTE privilege for the querying
-- role even when the function itself is SECURITY DEFINER.

revoke execute on function public.is_active_admin() from anon;
revoke execute on function public.is_super_admin() from anon;
