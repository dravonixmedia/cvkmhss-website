# Supabase setup — CVKM HSS admin backend (Phase 2A)

## Status

**Connected.** A dedicated CVKM Supabase project exists and is linked:

- Project name: **cvkmhss-website**
- Project ref: **sovppydnmstzwnstczua**
- Organization: **dravonixmedia's Org**
- Region: ap-northeast-1

All 14 migrations in `supabase/migrations/` have been applied to this
project, RLS and Storage policies have been live-verified (see §6), and
`src/lib/supabase/database.types.ts` was generated from this project's
actual live schema.

There is exactly one other Supabase project visible in this environment
("dravonixmedia's Project", ref `lshfkxirfbjwlklqwqnf`, an unrelated shared
Dravonix/DRAIVA project) — it was **not** touched at any point.

**No administrator account exists yet.** No Auth user, no `profiles` row.
Sign-in at `/admin/login` will correctly show the generic
"Unable to sign in. Please check your credentials." error for any
credentials until the bootstrap procedure in §5 is carried out.

## 1. Project

Already created — see Status above. If a second/replacement project is
ever needed, repeat this step and re-run §2–§4 against the new ref.

## 2. Environment variables

`.env.local` (gitignored, not committed) is configured on this machine
with:

```
NEXT_PUBLIC_SUPABASE_URL=https://sovppydnmstzwnstczua.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_dPfcRnuW93e-H1HuyzttWw_t5Oiod7M
```

Both values above are the public URL and the publishable (anon) key —
safe to appear in a browser bundle by design, which is why they're shown
here. `SUPABASE_SERVICE_ROLE_KEY` is **not** set anywhere in this
environment or repo; it was never fetched or used in Phase 2A, since
nothing implemented so far needs it (see `src/lib/supabase/admin.ts` for
where it will be needed — first-super_admin bootstrap and future
invitation flows).

For any other environment (production hosting, another developer's
machine), copy `.env.example` to `.env.local` and fill in the same two
values from **Project Settings → API**, plus the service role key only
where a script genuinely needs it (never in a browser-reachable context).

## 3. Database migrations — applied

All 14 files in `supabase/migrations/` have been applied to
`sovppydnmstzwnstczua`, in order, via `mcp__Supabase__apply_migration`.
Live-verified afterward (`mcp__Supabase__list_migrations` /
`list_tables`): all 8 tables exist with RLS enabled, all enums/functions/
triggers/indexes/policies match the migration SQL exactly.

Two migrations beyond the original 12 were added and applied after
running Supabase's live security/performance advisors
(`mcp__Supabase__get_advisors`) against the freshly-migrated project:

- `20260101000012_tighten_authorization_function_grants.sql` — the
  advisor flagged `is_active_admin()`/`is_super_admin()` as callable by
  `anon` via RPC, which was unnecessary (no anon-facing policy calls
  them). Revoked the `anon` execute grant; kept `authenticated` (which
  RLS evaluation genuinely requires).
- `20260101000013_optimize_profiles_select_own_policy.sql` — the advisor
  flagged `profiles_select_own` re-evaluating `auth.uid()` per row instead
  of once per statement. Rewrote it to `(select auth.uid())` per
  Supabase's documented RLS performance guidance. No behavior change.

Remaining advisor notes, intentionally left as-is (documented here rather
than acted on, to avoid unnecessary schema churn on a brand-new project
with no real traffic yet):

- `authenticated` still has execute on `is_active_admin()`/
  `is_super_admin()` — required for RLS policy evaluation on every
  content table's admin-write policy; cannot be revoked without breaking
  those policies.
- 13 audit columns (`created_by`/`updated_by` across 6 tables) lack
  covering indexes — these aren't hot query paths yet (no CMS UI exists
  to filter by them). Add if/when Phase 2B introduces such queries.
- "Unused index" notices on all 15 non-PK/unique indexes — expected; the
  database is empty (0 rows everywhere), so nothing has used them yet.
- "Multiple permissive policies" for `authenticated` SELECT on 8 tables —
  each table has one clear public-read policy and one clear admin-policy,
  evaluated as OR'd permissive policies. This is an intentional
  readability/separation-of-concerns choice over a single combined
  predicate; revisit only if it shows up as an actual query-performance
  problem once real content/traffic exists.

If applying migrations to a *new* project in the future: apply the 14
files in `supabase/migrations/` in filename order (`supabase db push`, or
paste each into the SQL editor in order). The live project's migration
history also contains several one-off, non-schema housekeeping
migrations used only for live RLS/Storage verification during this
session (seed temporary test rows → run SET-ROLE-anon tests → clean up).
Their net effect on the schema is zero (verified: all tables back to 0
rows after cleanup) and they are **not** included in
`supabase/migrations/` since they aren't schema changes — see §6 for
what they tested.

## 4. Database types — generated from the live project

