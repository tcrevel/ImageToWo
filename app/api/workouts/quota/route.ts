/**
 * GET /api/workouts/quota
 * 
 * Check remaining quota for the current user without consuming it.
 * When the user is authenticated, quota is tracked by their account email.
 * Falls back to IP + fingerprint for unauthenticated requests.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { 
  generateUserId,
  generateUserIdFromEmail,
  getClientIp, 
  getFingerprint, 
  checkRateLimitAsync 
} from "@/lib/services/rate-limit";
import { authOptions } from "@/lib/auth";
import { getServerEnv } from "@/lib/utils/env";

export async function GET(request: NextRequest) {
  const env = getServerEnv();
  
  // If rate limiting is disabled, return unlimited
  if (!env.RATE_LIMIT_ENABLED) {
    return NextResponse.json({
      enabled: false,
      remaining: Infinity,
      limit: Infinity,
      resetAt: null,
      storage: null,
    });
  }
  
  // Prefer the signed-in user's email as the rate-limit key
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email ?? null;

  const userId = userEmail
    ? generateUserIdFromEmail(userEmail)
    : generateUserId(getClientIp(request), getFingerprint(request));
  
  const result = await checkRateLimitAsync(userId);
  
  return NextResponse.json(
    {
      enabled: true,
      remaining: result.remaining,
      limit: result.limit,
      resetAt: result.resetAt.toISOString(),
      storage: result.storage,
    },
    {
      headers: {
        "X-RateLimit-Limit": result.limit.toString(),
        "X-RateLimit-Remaining": result.remaining.toString(),
        "X-RateLimit-Reset": result.resetAt.toISOString(),
        "X-RateLimit-Storage": result.storage,
      },
    }
  );
}
