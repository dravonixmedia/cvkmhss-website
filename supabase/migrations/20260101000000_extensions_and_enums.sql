-- Phase 2A: Supabase + Auth + Security foundation
-- Extensions and shared enum types used across the admin/CMS schema.
--
-- This migration has NOT been applied to any live Supabase project yet.
-- It is version-controlled here so it can be applied via `supabase db push`
-- (or the SQL editor) once a dedicated CVKM Supabase project exists.

-- gen_random_uuid() lives in pgcrypto on Supabase-managed Postgres.
create extension if not exists pgcrypto;

-- Admin roles. Deliberately just the two roles the school workflow needs.
-- super_admin: full CMS + user management + settings.
-- editor: content management within approved CMS areas only.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('super_admin', 'editor');
  end if;
end $$;

-- Shared publication status for every CMS content table (News, Events,
-- Achievements, Notices, Downloads, Gallery albums). Draft rows must never
-- be readable by anonymous/public clients — enforced later via RLS, not
-- just hidden in the frontend.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'content_status') then
    create type public.content_status as enum ('draft', 'published');
  end if;
end $$;

-- Fixed category vocabularies, matching the existing local TypeScript types
-- in src/types/index.ts exactly (AchievementCategory, NoticeCategory,
-- GalleryCategory, DownloadCategory). Do not add categories the school has
-- not asked for.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'achievement_category') then
    create type public.achievement_category as enum (
      'academics',
      'sports',
      'arts',
      'innovation',
      'competitions',
      'recognitions'
    );
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'notice_category') then
    create type public.notice_category as enum (
      'academic',
      'admissions',
      'examination',
      'general',
      'event'
    );
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'gallery_category') then
    create type public.gallery_category as enum (
      'Campus',
      'Classrooms',
      'School Events',
      'Arts & Culture',
      'Sports',
      'NCC & NSS',
      'Student Activities',
      'Achievements',
      'Historical Photos'
    );
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'download_category') then
    create type public.download_category as enum (
      'Academic',
      'Admissions',
      'Notices',
      'Forms',
      'General'
    );
  end if;
end $$;
