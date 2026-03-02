/**
 * NextAuth.js Configuration
 *
 * Configures Google OAuth provider for user authentication.
 * Requires GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and NEXTAUTH_SECRET
 * environment variables to be set.
 *
 * Admin users are defined via the ADMIN_USERS environment variable
 * (comma-separated list of Google email addresses).
 */

import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!googleClientId || !googleClientSecret) {
  throw new Error(
    "Missing required Google OAuth environment variables: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set."
  );
}

/**
 * Returns the list of admin email addresses from ADMIN_USERS env variable.
 * Result is cached to avoid re-parsing on every JWT refresh.
 */
let cachedAdminEmails: string[] | null = null;

export function getAdminEmails(): string[] {
  if (cachedAdminEmails === null) {
    cachedAdminEmails =
      process.env.ADMIN_USERS?.split(",")
        .map((e) => e.trim())
        .filter(Boolean) ?? [];
  }
  return cachedAdminEmails;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token }) {
      if (token.email) {
        token.isAdmin = getAdminEmails().includes(token.email);
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.isAdmin = token.isAdmin as boolean | undefined;
      }
      return session;
    },
  },
};
