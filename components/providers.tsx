"use client";

/**
 * Client-side Providers
 *
 * Wraps the app with NextAuth SessionProvider for client-side session access.
 */

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
