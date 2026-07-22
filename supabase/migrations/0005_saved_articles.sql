-- Phase 4: SavedArticle schema.
-- One row per synced Ellipsis article analysis. Sync is opt-in on the
-- extension side (see 0004_extension_tokens.sql for the auth bridge that
-- makes the sync request itself possible) and the user can delete any row
-- from the dashboard at any time. RLS disabled to match every table since
-- 0002 — all access happens server-side via the service-role client.

create table "SavedArticle" (
  "userId" uuid not null references "User" (id) on delete cascade,
  "articleUrl" text not null,
  "articleTitle" text not null,
  "savedAt" timestamptz not null default now(),
  "biasScores" jsonb not null,
  perspectives jsonb not null default '[]',
  "framingNotes" jsonb not null default '[]',
  summary text not null,
  "syncedAt" timestamptz not null default now(),
  primary key ("userId", "articleUrl")
);

create index "SavedArticle_userId_idx" on "SavedArticle" ("userId");

alter table "SavedArticle" disable row level security;
