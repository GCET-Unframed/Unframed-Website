-- Phase 4: ExtensionToken schema.
-- Personal-access tokens the Ellipsis extension uses to authenticate sync
-- requests (weekly digest, saved articles) directly to our API, without a
-- browser session cookie. Only a SHA-256 hash of the token is stored — the
-- raw value is shown to the user once at creation time and never persisted.
-- RLS disabled to match every other table since 0002 — all access happens
-- server-side via the service-role client.

create table "ExtensionToken" (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid not null references "User" (id) on delete cascade,
  "tokenHash" text not null unique,
  label text not null default 'Ellipsis extension',
  "createdAt" timestamptz not null default now(),
  "lastUsedAt" timestamptz
);

create index "ExtensionToken_userId_idx" on "ExtensionToken" ("userId");

alter table "ExtensionToken" disable row level security;
