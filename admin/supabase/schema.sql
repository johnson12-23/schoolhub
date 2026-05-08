create extension if not exists "pgcrypto";

create type admin_role as enum ('super_admin', 'teacher_admin', 'accountant_admin', 'moderator');
create type admin_status as enum ('active', 'suspended');
create type attendance_status as enum ('present', 'absent', 'late');
create type payment_status as enum ('paid', 'pending', 'partial', 'overdue');
create type message_status as enum ('read', 'unread');

create table roles (
  id uuid primary key default gen_random_uuid(),
  name admin_role not null unique,
  permissions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table admins (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role admin_role not null default 'moderator',
  status admin_status not null default 'active',
  avatar_url text,
  created_at timestamptz not null default now()
);

create table teachers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  phone text,
  address text,
  avatar_url text,
  salary_status payment_status not null default 'pending',
  attendance_rate numeric not null default 0,
  created_at timestamptz not null default now()
);

create table classes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  level text not null,
  class_teacher_id uuid references teachers(id) on delete set null,
  timetable jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  teacher_id uuid references teachers(id) on delete set null,
  created_at timestamptz not null default now()
);

create table students (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  gender text not null,
  date_of_birth date not null,
  class_id uuid references classes(id) on delete set null,
  email text not null unique,
  phone text,
  address text,
  guardian_name text not null,
  guardian_phone text not null,
  guardian_email text,
  admission_number text not null unique,
  photo_url text,
  created_at timestamptz not null default now()
);

create table teacher_subjects (
  teacher_id uuid references teachers(id) on delete cascade,
  subject_id uuid references subjects(id) on delete cascade,
  class_id uuid references classes(id) on delete cascade,
  primary key (teacher_id, subject_id, class_id)
);

create table attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  class_id uuid references classes(id) on delete set null,
  marked_by uuid references admins(id) on delete set null,
  status attendance_status not null,
  attendance_date date not null default current_date,
  note text,
  created_at timestamptz not null default now(),
  unique (student_id, attendance_date)
);

create table results (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  subject_id uuid not null references subjects(id) on delete cascade,
  class_id uuid references classes(id) on delete set null,
  term text not null,
  exam_name text not null,
  score numeric not null check (score >= 0 and score <= 100),
  gpa numeric,
  remarks text,
  created_at timestamptz not null default now()
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  amount numeric not null check (amount >= 0),
  balance numeric not null default 0,
  status payment_status not null default 'pending',
  paystack_reference text unique,
  invoice_number text unique,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  audience text not null default 'all',
  pinned boolean not null default false,
  scheduled_at timestamptz,
  created_by uuid references admins(id) on delete set null,
  created_at timestamptz not null default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  body text not null,
  status message_status not null default 'unread',
  reply text,
  replied_by uuid references admins(id) on delete set null,
  replied_at timestamptz,
  created_at timestamptz not null default now()
);

create table school_settings (
  id uuid primary key default gen_random_uuid(),
  school_name text not null default 'SchoolHub',
  logo_url text,
  address text,
  smtp_settings jsonb not null default '{}'::jsonb,
  notification_settings jsonb not null default '{}'::jsonb,
  theme jsonb not null default '{"primary":"#2563EB","accent":"#F2B84B"}'::jsonb,
  updated_at timestamptz not null default now()
);

create or replace function is_active_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from admins
    where auth_user_id = auth.uid()
      and status = 'active'
  );
$$;

alter table roles enable row level security;
alter table admins enable row level security;
alter table teachers enable row level security;
alter table classes enable row level security;
alter table subjects enable row level security;
alter table students enable row level security;
alter table teacher_subjects enable row level security;
alter table attendance enable row level security;
alter table results enable row level security;
alter table payments enable row level security;
alter table announcements enable row level security;
alter table messages enable row level security;
alter table school_settings enable row level security;

create policy "active admins can read roles" on roles for select using (is_active_admin());
create policy "super admins manage roles" on roles for all using (exists (select 1 from admins where auth_user_id = auth.uid() and role = 'super_admin' and status = 'active')) with check (exists (select 1 from admins where auth_user_id = auth.uid() and role = 'super_admin' and status = 'active'));

create policy "active admins read admins" on admins for select using (is_active_admin());
create policy "super admins manage admins" on admins for all using (exists (select 1 from admins where auth_user_id = auth.uid() and role = 'super_admin' and status = 'active')) with check (exists (select 1 from admins where auth_user_id = auth.uid() and role = 'super_admin' and status = 'active'));

create policy "active admins manage teachers" on teachers for all using (is_active_admin()) with check (is_active_admin());
create policy "active admins manage classes" on classes for all using (is_active_admin()) with check (is_active_admin());
create policy "active admins manage subjects" on subjects for all using (is_active_admin()) with check (is_active_admin());
create policy "active admins manage students" on students for all using (is_active_admin()) with check (is_active_admin());
create policy "active admins manage teacher subjects" on teacher_subjects for all using (is_active_admin()) with check (is_active_admin());
create policy "active admins manage attendance" on attendance for all using (is_active_admin()) with check (is_active_admin());
create policy "active admins manage results" on results for all using (is_active_admin()) with check (is_active_admin());
create policy "active admins manage payments" on payments for all using (is_active_admin()) with check (is_active_admin());
create policy "active admins manage announcements" on announcements for all using (is_active_admin()) with check (is_active_admin());
create policy "active admins manage messages" on messages for all using (is_active_admin()) with check (is_active_admin());
create policy "active admins manage settings" on school_settings for all using (is_active_admin()) with check (is_active_admin());

insert into roles (name, permissions) values
  ('super_admin', '{"all": true}'),
  ('teacher_admin', '{"students": true, "teachers": true, "classes": true, "attendance": true, "results": true}'),
  ('accountant_admin', '{"payments": true, "reports": true}'),
  ('moderator', '{"announcements": true, "messages": true}')
on conflict (name) do nothing;
