-- Management & Leadership CMS domain. Reuses the existing
-- public.content_status enum (draft/published) rather than inventing a
-- new one. No slug/detail page — members are displayed inline on the
-- public About page, not on their own route, so (unlike News/Events/
-- Achievements/Notices/Gallery albums) there is no slug column.
--
-- `designation` is deliberately plain text, not an enum: the school may
-- use titles like Manager, Principal, Headmaster/Headmistress, Vice
-- Principal/Assistant Headmaster, PTA President, or others not yet known,
-- and no importance/hierarchy should be inferred from the text by the
-- schema or application code — only `display_order` and `is_featured`,
-- both explicitly admin-controlled, affect presentation.

create table if not exists public.management_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  designation text not null,
  photo_path text,
  short_bio text,
  display_order integer not null default 0,
  is_featured boolean not null default false,
  status public.content_status not null default 'draft',
  published_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint management_members_full_name_not_blank check (length(trim(full_name)) > 0),
  constraint management_members_designation_not_blank check (length(trim(designation)) > 0)
);

comment on table public.management_members is
  'Management & Leadership profiles shown on the public About page. '
  'designation is free text on purpose — do not add a restrictive enum '
  'or infer hierarchy/importance from it.';

-- Public retrieval is: status = published, ordered by display_order.
-- This composite index covers exactly that query.
create index if not exists management_members_public_order_idx
  on public.management_members (status, display_order);

create trigger management_members_set_updated_at
  before update on public.management_members
  for each row
  execute function public.set_updated_at();

alter table public.management_members enable row level security;

create policy "management_members_public_read_published"
  on public.management_members
  for select
  to anon, authenticated
  using (status = 'published');

create policy "management_members_admin_manage"
  on public.management_members
  for all
  to authenticated
  using (public.is_active_admin())
  with check (public.is_active_admin());
