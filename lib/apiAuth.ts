import "server-only";
import { resolveUserIdFromToken } from "./extensionTokens";

/**
 * Resolves the acting userId for an API route from either an existing
 * NextAuth session (calls from the dashboard, which already has a browser
 * session) or an "Authorization: Bearer <token>" header (direct calls from
 * the Ellipsis extension, which has no browser session to send).
 */
export async function resolveUserId(
  request: Request,
  sessionUserId: string | undefined
): Promise<string | null> {
  if (sessionUserId) return sessionUserId;

  const authHeader = request.headers.get("authorization") || "";
  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;

  return resolveUserIdFromToken(token);
}
