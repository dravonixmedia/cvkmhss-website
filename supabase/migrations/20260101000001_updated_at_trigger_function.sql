-- Reusable trigger function that maintains `updated_at` at the database
-- level. Every table that has an `updated_at` column attaches this via a
-- BEFORE UPDATE trigger (see later migrations), so the timestamp is never
-- dependent on the browser or application code sending a correct value.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_catalog
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
