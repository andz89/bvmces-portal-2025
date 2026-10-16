-- Lesson plan upload locks.
-- A row here means teachers can no longer upload a lesson plan for that
-- school year / term / week. Locks always win over the Fri–Mon submission
-- window and the "upload_lesson_plan" override in the settings table.
--
-- Run once in the Supabase SQL editor.

create table if not exists public.lesson_plan_locks (
  id uuid primary key default gen_random_uuid(),
  school_year text not null,
  term smallint not null check (term between 1 and 3),
  week smallint not null check (week between 1 and 15),
  locked_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (school_year, term, week)
);

alter table public.lesson_plan_locks enable row level security;

-- Every signed-in user can read locks (teachers need them to know which
-- weeks are closed, and the upload route checks them as the teacher).
drop policy if exists "lesson_plan_locks_select" on public.lesson_plan_locks;
create policy "lesson_plan_locks_select"
  on public.lesson_plan_locks
  for select
  to authenticated
  using (true);

-- Only admins can lock or unlock.
drop policy if exists "lesson_plan_locks_insert_admin" on public.lesson_plan_locks;
create policy "lesson_plan_locks_insert_admin"
  on public.lesson_plan_locks
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role = 'admin'
    )
  );

drop policy if exists "lesson_plan_locks_delete_admin" on public.lesson_plan_locks;
create policy "lesson_plan_locks_delete_admin"
  on public.lesson_plan_locks
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role = 'admin'
    )
  );
