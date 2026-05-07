create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  role text not null check (role in ('student', 'teacher', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  subject text not null,
  class_level text not null,
  type text not null check (type in ('Textbook', 'Slides', 'Past Questions')),
  file_url text not null,
  file_name text not null,
  uploaded_by uuid references users(id) on delete set null,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);
