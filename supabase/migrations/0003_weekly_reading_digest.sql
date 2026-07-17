-- Phase 3: WeeklyReadingDigest schema.
-- One record per user per week, created/overwritten by the Ellipsis sync
-- endpoint (POST /api/digest). RLS disabled to match Bill/SavedBill in
-- 0002_bills.sql — all access happens server-side via the service-role
-- client.

create table "WeeklyReadingDigest" (
  "userId" uuid not null references "User" (id) on delete cascade,
  "weekOf" date not null,
  "articlesAnalyzed" int not null default 0,
  "biasDistribution" jsonb not null,
  "topTopics" jsonb not null,
  "sourceCount" int not null default 0,
  "insightText" text not null,
  "updatedAt" timestamptz not null default now(),
  primary key ("userId", "weekOf")
);

create index "WeeklyReadingDigest_userId_idx" on "WeeklyReadingDigest" ("userId");

alter table "WeeklyReadingDigest" disable row level security;