`src/lib/supabase/database.types.ts` was generated for real via
`mcp__Supabase__generate_typescript_types` against `sovppydnmstzwnstczua`,
replacing the earlier hand-written placeholder. A small hand-maintained
`ProfileRow` convenience alias is appended after the generated section
(clearly marked) since the generator doesn't produce per-table row-type
aliases and `@/lib/auth/session.ts` / `AdminShell.tsx` use it. `tsc
--noEmit` passes against these real types.

To regenerate after a future schema change:

```bash
supabase gen types typescript --project-id sovppydnmstzwnstczua > src/lib/supabase/database.types.ts
```

then re-append the "Hand-maintained convenience aliases" section at the
bottom of the file (comment marks exactly where).

## 5. Create the first admin user and bootstrap super_admin

**This is the next required action.** There is deliberately no public
`/signup` route, no hardcoded admin email, and no automatic "first user
becomes admin" logic.

1. **Create the Auth user** — in the Supabase Dashboard for
   **cvkmhss-website**: **Authentication → Users → Add user**. Set a real
   email and a strong password (or use "Send invite link" if email
   sending is configured for this project). Copy the generated user's
   UUID from the users list.
2. **Create the profile row** — run once in the Dashboard's **SQL
   Editor**, replacing the UUID and name:

   ```sql
   insert into public.profiles (id, full_name, role, is_active)
   values ('<user-uuid-from-step-1>', 'Full Name', 'super_admin', true)
   on conflict (id) do update
     set role = 'super_admin',
         is_active = true,
         full_name = excluded.full_name;
   ```

3. **Confirm it:**

   ```sql
   select id, full_name, role, is_active from public.profiles where id = '<user-uuid>';
   ```

4. **Test login** at `/admin/login` with that user's real email/password.
5. **Test protected route access** — you should land on `/admin` and see
   the dashboard shell with the "Super Admin" role label and your name.

For any additional admin users afterward, repeat steps 1–2 with
`role` set to `'editor'` or `'super_admin'` as appropriate. A UI for this
(so a super_admin doesn't need SQL access) is planned for Phase 2B.

## 6. Live security testing — results

Tested directly against `sovppydnmstzwnstczua` in this session. Where a
test needed real rows to check draft/published separation, temporary rows
were inserted, tested against, then deleted in the same operation — no
real or fake school content was left behind (verified: every table is
back to 0 rows).

| # | Test | Method | Result |
|---|------|--------|--------|
| 1 | Anonymous SELECT sees only `published` content, never `draft` | `SET ROLE anon` against seeded draft+published `news` rows | **PASS** — 1 of 2 rows visible, the published one |
| 2 | Anonymous SELECT on `profiles` returns nothing | `SET ROLE anon; SELECT count(*) FROM profiles` | **PASS** — 0 rows |
| 3 | Anonymous INSERT denied | `SET ROLE anon; INSERT INTO news ...` | **PASS** — `new row violates row-level security policy for table "news"` |
| 4 | Anonymous UPDATE denied | `SET ROLE anon; UPDATE news SET title=... WHERE slug=...` | **PASS** — 0 rows affected; row confirmed unmodified afterward |
| 5 | Anonymous DELETE denied | `SET ROLE anon; DELETE FROM news WHERE slug=...` | **PASS** — 0 rows affected |
| 6 | Gallery join-based visibility (image visibility follows parent album status, not its own column) | Seeded one draft album + one published album, one image each; `SET ROLE anon` SELECT on `gallery_images` | **PASS** — only the published album's image visible |
| 7 | Anonymous INSERT into Storage (`storage.objects`) denied | `SET ROLE anon; INSERT INTO storage.objects ...` | **PASS** — RLS violation on `storage.objects` |
| 8 | Unauthenticated `/admin` redirects to `/admin/login` | Ran the built app against this project, `curl -I http://localhost:3100/admin` | **PASS** — `307` to `/admin/login` |
| 9 | Invalid login shows only the generic error, no internal details leaked | Playwright: submitted a nonexistent email + wrong password at the real `/admin/login` page (real `signInWithPassword` call against this project) | **PASS** — "Unable to sign in. Please check your credentials." shown; stayed on `/admin/login`; confirmed no stray row was created in `auth.users` (still 0) |
| 10 | No public signup route exists | Code review + `auth.users` count check | **PASS** — no `/signup` route in `src/app`; 0 users in the project |

Items that require a real admin account and are therefore still
**PENDING** (do after §5):

- [ ] `profiles.is_active = false` denies/signs out an otherwise-valid
      session
- [ ] Authenticated Supabase Auth user with no `profiles` row is denied
- [ ] `editor` cannot perform a `super_admin`-only action (e.g. cannot
      read/write another user's `profiles` row)
- [ ] `super_admin` has full CMS + profiles access
- [ ] Signing out via the admin shell revokes `/admin` access on the next
      request

## What was NOT done in Phase 2A (by design)

- No content was migrated from `src/data/*.ts` into Supabase.
- No CMS create/edit/publish UI was built (schema + RLS only).
- No user-management UI was built (the authorization foundation —
  `profiles`, roles, `is_active`, RLS — is in place; the UI is Phase 2B).
- No administrator account was created — see §5 for the exact next step.
