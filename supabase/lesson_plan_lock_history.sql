-- Lesson plan lock history.
-- Append-only audit log of every lock / unlock on public.lesson_plan_locks.
-- Rows are written by a trigger, so the app can't skip logging, and there
-- are no insert/update/delete policies, so nobody can edit history from the
-- app (the trigger runs as security definer and bypasses RLS).
--
-- Run once in the Supabase SQL editor, after lesson_plan_locks.sql.

create table if not exists public.lesson_plan_lock_history (
  id uuid primary key default gen_random_uuid(),
  school_year text not null,
  term smallint not null,
  week smallint not null,
  action text not null check (action in ('locked', 'unlocked')),
  actor_id uuid,
  -- Snapshot of the actor's name at the time, so history still reads
  -- correctly if the user is renamed or deleted later.
  actor_name text,
  created_at timestamptz not null default now()
);

create index if not exists lesson_plan_lock_history_week_idx
  on public.lesson_plan_lock_history (school_year, term, week, created_at desc);

alter table public.lesson_plan_lock_history enable row level security;

-- Only admins can read history.
drop policy if exists "lesson_plan_lock_history_select_admin" on public.lesson_plan_lock_history;
create policy "lesson_plan_lock_history_select_admin"
  on public.lesson_plan_lock_history
  for select
  to authenticated
  using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role = 'admin'
    )
  );

create or replace function public.log_lesson_plan_lock_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.lesson_plan_locks;
  v_actor uuid := auth.uid();
  v_name text;
begin
  if tg_op = 'INSERT' then
    v_row := new;
  else
    v_row := old;
  end if;

  select full_name into v_name from public.users where id = v_actor;

  insert into public.lesson_plan_lock_history
    (school_year, term, week, action, actor_id, actor_name)
  values (
    v_row.school_year,
    v_row.term,
    v_row.week,
    case when tg_op = 'INSERT' then 'locked' else 'unlocked' end,
    v_actor,
    v_name
  );

  return null;
end;
$$;

drop trigger if exists lesson_plan_locks_history on public.lesson_plan_locks;
create trigger lesson_plan_locks_history
  after insert or delete on public.lesson_plan_locks
  for each row execute function public.log_lesson_plan_lock_change();
