-- Phase 1: User + CivicProfile schema.
-- All access happens server-side through Next.js API routes using the
-- Supabase service-role key, which bypasses RLS by design. RLS is still
-- enabled on both tables with no policies for the anon/authenticated
-- roles, so these tables stay unreachable if the anon key is ever used
-- against them directly from the client.

create extension if not exists pgcrypto;

create table "User" (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  "displayName" text,
  "profilePhotoUrl" text,
  "createdAt" timestamptz not null default now(),
  "lastLoginAt" timestamptz not null default now()
);

alter table "User" enable row level security;

create table "CivicProfile" (
  "userId" uuid primary key references "User" (id) on delete cascade,
  state text not null,
  city text not null,
  "interestAreas" text[] not null check (array_length("interestAreas", 1) >= 1),
  "citizenshipStatus" text check (
    "citizenshipStatus" in (
      'us_citizen',
      'permanent_resident',
      'daca_undocumented',
      'visa_holder',
      'prefer_not_to_say'
    )
  ),
  ethnicity text[],
  "educationLevel" text check (
    "educationLevel" in (
      'high_school',
      'some_college',
      'bachelors',
      'graduate',
      'prefer_not_to_say'
    )
  ),
  "incomeRange" text check (
    "incomeRange" in (
      'below_30k',
      '30k_60k',
      '60k_100k',
      '100k_plus',
      'prefer_not_to_say'
    )
  ),
  "ageRange" text check (
    "ageRange" in (
      'under_18',
      '18_24',
      '25_34',
      '35_49',
      '50_64',
      '65_plus',
      'prefer_not_to_say'
    )
  ),
  "updatedAt" timestamptz not null default now()
);

alter table "CivicProfile" enable row level security;

create index "CivicProfile_interestAreas_idx" on "CivicProfile" using gin ("interestAreas");
