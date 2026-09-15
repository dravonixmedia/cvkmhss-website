# Supabase setup — CVKM HSS admin backend (Phase 2A)

## Status

**Connected.** A dedicated CVKM Supabase project exists and is linked:

- Project name: **cvkmhss-website**
- Project ref: **sovppydnmstzwnstczua**
- Organization: **dravonixmedia's Org**
- Region: ap-northeast-1

All 16 migrations in `supabase/migrations/` have been applied to this
project (14 from the Phase 2A foundation + 2 for the Management &
Leadership module, §8), RLS and Storage policies have been live-verified
(see §6 and §8), and `src/lib/supabase/database.types.ts` was generated
from this project's actual live schema, including `management_members`.

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

All 16 files in `supabase/migrations/` have been applied to
`sovppydnmstzwnstczua`, in order, via `mcp__Supabase__apply_migration`
(14 from the original Phase 2A foundation, 2 more — `management_members`
and its Storage bucket/policies — added for the Management & Leadership
module, §8). Live-verified afterward (`mcp__Supabase__list_migrations` /
`list_tables`): all 9 tables exist with RLS enabled, all enums/functions/
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

If applying migrations to a *new* project in the future: apply the 16
files in `supabase/migrations/` in filename order (`supabase db push`, or
paste each into the SQL editor in order). The live project's migration
history also contains several one-off, non-schema housekeeping
migrations used only for live RLS/Storage verification (seed temporary
test rows → run SET-ROLE-anon tests → clean up), from both this session
and the earlier Phase 2A one. Their net effect on the schema is zero and
they are **not** included in `supabase/migrations/` since they aren't
schema changes — see §6 and §8 for what they tested. One exception: two
inert, unreferenced metadata rows remain in `storage.objects` for the
`management` bucket (`phase2a-mgmt-test/draft.jpg` and `.../published.jpg`,
no real files behind them) — Supabase's own `storage.protect_delete()`
trigger blocks direct SQL `DELETE` on `storage.objects` even for a
privileged connection, requiring the Storage API instead (unreachable
from this sandbox — see §7). These rows are not referenced by any real or
test content row, so they are not publicly readable and don't appear
anywhere in the app; delete them via the Dashboard's Storage browser if
desired.

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
| 9 | Invalid login shows only the generic error, no internal details leaked | Playwright: submitted a nonexistent email + wrong password at the real `/admin/login` page | **PASS, but see correction below** |
| 10 | No public signup route exists | Code review + `auth.users` count check | **PASS** — no `/signup` route in `src/app`; 0 users in the project |

> **Correction (added in the Management & Leadership session):** a later
> session discovered that this sandbox's outbound network policy returns a
> persistent 403 on connections from the running app to
> `sovppydnmstzwnstczua.supabase.co` (confirmed via
> `recentRelayFailures` in the agent-proxy status — see §7 below). The
> login action's error handling returns the same generic message for
> *any* failure, including a network failure, so test 9's observed
> behavior does not distinguish "Supabase rejected these credentials"
> from "the request never reached Supabase." The **empty-generic-error
> UI behavior itself is still correct and confirmed** (exactly what a
> real invalid-login attempt should look like), and the **code-level
> logic is correct by review** (a real `signInWithPassword` call is made
> and its `error` branch taken), but the specific claim "a real
> credential-rejection round-trip to Supabase Auth was observed" should
> be treated as unconfirmed, not live-verified, from within this sandbox.
> Re-verify with a real account once created (§5) if this distinction
> matters.

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

## 7. Known sandbox limitation: outbound network access to Supabase

This development sandbox's network egress policy returns a persistent
`403` ("policy denial") on direct outbound connections from processes
running *inside* this session (the Next.js app, `curl`, Playwright's
browser) to `sovppydnmstzwnstczua.supabase.co` — confirmed via
`recentRelayFailures` in `$HTTPS_PROXY/__agentproxy/status`, both with
and without routing Node's `fetch` through the proxy
(`NODE_USE_ENV_PROXY=1`, Node ≥22.21). Per this environment's own
guidance ("do not retry or route around it — report the blocked host"),
no further workaround was attempted.

