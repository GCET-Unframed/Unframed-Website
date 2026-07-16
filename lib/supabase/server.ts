import "server-only";
import { createClient } from "@supabase/supabase-js";

// Service-role client. Used only from server-side code (NextAuth callbacks,
// API routes) — this key bypasses RLS, so it must never reach the browser.
export function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
