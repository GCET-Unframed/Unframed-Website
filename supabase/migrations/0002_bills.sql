-- Phase 2: Bill cache + SavedBill schema.
-- Bill is a weekly-refreshed cache of LegiScan (state) and Congress.gov
-- (federal) legislation, keyed by "<source>:<sourceId>" so both sources
-- share one table. state is nullable because federal bills have no state.

create table "Bill" (
  id text primary key,
  source text not null check (source in ('legiscan', 'congress')),
  scope text not null check (scope in ('state', 'federal')),
  state text,
  "billNumber" text not null,
  title text not null,
  summary text not null,
  status text not null,
  subjects text[] not null default '{}',
  url text not null,
  "lastActionDate" date,
  "sessionYear" int,
  "rawPayload" jsonb,
  "updatedAt" timestamptz not null default now()
);

create index "Bill_state_idx" on "Bill" (state);
create index "Bill_scope_idx" on "Bill" (scope);
create index "Bill_subjects_idx" on "Bill" using gin (subjects);

create table "SavedBill" (
  "userId" uuid not null references "User" (id) on delete cascade,
  "billId" text not null references "Bill" (id) on delete cascade,
  "billTitle" text not null,
  "savedAt" timestamptz not null default now(),
  dismissed boolean not null default false,
  primary key ("userId", "billId")
);

create index "SavedBill_userId_idx" on "SavedBill" ("userId");

alter table "Bill" disable row level security;
alter table "SavedBill" disable row level security;
