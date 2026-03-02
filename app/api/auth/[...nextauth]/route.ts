/**
 * NextAuth.js API Route Handler
 *
 * Handles all authentication requests:
 * - GET /api/auth/signin
 * - GET /api/auth/signout
 * - GET /api/auth/callback/google
 * - GET /api/auth/session
 * - POST /api/auth/signin
 * - POST /api/auth/signout
 */

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
