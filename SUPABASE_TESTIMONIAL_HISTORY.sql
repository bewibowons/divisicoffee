-- Run once in Supabase Dashboard > SQL Editor > New query.
-- Records future inserts, edits, and deletions. It cannot restore changes
-- that happened before this trigger was installed.

create table if not exists public.testimonial_history (
  history_id bigint generated always as identity primary key,
  testimonial_id bigint,
  action text not null check (action in ('INSERT', 'UPDATE', 'DELETE')),
  changed_at timestamptz not null default now(),
  old_data jsonb,
  new_data jsonb
);

-- Keep this audit table out of the public website API.
alter table public.testimonial_history enable row level security;
revoke all on table public.testimonial_history from public, anon, authenticated;

create or replace function public.log_testimonial_history()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if (TG_OP = 'INSERT') then
    insert into public.testimonial_history
      (testimonial_id, action, old_data, new_data)
    values (new.id, TG_OP, null, to_jsonb(new));
    return new;
  elsif (TG_OP = 'UPDATE') then
    insert into public.testimonial_history
      (testimonial_id, action, old_data, new_data)
    values (new.id, TG_OP, to_jsonb(old), to_jsonb(new));
    return new;
  else
    insert into public.testimonial_history
      (testimonial_id, action, old_data, new_data)
    values (old.id, TG_OP, to_jsonb(old), null);
    return old;
  end if;
end;
$$;

revoke all on function public.log_testimonial_history() from public, anon, authenticated;

drop trigger if exists testimonials_history_trigger on public.testimonials;
create trigger testimonials_history_trigger
after insert or update or delete on public.testimonials
for each row execute function public.log_testimonial_history();
