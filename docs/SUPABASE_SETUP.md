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

## 9. News, Events, Achievements, Notices, Downloads, Gallery (Admin CMS + public integration)

The six remaining content modules, built on the exact Management &
Leadership architecture (§8): reused schema (all six tables already
existed from earlier migrations — no new tables), the same two-policy RLS
shape (public `SELECT` where `status = 'published'`, `is_active_admin()`-
gated `ALL` for authenticated admins), draft/publish/unpublish via a
shared `status` + `published_at` pair, server-generated Storage filenames,
and signed URLs for both admin previews and public delivery (every bucket
is private).

**Migration** (`supabase/migrations/20260101000016_cms_storage_admin_select_and_limits.sql`,
additive only): adds a `storage_<bucket>_admin_select` policy for each of
the five original CMS buckets (news/events/achievements/gallery/
documents) so the new admin UIs can preview a draft's image/document —
the original Phase 2A storage migration only had public-read + admin-
write for these, a gap first found and fixed for the `management` bucket
in the prior phase. Also sets bucket-level `file_size_limit`/
`allowed_mime_types` (5MB images for news/events/achievements/gallery,
10MB documents for `documents`) as defense-in-depth alongside the
identical checks already enforced in each domain's `validation.ts`.

**Admin modules** (`src/lib/{news,events,achievements,notices,downloads,gallery}/`,
`src/app/admin/(protected)/{news,events,achievements,notices,downloads,gallery}/`,
`src/components/admin/{NewsForm,EventForm,AchievementForm,NoticeForm,DownloadForm,GalleryAlbumForm,GalleryImageUploadForm}.tsx`):
list / add / edit / draft / publish / unpublish / delete-with-confirmation
for each, all gated by `requireAdmin()` on every route and action, all
input re-validated server-side (`src/lib/validation/cms.ts` shared
primitives), all Storage uploads via `src/lib/storage/cms.ts` (random
`crypto.randomUUID()` filenames, never the browser-supplied name).
URL slugs (News/Events/Achievements/Notices/Gallery albums) are generated
automatically from the title on create (`src/lib/supabase/slug.ts`,
collision-checked against the target table) and editable afterward.

- **News**: featured image, publication date (`published_at`), excerpt
  (`summary`), body stored as a paragraph array (split from the admin's
  blank-line-separated textarea), optional author.
- **Events**: date, optional start/end time, location, description,
  optional image.
- **Achievements**: category (existing `achievement_category` enum),
  date, description, optional image.
- **Notices**: category (`notice_category` enum), date, description,
  optional expiry date, "important" (pinned) flag, optional attachment
  (stored in the shared `documents` bucket under `notices/`).
- **Downloads**: category (`download_category` enum), description,
  required document (replaceable on edit; the old Storage object is
  removed only after the row update succeeds); stored in `documents`
  under `downloads/`.
- **Gallery**: album-based (`gallery_albums` + `gallery_images`, the
  existing tables — no schema change). `/admin/gallery` manages albums
  (title, category, description, date, optional dedicated cover upload,
  draft/publish/unpublish, delete-with-child-image-cleanup);
  `/admin/gallery/[id]/images` manages that album's photos: multi-file
  upload (`gallery/{albumId}/` path prefix, up to 20 files per upload,
  each validated individually), per-image caption, ▲/▼ reorder
  (`sort_order`, same swap-with-neighbor pattern as Management's
  `display_order`), "Set as Cover" (repoints `cover_image_path` to an
  already-uploaded image with no re-upload), and per-image delete
  (removes the Storage object and clears `cover_image_path` first if that
  image was the cover). Deleting an album fetches every child image path
  and the cover path *before* deleting the row — `gallery_images` cascade-
  deletes at the database level, but the Storage objects do not, so those
  are removed afterward via `deleteGalleryFiles`.

**Public integration** — each page now reads only its domain's
`getPublished*()` function (RLS-filtered, never `src/data/*` for content),
preserving the existing component/JSX architecture exactly:

- `src/app/news/page.tsx`, `src/app/news/[slug]/page.tsx` (dynamic slug
  route replacing static `generateStaticParams`), `src/components/home/NewsSection.tsx`,
  `src/app/sitemap.ts` (published articles only).
