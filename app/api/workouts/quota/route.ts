/**
 * GET /api/workouts/quota
 * 
 * Check remaining quota for the current user without consuming it.
 * Returns rate limit information based on IP + fingerprint (or email for authenticated users).
 */

import { NextRequest, NextResponse } from "next/server";
import { 
  generateUserId, 
  getClientIp, 
  getFingerprint, 
  checkRateLimitAsync 
} from "@/lib/services/rate-limit";
import { getServerEnv } from "@/lib/utils/env";
import { getAdminSettings, getUserLimit } from "@/lib/services/admin-settings";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

  const session = await getServerSession(authOptions);
  const ip = getClientIp(request);
  const fingerprint = getFingerprint(request);
  const userId = session?.user?.email
    ? generateUserId(session.user.email)
    : generateUserId(ip, fingerprint);

  // Resolve effective limit: user override → admin global → env default
  const adminSettings = await getAdminSettings();
  const userLimitOverride = session?.user?.email
    ? await getUserLimit(session.user.email)
    : null;
  const effectiveLimit =
    userLimitOverride ?? adminSettings.dailyParseLimit ?? env.DAILY_PARSE_LIMIT;
  
  const result = await checkRateLimitAsync(userId, effectiveLimit);
  
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
