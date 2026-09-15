-- News: backs /news and /news/[slug]. Field names/shapes are chosen to
-- map cleanly onto the existing NewsArticle type (src/types/index.ts) and
-- newsArticleSchema()/JSON-LD builder (src/lib/schema.ts) without forcing
-- a rewrite of the public pages — a future data-access layer converts a
-- row into a NewsArticle by formatting published_at/updated_at into the
-- display strings NewsArticle.publishedDate/updatedDate already expect.
--
-- `category` stays a free-text field (not an enum) because the existing
-- local data model treats news categories as free-form editorial text,
-- not a fixed vocabulary.

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  category text not null,
  summary text not null,
  body text[] not null default '{}',
  featured_image text,
  author text,
  status public.content_status not null default 'draft',
  published_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint news_slug_key unique (slug),
  constraint news_slug_not_blank check (length(trim(slug)) > 0)
);

create index if not exists news_status_idx on public.news (status);
create index if not exists news_published_at_idx on public.news (published_at desc);

create trigger news_set_updated_at
  before update on public.news
  for each row
  execute function public.set_updated_at();

alter table public.news enable row level security;

create policy "news_public_read_published"
  on public.news
  for select
  to anon, authenticated
  using (status = 'published');

create policy "news_admin_manage"
  on public.news
  for all
  to authenticated
  using (public.is_active_admin())
  with check (public.is_active_admin());