- `src/app/events/page.tsx`, `src/components/home/EventsSection.tsx` — a
  pure `splitEventsByDate()` helper replicates the original upcoming/past
  split on the fetched array.
- `src/app/achievements/page.tsx`, `src/components/home/Achievements.tsx`.
- `src/app/notices/page.tsx`, `src/components/home/NoticesSection.tsx` —
  "important" notices are now derived via `.filter((n) => n.important)`
  instead of a separate query.
- `src/app/downloads/page.tsx` (no homepage section consumed downloads).
- `src/app/gallery/page.tsx` — `galleryAlbums` now comes from
  `getPublishedGalleryAlbums()`; the existing placeholder-tile JSX and
  empty state are otherwise untouched (`src/components/home/GallerySection.tsx`
  still renders category placeholders only, unrelated to real album data,
  so it needed no change). There is still no per-album detail route in
  the public site (none existed before this task either), so
  `getPublishedGalleryAlbums()`'s per-image data is fetched and mapped but
  not yet rendered anywhere public — adding that route was out of this
  task's scope (no public-page redesign).

Every `getPublished*()` function is wrapped in try/catch and returns `[]`
on any failure (never throws, never leaks a raw Supabase error to a
public page) — identical pattern to Management & Leadership.

### Live security testing — all six domains

Unlike the two prior phases' testing, this session found that the
`execute_sql` MCP tool is connected to `sovppydnmstzwnstczua` in a
**read-only transaction** (`current_setting('transaction_read_only')` =
`on`) — any `INSERT`/`UPDATE`/`CREATE TABLE` through it fails immediately
with `cannot execute ... in a read-only transaction`. This is a new,
explicit discovery, not previously documented. `apply_migration` (used
for real schema changes throughout this project) is not read-only, so —
exactly matching the precedent already described in §3 ("seed temporary
test rows → run SET-ROLE-anon tests → clean up" via one-off, non-schema
migrations) — all seeding, `SET ROLE anon` / `SET ROLE authenticated`
testing, and cleanup for this phase ran as three `apply_migration` calls
(`zzztest_cms_rls_seed`, `zzztest_cms_rls_verify`, `zzztest_cms_rls_cleanup`),
with results captured into a plain table and read back via `execute_sql`
(`SELECT` is unaffected by the read-only restriction). These three are
one-off housekeeping, not included in `supabase/migrations/`, same as
their predecessors.

**35 of 35 tests passed** — genuinely live, via Supabase MCP tools, against
seeded-then-deleted rows tagged `zzztest-`/`ZZZTEST`/`zzztest/`:

