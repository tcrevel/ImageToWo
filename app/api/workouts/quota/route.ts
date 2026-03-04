/**
 * GET /api/workouts/quota
 * 
 * Check remaining quota for the current user without consuming it.
 * Returns rate limit information based on IP + fingerprint.
 */

import { NextRequest, NextResponse } from "next/server";
import { 
  generateUserId, 
  getClientIp, 
  getFingerprint, 
  checkRateLimitAsync 
} from "@/lib/services/rate-limit";
import { getServerEnv } from "@/lib/utils/env";
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
  const userId = generateUserId(ip, fingerprint);
  const userEmail = session?.user?.email ?? undefined;
  
  const result = await checkRateLimitAsync(userId, userEmail);
  
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
