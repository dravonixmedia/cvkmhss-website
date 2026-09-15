# Supabase setup — CVKM HSS admin backend (Phase 2A)

## Status

No dedicated CVKM Supabase project exists yet. This session had live access
to exactly one Supabase project ("dravonixmedia's Project", ref
`lshfkxirfbjwlklqwqnf`, org `dravonix-whatsapp-ai-platform`) — a shared
Dravonix account project unrelated to this school. Per explicit instruction,
it was **not** used for anything in this repository: no migration was
applied to it, no table was created in it, no credentials from it appear
anywhere in this repo.

Everything in this Phase 2A change is repository-side preparation:
SQL migrations, Supabase client code, auth pages, and this document. The
admin backend cannot actually be used (sign-in will show "Admin sign-in is
not available yet") until the steps below are carried out against a real,
dedicated CVKM Supabase project.

## 1. Create the project

1. Create a new Supabase project dedicated to CVKM HSS (not a shared
   account project). Choose a region close to India if available.
2. Note the project's URL and API keys from
   **Project Settings → API**.

## 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the real values:

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable/anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>   # server-only, keep secret
```

`.env.local` is already gitignored (`.env*` in `.gitignore`, with an
explicit `!.env.example` exception so the placeholder file itself stays
committed). Never commit real values.

In production (e.g. Vercel), set the same three variables as environment
variables in the hosting provider's dashboard — never in a committed file.

## 3. Apply the database migrations

The migrations in `supabase/migrations/` are plain, ordered SQL files and
have not been applied anywhere yet. Using the Supabase CLI:

```bash
supabase login
supabase link --project-ref <project-ref>
supabase db push
```

Or apply each file in `supabase/migrations/` in filename order through the
Supabase Dashboard's SQL editor if the CLI isn't available. Order matters —
later files depend on enums/functions/tables created by earlier ones.

This creates:

- Enums: `app_role`, `content_status`, `achievement_category`,
  `notice_category`, `gallery_category`, `download_category`
- `public.profiles` (authorization table) with RLS
- `public.is_active_admin()` / `public.is_super_admin()` helper functions
- CMS tables: `news`, `events`, `achievements`, `notices`, `downloads`,
  `gallery_albums`, `gallery_images` — every one with RLS enabled, public
  read limited to `status = 'published'`, and admin write gated on
  `is_active_admin()`
- Storage buckets (`news`, `events`, `achievements`, `gallery`,
  `documents`) — private, with policies granting public read only to
  objects referenced by a published row, and write access to active admins

## 4. Regenerate database types

`src/lib/supabase/database.types.ts` is currently a **hand-written**
placeholder kept in sync with the migrations by hand — it was not
generated from a live project, because none existed. Once the migrations
above are applied to the real project, regenerate it for real:

```bash
supabase gen types typescript --project-id <project-ref> > src/lib/supabase/database.types.ts
```

Re-check the file afterward — the hand-written version added a few
convenience `Insert`/`Update` helper types alongside the `Database` type
that the generated output won't include; keep or reintroduce whichever of
those `@/lib/auth` and `@/lib/supabase` code still relies on.

## 5. Create the first admin user and bootstrap super_admin

There is deliberately no public `/signup` route, no hardcoded admin email,
and no automatic "first user becomes admin" logic. The first super_admin
is created through a controlled, manual procedure:

1. **Create the Auth user.** In the Supabase Dashboard: **Authentication →
   Users → Add user**, and set an email + password (or use "Send invite
   link" if email sending is configured). Note the generated user's UUID.
2. **Create/verify the profile row.** A `profiles` row is not created
   automatically. Run this once in the SQL editor, replacing the UUID and
   name:

   ```sql
   insert into public.profiles (id, full_name, role, is_active)
   values ('<user-uuid-from-step-1>', 'Full Name', 'super_admin', true)
   on conflict (id) do update
     set role = 'super_admin',
         is_active = true,
         full_name = excluded.full_name;
   ```

3. **Confirm `is_active = true`:**

   ```sql
   select id, full_name, role, is_active from public.profiles where id = '<user-uuid>';
   ```

4. **Test login** at `/admin/login` with that user's email/password.
5. **Test protected route access** — after signing in you should land on
   `/admin` and see the dashboard shell with the "Super Admin" role label.

For any additional admin users afterward, repeat steps 1–2, setting
`role` to `'editor'` or `'super_admin'` as appropriate. A UI for this
(so a super_admin doesn't need SQL access) is planned for Phase 2B.

## 6. Live security testing (do this after steps 1–5)

These are the checklist items from the Phase 2A brief that require a real,
connected project and could not be executed in this session — mark each
as pass/fail once run:

- [ ] Unauthenticated request to `/admin` redirects to `/admin/login`
- [ ] Unauthenticated attempt at an admin mutation (e.g. a direct
      `supabase.from('news').insert(...)` call from a browser console
      without a session) is rejected by RLS
- [ ] A `profiles.is_active = false` user is denied admin access and/or
      signed out, even with a previously-valid session
- [ ] An authenticated Supabase Auth user with **no** `profiles` row is
      denied admin access
- [ ] An `editor` cannot perform a `super_admin`-only action (e.g. cannot
      read/write another user's `profiles` row)
- [ ] A `super_admin` has full CMS + profiles access
- [ ] Anonymous `select` on a `draft` row (any content table) returns no
      rows
- [ ] Anonymous `select` on a `published` row returns the row
- [ ] Anonymous `insert`/`update`/`delete` on any content table is denied
- [ ] Invalid login credentials show the generic
      "Unable to sign in. Please check your credentials." message only
- [ ] Signing out via the admin shell revokes access to `/admin` on the
      next request

## What was NOT done in Phase 2A (by design)

- No content was migrated from `src/data/*.ts` into Supabase.
- No CMS create/edit/publish UI was built (schema + RLS only).
- No user-management UI was built (the authorization foundation —
  `profiles`, roles, `is_active`, RLS — is in place; the UI is Phase 2B).
- Nothing in this repository touches a live database. All SQL here is
  version-controlled and unapplied until step 3 above is carried out.
