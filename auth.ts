import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // Only runs on the initial sign-in request, when the provider
      // account/profile are present — this is where we bootstrap our own
      // User row since we're not using a NextAuth database adapter.
      if (account && user) {
        const supabase = getSupabaseServerClient();

        const { data: dbUser, error } = await supabase
          .from("User")
          .upsert(
            {
              email: user.email!,
              displayName: user.name,
              profilePhotoUrl: user.image,
              lastLoginAt: new Date().toISOString(),
            },
            { onConflict: "email" }
          )
          .select("id")
          .single();

        if (error || !dbUser) {
          throw new Error(`Failed to upsert User: ${error?.message}`);
        }

        token.userId = dbUser.id;

        const { data: profile } = await supabase
          .from("CivicProfile")
          .select("userId")
          .eq("userId", dbUser.id)
          .maybeSingle();

        token.hasProfile = !!profile;
      }

      // Client calls useSession().update({ hasProfile: true }) after the
      // onboarding form saves successfully, so the token reflects it
      // immediately without a fresh DB read on every request.
      if (trigger === "update" && typeof session?.hasProfile === "boolean") {
        token.hasProfile = session.hasProfile;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId;
      }
      session.hasProfile = token.hasProfile;
      return session;
    },
  },
};