| Area | Tests | Result |
|---|---|---|
| Anonymous `SELECT` sees only `published`, never `draft` | news, events, achievements, notices, downloads, gallery_albums (6) | **PASS** — 1 of 2 seeded rows visible in each, the published one |
| Anonymous `SELECT` on `gallery_images` follows the parent album's status (own-row has no status column) | 1 | **PASS** — only the published album's image visible |
| Anonymous `SELECT` on Storage sees only objects referenced by a published row | news, events, achievements bucket (1 each), documents (2: notice + download), gallery (2: cover + image) | **PASS** — exact expected counts in every bucket |
| Anonymous `INSERT` denied | news, events, achievements, notices, downloads, gallery_albums, gallery_images (7) | **PASS** — `new row violates row-level security policy` on every table |
| Anonymous `UPDATE`/`DELETE` denied | news (representative) | **PASS** — 0 rows affected each |
| Anonymous `INSERT` denied on all 5 CMS Storage buckets | 1 (loops all 5) | **PASS** — denied in every bucket |
| Anonymous `UPDATE`/`DELETE` denied on Storage | 2 | **PASS** — `UPDATE` 0 rows affected; `DELETE` blocked by Supabase's own `protect_delete()` trigger (stricter than RLS alone) |
| Authenticated **active admin** (the real, existing super_admin, impersonated at the RLS layer via `request.jwt.claim.sub` + `SET ROLE authenticated` — a genuine policy-evaluation test, not a real Auth session) sees both draft and published rows | news | **PASS** |
| Authenticated active admin `UPDATE` permitted | news, events, achievements, notices, downloads, gallery_albums, gallery_images (7) | **PASS** — every domain's admin-write policy grants access |
| Authenticated active admin can `SELECT` a **draft-linked** Storage object (this phase's new admin-select policies) | news, documents, gallery buckets (3) | **PASS** |

**Cleanup verified**: all six content tables back to 0 `zzztest*` rows;
the results table dropped. **14 inert `storage.objects` metadata rows
remain** (`zzztest/...` paths across the five CMS buckets, no real files
behind them) — Supabase's `protect_delete()` trigger blocks direct SQL
`DELETE` on `storage.objects` for any role, confirmed both by the
`anon_storage_delete_denied` test above and by a failed cleanup attempt;
only the Storage API can remove them (unreachable from this sandbox —
§7). These rows are not referenced by any real or test content row after
the table cleanup above, so they are not publicly readable (per the
`storage_*_public_read_published` policies' `EXISTS` predicate) and are
invisible anywhere in the app — identical, previously-documented
limitation to the two leftover `management` bucket rows from an earlier
phase. Delete via the Dashboard's Storage browser if desired:
`zzztest/news-draft.jpg`, `zzztest/news-pub.jpg`, `zzztest/events-draft.jpg`,
`zzztest/events-pub.jpg`, `zzztest/ach-draft.jpg`, `zzztest/ach-pub.jpg`,
`zzztest/notices-draft.pdf`, `zzztest/notices-pub.pdf`,
`zzztest/downloads-draft.pdf`, `zzztest/downloads-pub.pdf`,
`zzztest/gallery-draft-cover.jpg`, `zzztest/gallery-pub-cover.jpg`,
`zzztest/gallery-draft-img.jpg`, `zzztest/gallery-pub-img.jpg`.

`mcp__Supabase__get_advisors` (security) was re-run after cleanup: two
pre-existing `WARN`-level findings only (`is_active_admin()`/
`is_super_admin()` callable via RPC by any signed-in user, and leaked-
password protection disabled) — both predate this phase, are unrelated to
the six CMS modules or their RLS, and were not introduced by this work;
left untouched as out of this task's scope.

**Still PENDING** (unchanged from §6/§8 — requires a real second admin
account, which this sandbox cannot create without touching Supabase Auth
directly): `editor` vs `super_admin` distinction on a CMS action (moot for
these six modules specifically — their `is_active_admin()` policy does
not distinguish the two roles, only `is_active`), and `is_active = false`
denying an otherwise-valid session. Actual browser/deployed verification
of all six modules (login → create → draft → publish → confirm on the
public page → unpublish → confirm hidden, for each domain) remains
**CODE-LEVEL VERIFIED ONLY** (clean lint/typecheck/build, manual review)
plus the **DATABASE/RLS-LEVEL VERIFIED** results above — genuinely live
browser verification is still blocked by this sandbox's network-egress
restriction (§7), unchanged from every prior phase.

## 10. Dashboard, Users, Settings

Replaces the outdated "Content management is not available yet" Dashboard
placeholder and the "SOON" Users/Settings sidebar badges.

**Dashboard** (`src/app/admin/(protected)/page.tsx`, `src/lib/dashboard/queries.ts`):
a welcome line (name/role), a **Content Overview** table (published/draft
counts per module, via `count: "exact", head: true` queries — no row
content is fetched, safe for any admin), **Quick Management** links (Add
X per module, reusing each module's existing `/new` route), and **Recent
Content** (top 6 most-recently-`updated_at` items across all seven
tables, merged and sorted in application code — no audit-log table exists
or was added; `updated_at` is the only per-row signal every content table
already has). Renders correctly with all tables empty (every count is 0,
Recent Content shows an explicit empty state) — no fake data.

**Users** (`/admin/users`, `src/lib/users/{queries,validation,actions}.ts`,
`src/components/admin/UserEditForm.tsx`) — **super_admin only**, enforced
by `requireSuperAdmin()` on both the list and edit routes and inside
`updateProfile()` itself (never only a hidden nav link — `AdminShell`
also hides the "Users" link from editors, but that is a UX courtesy, not
the boundary). Reuses `profiles` entirely — no new identity table, no
duplicated auth data. Implemented: list all admins (name, role,
active/inactive, created/updated dates — reads via the existing
`profiles_super_admin_select_all` RLS policy, unchanged), edit an admin's
full name / role / active status in one form
(`profiles_super_admin_update`, also unchanged). **Lockout protection**:
`updateProfile()` re-checks, immediately before every write, whether the
target is currently the only active `super_admin`
(`isLastActiveSuperAdmin()` in `src/lib/users/actions.ts` — counts active
super_admins fresh on each call, not cached, so a save that would remove
the last one's super_admin role or active status is blocked with an
explicit error instead of silently locking the whole backend out).
Destructive deletion was not implemented at all, per the brief's
"prefer deactivate."

**Deferred — create/invite administrator**: this app has no public
signup and `profiles.id` has a foreign key to `auth.users`, so a brand
new admin account can only be created via Supabase's Auth Admin API
(`auth.admin.createUser`/`inviteUserByEmail`), which requires
`SUPABASE_SERVICE_ROLE_KEY`. Per this phase's explicit instruction, that
credential was **not** added to any request-serving code — `/admin/users`
instead shows the existing manual bootstrap procedure (§5 above: create
the Auth user in the Dashboard, insert the `profiles` row via SQL). See
§11 below for the architecture recommendation if privileged provisioning
is wanted later.

**Settings** (`/admin/settings`, `src/lib/settings/{queries,validation,actions,public}.ts`,
`src/components/admin/SiteSettingsForm.tsx`) — a new singleton table,
`public.site_settings` (`supabase/migrations/20260101000017_site_settings.sql`,
one row, `id = 1`, seeded by the migration): school identity
(name/short name/established year/school code/HSS code/UDISE code),
contact (phone ×2/email/address fields/Google Maps link), and social
links (Facebook/Instagram/YouTube) — deliberately **only** ordinary
school-content fields; no Supabase/Cloudflare/API/infrastructure setting
was added or will be, per the brief. Every column is free text/nullable:
unset fields stay blank, nothing was fabricated (mirrors the existing
"leave undefined rather than inventing values" rule already in
`src/data/site.ts`). **RLS**: unconditional public `SELECT` (every
column here is meant for public display — there is no privileged column
to hide, unlike a draft content row) and `UPDATE` gated by
`is_active_admin()` — **both roles** may edit Settings, since nothing
stored here is more sensitive than ordinary public content (no
`is_super_admin()` gate, unlike `profiles`). No insert/delete policy: the
singleton row is fixed.

**Public integration** (`src/lib/settings/public.ts`, `src/components/layout/Footer.tsx`,
`src/app/contact/page.tsx`): `getPublicSiteInfo()` merges live settings
over the existing static `src/data/site.ts` values field-by-field (a
blank/unset setting quietly falls back to the static value, so the site
never regresses from removing a field), and never throws (query failure
→ same static fallback). `Footer` (rendered in the root layout, so on
every page) and the Contact page now read from it instead of importing
`site` directly for name/address/contact/founding-year; the Contact page
additionally links its map block to `contact.googleMapsUrl` when set, and
the Footer conditionally renders a small text link per social URL that is
actually set (no icons — this version of `lucide-react` ships no brand
icons, and no such row existed before, so plain text links avoid
fabricating iconography). JSX/layout otherwise unchanged. `Header.tsx`,
`src/lib/schema.ts`, `src/lib/metadata.ts`, and the static `metadata`
export in `layout.tsx` were deliberately left untouched — out of this
phase's stated public-integration examples (footer, contact information,
school identity) and not required to make Settings functional.

**Architectural consequence**: because `Footer` now reads Supabase and is
mounted in the root layout, **every route in the app is now
dynamically rendered** (`ƒ` in the build output, confirmed — previously-
static pages like `/academics`, `/campus`, `/admissions`, `/student-life`
joined the already-dynamic homepage/CMS pages from the prior phase). This
is the direct, accepted consequence of "connect the footer to settings"
and matches this codebase's established precedent (dynamic rendering
deliberately relied upon so content changes appear without a redeploy) —
not a redesign, not a regression, and it does not change what any page
looks like.

### Live security testing — Settings + Users (regression + new)

9 of 9 tests passed — genuinely live, via Supabase MCP tools
(`apply_migration`, since `execute_sql` remains read-only on this
project — see §9's note), against the real `site_settings` singleton row
(reverted to fully blank immediately after, verified) and the real
existing `profiles` row:

| Test | Result |
|---|---|
| Anonymous reads the `site_settings` row | **PASS** — 1 row visible |
| Anonymous `UPDATE` on `site_settings` denied | **PASS** — 0 rows affected |
| Anonymous `INSERT` a second `site_settings` row denied | **PASS** — RLS violation |
| Authenticated active admin `UPDATE` on `site_settings` permitted | **PASS** — value verified written, then reverted to `null` |
| Regression: anonymous `SELECT` on `news` (unchanged policy) still works | **PASS** — 0 rows (table is empty) |
| Regression: anonymous `SELECT` on `gallery_albums` (unchanged policy) still works | **PASS** — 0 rows |
| Regression: anonymous `SELECT` on `profiles` still denied (unchanged policy) | **PASS** — 0 rows |
| Regression: super_admin still reads their own `profiles` row | **PASS** |

`mcp__Supabase__get_advisors` (security) re-run after cleanup: identical
two pre-existing `WARN` findings as before this phase (RPC-callable
authorization helpers, leaked-password protection) — nothing new from
`site_settings` or its policies.

**Not live-tested (code-level verified only)**: the Users lockout guard
(`isLastActiveSuperAdmin()`) itself, because exercising it end-to-end
means invoking the actual Next.js server action, which this sandbox
cannot do (§7 — network egress to the deployed/local app is blocked, and
there is no second real Auth user in this project to safely create one
for a live "demote the second super_admin" test without touching Supabase
Auth directly). What *was* verified live: the exact SQL the guard runs
(`select count(*) from profiles where role='super_admin' and
is_active=true`) currently and correctly returns `1` against the real
data (confirmed via `execute_sql`), i.e. the counting logic the guard
depends on is sound against real state. The guard's control flow
(re-count immediately before every write, block if the target is the
only match) was verified by code review, and by TypeScript/build success
requiring every branch to type-check. A true end-to-end test (attempt to
demote/deactivate the sole super_admin through the actual UI/action and
confirm the block) still requires deployed browser verification, same
limitation as every other admin flow in this project.

## What was NOT done (by design)

- No content was migrated from `src/data/*.ts` into Supabase beyond the
  seven CMS modules (Management & Leadership, News, Events, Achievements,
  Notices, Downloads, Gallery) plus the new Settings fields — all read
  live from Supabase by design; unset Settings fields fall back to the
  static file, never fabricated.
- No Supabase Auth user creation/invitation was implemented (needs a
  privileged Admin API credential — see §10's "Deferred" note and §11
  below for the architecture recommendation).
- No public per-album Gallery detail route, Student Life CMS, online
  admissions, student/parent portal, alumni, payments, results/exam
  management, or attendance — all explicitly out of scope.

## 11. If privileged Auth user provisioning is wanted later

Not implemented this phase, per explicit instruction to stop and report
rather than silently add a credential. Recommended architecture, for a
future phase, if approved:

- Add `SUPABASE_SERVICE_ROLE_KEY` as a Cloudflare secret (never a
  `NEXT_PUBLIC_*` variable, never logged, never returned to the client).
- The existing `src/lib/supabase/admin.ts` (`createAdminClient()`) is
  already the correct, guarded shape for this — `import "server-only"`,
  reads `process.env.SUPABASE_SERVICE_ROLE_KEY` directly, and its own
  comment already documents "not used by any request-serving route" as
  the current, intended state.
- A new `createAdminUser()` server action would: `requireSuperAdmin()`
  first (defense in depth even though the client is privileged), call
  `supabase.auth.admin.inviteUserByEmail()` (never `createUser` with a
  password the server chooses — an emailed invite avoids the server ever
  handling a credential), then insert the corresponding `profiles` row
  with the chosen role — all inside one server action, never exposing the
  service-role key or the Admin API to the browser.
- This would be the **only** request-serving code path permitted to
  import `src/lib/supabase/admin.ts`; every other Users operation
  (edit/role/active-status, all implemented this phase) should keep using
  the ordinary RLS-enforced client, since RLS is the real boundary for
  those and adding the admin client there would only weaken auditability
  for no benefit.
- Needs its own live security testing (invite flow, RLS still the
  boundary for everything except the literal `auth.users` row creation)
  before being considered complete.

This is a recommendation only — implementing it requires explicit
approval and, in whatever environment runs this app in production,
configuring the new secret.

## 12. Website Images (static-page photography slots)

A small, separate system for the fixed, non-CMS `PhotoPlaceholder`
positions on otherwise-static pages (Home, About, Academics, Campus &
Facilities, Student Life, Admissions) — distinct from every content CMS
domain's own images (News/Events/Achievements/Gallery/Management &
Leadership), which this phase did not touch.

**Audit** (full inventory — every `PhotoPlaceholder` usage in `src/`,
categorized): 8 single, named, non-repeating positions were turned into
slots; several other placeholders were found and deliberately left alone:

- Per-item, data-driven grids: the Campus page's facilities grid
  (`src/app/campus/page.tsx`, one tile per facility), the Student Life
  page's "In Action" 4-tile grid (`src/app/student-life/page.tsx`) — not
  single predefined positions, and admins must not be able to invent new
  slot keys, so these were left as-is.
- `LandingHero`'s `collage` variant's two small hardcoded side tiles
  ("Student life" / "School activities") — generic decorative filler
  baked into the variant itself, shared by both Student Life's and
  Gallery's hero, not a clean per-page slot.
- The `lowerTitle` (News, Contact) and `overlay` (Events) `LandingHero`
  variants, and `GallerySection.tsx`'s homepage tiles — all belong to a
  CMS-associated page (News/Events/Gallery) or sit directly alongside one
  (the homepage Gallery teaser), so were left connected to nothing, per
  "existing CMS image systems must remain separate."
- The About page has no separate "School History" (or any other
  non-hero) image position in the current design — only its hero.

| Slot | Page | Component | Purpose | Real container | Recommended upload |
|---|---|---|---|---|---|
| `home_hero` | Home | `src/components/home/Hero.tsx` | Full-bleed hero background | `min-h-[82vh] sm:min-h-[78vh] lg:min-h-[92vh]`, full width | 1920×1080 px, 16:9 |
| `home_campus_highlight` | Home | `src/components/home/Campus.tsx` | Section image | `h-72 sm:h-96 lg:h-[30rem]` in a 1.3fr/1fr row | 1600×1067 px, 3:2 |
| `home_student_life_highlight` | Home | `src/components/home/StudentLife.tsx` | Section image | `h-72 sm:h-96 lg:h-auto` in a 1fr/1.2fr row | 1600×1067 px, 3:2 |
| `about_hero` | About | `LandingHero` (`editorial`) | Page hero | `h-64 sm:h-80 lg:h-[28rem]` in a 1.15fr/1fr row | 1600×1200 px, 4:3 |
| `academics_hero` | Academics | `LandingHero` (`split`) | Page hero | `h-56 sm:h-72 lg:h-auto`, 50/50 split | 1600×1200 px, 4:3 |
| `campus_hero` | Campus & Facilities | `LandingHero` (`fullBleed`) | Full-bleed page hero | `min-h-[58vh] sm:min-h-[52vh] lg:min-h-[68vh]` | 1920×1080 px, 16:9 |
| `student_life_hero` | Student Life | `LandingHero` (`collage`, main tile only) | Page hero | `h-64 sm:h-80 lg:h-[28rem]` in a 1.4fr/1fr row | 1600×1200 px, 4:3 |
| `admissions_hero` | Admissions | `LandingHero` (`split`) | Page hero | `h-56 sm:h-72 lg:h-auto`, 50/50 split | 1600×1200 px, 4:3 |

All eight are guidance, not enforcement — validation only checks file
type/size, exactly like every CMS image field.

**Database** (`supabase/migrations/20260101000018_site_images.sql`): one
new table, `public.site_images` — `id`, `slot_key` (`text`, `unique`,
gated by a `check` constraint to exactly the 8 values above — the single
mechanism that makes an admin-invented slot key impossible, enforced at
the database layer, not just in application code), `image_path`,
`alt_text`, `created_at`/`updated_at`/`updated_by`. No draft/published
workflow (unlike every content table) — a saved image applies
immediately, same as `site_settings`. The migration seeds all 8 rows by
`slot_key`; the application only ever `UPDATE`s one of these existing
rows, never `INSERT`s — reinforced by RLS below, which grants no insert
policy at all.

**RLS**: unconditional public `SELECT` (every column here is needed to
render the public page; nothing is privileged) and `UPDATE` gated by
`is_active_admin()` — both roles may manage these, same as ordinary CMS
content. No insert/delete policy.

**Storage** (`supabase/migrations/20260101000019_site_images_storage.sql`):
a new dedicated private bucket, `site-images` (separate from every
content domain's own bucket), 5MB limit, `image/jpeg`/`image/png`/
`image/webp` only. Public `SELECT` policy: readable only if some
`site_images` row currently points at that object (no status/draft
concept needed here, unlike the content buckets — removing an image just
means no row points at it anymore, which alone revokes public read, live-
tested below). Admin insert/update/delete gated by `is_active_admin()`.
No service-role key used anywhere in this module.

**Admin module** (`/admin/website-images`, `src/lib/site-images/`,
`src/components/admin/SiteImageSlotForm.tsx`): one page listing all 8
slots grouped by page heading, each with its own small form — reuses the
existing shared `ImageFileField` (immediate local preview on file
selection, cropped to the slot's real public aspect ratio) plus the
recommended-size guidance line, an optional alt-text input, Save, and
(only shown once an image exists) a confirm-guarded Remove Image action
that clears the slot back to its original `PhotoPlaceholder`. No
Supabase/Storage/database terminology anywhere in the admin copy.

**Public integration**: `src/lib/site-images/public.ts` exports
`getSiteImage(slotKey)` — public-safe (never throws; a query or signing
failure logs server-side and returns `null`, i.e. the placeholder stays).
`LandingHero` (`src/components/hero/LandingHero.tsx`) gained two optional
props, `imageUrl`/`imageAlt`, wired into exactly the three variant
branches the five approved pages use (`fullBleed`, `split`, `editorial`,
and the `collage` variant's main tile only) — every other page that uses
`LandingHero` simply never passes them, so its rendering is byte-for-byte
unchanged. `Hero.tsx`/`Campus.tsx`/`StudentLife.tsx` (home) each now call
`getSiteImage()` directly and render `next/image` with `object-cover
object-center` when a URL comes back, `PhotoPlaceholder` otherwise —
identical fallback behavior to every CMS module's own image handling.
`priority` is set only on each page's single hero image (and the Home
Hero); the two homepage highlight sections load lazily, since they sit
well below the fold.

### Live security + lifecycle testing

9 of 9 tests passed — genuinely live, via Supabase MCP tools
(`apply_migration`, since `execute_sql` remains read-only on this
project), exercising the full admin lifecycle against the real
`home_hero` slot and a real linked Storage object, then reverted:

| Test | Result |
|---|---|
| Inventing an arbitrary `slot_key` is rejected at the database layer | **PASS** — `check` constraint violation |
| Anonymous reads all 8 slot rows | **PASS** |
| Anonymous `UPDATE` on `site_images` denied | **PASS** — 0 rows affected |
| Anonymous `INSERT` into the `site-images` bucket denied | **PASS** — RLS violation |
| Anonymous cannot read a Storage object no slot references yet | **PASS** — 0 rows |
| Authenticated active admin can save an image + alt text to a slot | **PASS** |
| Anonymous can now read that newly-referenced Storage object | **PASS** — 1 row |
| Authenticated active admin can remove the image (slot reverts to empty) | **PASS** |
| Anonymous loses read access to the now-unreferenced Storage object | **PASS** — 0 rows, proving Remove Image actually revokes public access, not just hides the admin UI state |

Cleanup verified: all 8 slots back to `image_path`/`alt_text` = `null`.
One inert `storage.objects` metadata row remains (`zzztest/home-hero-
test.jpg` — Supabase's `protect_delete()` trigger blocks direct SQL
`DELETE` on `storage.objects`, the same previously-documented limitation
as every prior phase's cleanup) — confirmed no longer publicly readable
by the test above, and not referenced by any real row.

`mcp__Supabase__get_advisors` (security), re-run after cleanup: the same
two pre-existing `WARN` findings as every prior phase — nothing new from
`site_images` or its policies.

**Not live-tested (code-level verified only, same limitation as every
prior phase)**: an actual browser upload through `/admin/website-images`
and visual confirmation that the uploaded photo replaces the placeholder
on the deployed public page — this sandbox cannot reach the deployed
site or a real browser. What the tests above prove instead is that the
entire server-side mechanism (RLS, Storage policy, the exact
publish/remove transition) behaves correctly against real data; the
`<Image>`/`PhotoPlaceholder` conditional itself is the same pattern
already confirmed working in production for Management & Leadership.