This does **not** affect:
- The Supabase MCP tools used throughout this document (`apply_migration`,
  `execute_sql`, `list_tables`, `get_advisors`, etc.) — those go through
  Anthropic's own infrastructure, not this sandbox's general egress, and
  every "live-verified" claim in this document that cites one of those
  tools is genuinely live.
- The real, deployed production site (Vercel or similar) — this is a
  sandbox-specific restriction, not a property of the CVKM Supabase
  project or the application code.

It does mean that **this sandbox cannot be used to run the actual Next.js
app against live Supabase data** for end-to-end browser testing. Anywhere
this document or a session report distinguishes LIVE VERIFIED from
CODE-LEVEL VERIFIED, "live" specifically means "executed via a Supabase
MCP tool call," not "observed through the running application," unless
stated otherwise.

## 8. Management & Leadership (public About page + Admin CMS)

The first (and, per its task's scope, only) complete CMS domain: schema,
RLS, Storage, and a full Admin CRUD UI, feeding the public `/about` page.

**Schema** (`supabase/migrations/20260101000014_management_members.sql`):
`public.management_members` — `id`, `full_name`, `designation` (free
text — no enum; do not infer hierarchy from it), `photo_path`,
`short_bio`, `display_order`, `is_featured`, `status`
(`public.content_status`, reused), `published_at`, `created_by`/
`updated_by` → `profiles`, `created_at`/`updated_at`. No `slug` — members
render inline on `/about`, not on their own route. Composite index
`(status, display_order)` covers the public query exactly.

**RLS**: same two-policy pattern as every other content table — public
`SELECT` where `status = 'published'`; `is_active_admin()`-gated `ALL` for
authenticated admins. No new roles or helper functions needed.

**Storage** (`supabase/migrations/20260101000015_management_storage.sql`):
a dedicated private bucket `management` (not a shared path in an existing
bucket — see that migration's header comment for the reasoning: bucket-
level `file_size_limit`/`allowed_mime_types` enforcement only works
cleanly per-bucket). 5MB limit, `image/jpeg`/`image/png`/`image/webp`
only, enforced by Supabase Storage itself. Policies: public read only for
objects referenced by a *published* member (mirrors every other CMS
bucket); an added admin-only `SELECT` policy (not present in the original
Phase 2A storage migration) so the Admin UI can preview draft members'
photos, which the public policy correctly does not cover.

**Admin module** (`src/lib/management/`, `src/app/admin/(protected)/management/`,
`src/components/admin/{ManagementForm,DeleteMemberForm}.tsx`):
- `/admin/management` — list with thumbnail, name/designation, status,
  featured badge, display order with ▲/▼ reorder, Edit link,
  Publish/Unpublish toggle, Delete (confirm dialog).
- `/admin/management/new` — Save as Draft / Publish (one form, two named
  submit buttons feeding a single `useActionState`-backed action).
- `/admin/management/[id]/edit` — field edits, separate Publish/Unpublish
  toggle, photo replacement (old photo deleted from Storage only after
  the row update succeeds).
- Every route/action calls `requireAdmin()` server-side — nav visibility
  is not the enforcement boundary.
- Server-side validation (`src/lib/management/validation.ts`): required
  `full_name`/`designation`, length caps, integer `display_order`,
  image-only + 5MB photo checks — enforced regardless of what the browser
  sent, per the same Server-Actions-are-public-POST-endpoints reasoning
  used throughout this app. Errors returned to the admin are always
  generic ("Could not save…"), never a raw Supabase error string.
- Photos never trust the browser-supplied filename: uploaded under
  `crypto.randomUUID().<ext>`. Deleting/replacing a photo removes the old
  Storage object (best-effort — a cleanup failure never blocks the
  surrounding save/delete).

**Public integration** (`src/app/about/page.tsx`,
`src/components/about/ManagementSection.tsx`): reads only
`getPublishedManagementMembers()` (RLS-filtered, ordered by
`display_order` then `created_at`) — no `src/data/*` involvement, no
duplication. Renders **nothing** (not an empty state) when there are zero
published members. `/about` is dynamic (`ƒ` in the build output) because
the Supabase server client reads `cookies()`, so a publish/unpublish
change is reflected on the very next request — no redeploy needed. Photos
are served via time-limited signed URLs generated server-side (the bucket
is private; `next.config.ts` allowlists the project's own Storage host
for `next/image`, derived from `NEXT_PUBLIC_SUPABASE_URL` rather than
hardcoded). Missing photos fall back to the existing `PhotoPlaceholder`
component — never a broken `<img>`. A member without a bio simply omits
that paragraph. `personSchema()` (new, additive export in
`src/lib/schema.ts`) emits Person JSON-LD only for members actually being
rendered — never fabricated.

**Editorial layout**: a single alternating-side list (not a card grid),
featured members (admin-toggled only — never inferred from
`designation`) rendered larger. See `ManagementSection.tsx`'s own comment
for the reasoning against a grid/"our team" directory look.

### Live security testing — `management_members` + Storage

All 10 tests executed via `SET ROLE anon` against seeded, then deleted,
temporary rows (same technique as §6) — genuinely live, via Supabase MCP
tools:

| # | Test | Result |
|---|------|--------|
| 1 | Anonymous reads the published test member | **PASS** — 1 visible |
| 2 | Anonymous does not see the draft test member | **PASS** — draft excluded |
| 3 | Anonymous INSERT denied | **PASS** — RLS violation |
| 4 | Anonymous UPDATE denied | **PASS** — 0 rows affected |
| 5 | Anonymous DELETE denied | **PASS** — 0 rows affected |
| 6 | Anonymous cannot read a draft member's photo object | **PASS** — 0 rows visible |
| 7 | Anonymous can read a published member's photo object | **PASS** — 1 row visible |
| 8 | Anonymous cannot upload to the `management` bucket | **PASS** — RLS violation |
| 9 | Anonymous cannot modify a `management` object | **PASS** — 0 rows affected |
| 10 | Anonymous cannot delete a `management` object | **PASS** — blocked (Supabase's own `protect_delete()` trigger, even stricter than RLS alone) |

Cleanup verified: `management_members` back to 0 rows; test result
tables dropped. (Two inert leftover `storage.objects` metadata rows
remain — see §3's note.)

### Public `/about` integration testing — partial, see §7

- **Scenario A (zero published members → section hidden, rest of page
  renders normally)**: verified — the table was genuinely empty at the
  time, confirmed independently via a live MCP query, and the rendered
  page correctly showed no Management section, no forbidden empty-state
  text, and the rest of the page (including the pre-existing, unrelated
  "Leadership" positioning-pillar text) intact.
- **Scenarios B–H (draft hidden, published shown, display_order
  respected, featured sizing, missing photo/bio handled, many members)**:
  **not** live-verified in this session. Reaching them requires the
  running app to successfully query live Supabase data, which this
  sandbox's network policy blocks (§7). These are **CODE-LEVEL VERIFIED
  ONLY** — via a successful production build (which required Next.js to
  fully type-check and statically analyze every conditional branch in
  `ManagementSection.tsx`) and manual review of that component's ordering
  (`.order("display_order").order("created_at")`), conditional rendering
  (`{member.short_bio && ...}`, `photoUrl ? <Image> : <PhotoPlaceholder>`),
  and featured-size branching (`member.is_featured ? … : …`).
- **Failure handling**: this sandbox's network restriction incidentally
  produced a real (if unintended) test of the "a Supabase query failure
  must not crash the page" requirement — confirmed: `/about` returned
  `200`, rendered completely (FAQ and all other sections present), and
  leaked no internal error/host/credential details into the HTML; the
  failure was only logged server-side.

## What was NOT done in Phase 2A (by design)

- No content was migrated from `src/data/*.ts` into Supabase, except the
  Management & Leadership module described in §8, which now reads live
  from Supabase by design (per its own task's explicit instruction).
- No CMS create/edit/publish UI was built for News/Events/Achievements/
  Notices/Downloads/Gallery (schema + RLS only) — Management & Leadership
  is the one exception, built in a dedicated follow-up task.
- No user-management UI was built (the authorization foundation —
  `profiles`, roles, `is_active`, RLS — is in place; the UI is Phase 2B).
- No administrator account was created — see §5 for the exact next step.
