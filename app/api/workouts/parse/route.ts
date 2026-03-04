/**
 * POST /api/workouts/parse
 * 
 * Parse a workout image using GPT-4 Vision.
 * 
 * Constitution Principle I: Security-First API
 * - Server-side only OpenAI calls
 * - File validation before processing
 * - Rate limiting per user (IP + fingerprint)
 * 
 * Constitution Principle II: Honest AI
 * - Returns confidence scores
 * - Includes warnings for ambiguous content
 * 
 * @see specs/001-workout-image-to-zwo/contracts/parse.md
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { parseWorkoutImage } from "@/lib/services/openai";
import { hasActiveSubscription } from "@/lib/services/lemonsqueezy";
import { 
  generateUserId,
  generateUserIdFromEmail,
  getClientIp, 
  getFingerprint, 
  checkRateLimitAsync, 
  consumeRateLimitAsync 
} from "@/lib/services/rate-limit";
import { authOptions } from "@/lib/auth";
import { getServerEnv } from "@/lib/utils/env";
import { getAdminSettings, isUserBlocked } from "@/lib/services/admin-settings";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { ParseError } from "@/lib/schemas";

// ============================================================================
// Constants
// ============================================================================

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// ============================================================================
// Route Handler
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const env = getServerEnv();

    // Check if authenticated user is blocked
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const blocked = await isUserBlocked(session.user.email);
      if (blocked) {
        return errorResponse("Your account has been suspended.", "ACCOUNT_SUSPENDED", 403);
      }
    }
    
    // Check whether the authenticated user has an active subscription
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email ?? null;
    const isSubscribed = userEmail
      ? await hasActiveSubscription(userEmail)
      : false;

    // Derive a stable user ID for rate limiting:
    // authenticated users are identified by email; anonymous calls fall back to IP + fingerprint.
    const rateLimitUserId = env.RATE_LIMIT_ENABLED && !isSubscribed
      ? (userEmail
          ? generateUserIdFromEmail(userEmail)
          : generateUserId(getClientIp(request), getFingerprint(request)))
      : null;
    
    // Rate limiting check (skipped for active subscribers)
    if (rateLimitUserId) {
      const rateLimitCheck = await checkRateLimitAsync(rateLimitUserId);
      
      if (!rateLimitCheck.allowed) {
        return NextResponse.json(
          { 
            error: "Daily limit reached. Please try again tomorrow.",
            code: "RATE_LIMITED" as const,
            remaining: 0,
            limit: rateLimitCheck.limit,
            resetAt: rateLimitCheck.resetAt.toISOString(),
            storage: rateLimitCheck.storage,
          },
          { 
            status: 429,
            headers: {
              "X-RateLimit-Limit": rateLimitCheck.limit.toString(),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": rateLimitCheck.resetAt.toISOString(),
              "X-RateLimit-Storage": rateLimitCheck.storage,
              "Retry-After": Math.ceil((rateLimitCheck.resetAt.getTime() - Date.now()) / 1000).toString(),
            },
          }
        );
      }
    }
    
    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get("file");
    
    // Validate file presence
    if (!file || !(file instanceof File)) {
      return errorResponse("No file provided", "INVALID_IMAGE", 400);
    }
    
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return errorResponse(
        `Invalid file type. Accepted: ${ALLOWED_TYPES.join(", ")}`,
        "INVALID_FORMAT",
        400
      );
    }
    
    // Validate file size
    if (file.size > env.MAX_FILE_SIZE) {
      return errorResponse(
        `File too large. Maximum size: ${Math.round(env.MAX_FILE_SIZE / 1024 / 1024)}MB`,
        "FILE_TOO_LARGE",
        413
      );
    }
    
    // Get optional parameters
    const ftpStr = formData.get("ftp");
    const ftp = ftpStr ? parseInt(ftpStr.toString(), 10) : undefined;
    const locale = formData.get("locale")?.toString();
    const notes = formData.get("notes")?.toString();
    
    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    // Load admin-configurable prompts
    const adminSettings = await getAdminSettings();
    
    // Parse with OpenAI
    const result = await parseWorkoutImage(base64, file.type, {
      ftp: ftp && !isNaN(ftp) ? ftp : undefined,
      locale,
      notes,
      systemPromptOverride: adminSettings.systemPrompt,
      userPromptTemplateOverride: adminSettings.userPromptTemplate,
    });
    
    // Consume rate limit after successful parsing (skipped for active subscribers)
    let rateLimitHeaders: Record<string, string> = {};
    if (rateLimitUserId) {
      const consumed = await consumeRateLimitAsync(rateLimitUserId);
      
      rateLimitHeaders = {
        "X-RateLimit-Limit": consumed.limit.toString(),
        "X-RateLimit-Remaining": consumed.remaining.toString(),
        "X-RateLimit-Reset": consumed.resetAt.toISOString(),
        "X-RateLimit-Storage": consumed.storage,
      };
    }
    
    // Return appropriate status based on confidence
    const status = result.confidence < 0.5 ? 422 : 200;
    
    return NextResponse.json(
      {
        ...result,
        rateLimit: rateLimitUserId ? {
          remaining: parseInt(rateLimitHeaders["X-RateLimit-Remaining"] || "0"),
          limit: parseInt(rateLimitHeaders["X-RateLimit-Limit"] || "5"),
          resetAt: rateLimitHeaders["X-RateLimit-Reset"],
        } : undefined,
      },
      { 
        status,
        headers: rateLimitHeaders,
      }
    );
  } catch (error) {
    console.error("Parse error:", error);
    
    if (error instanceof Error) {
      return errorResponse(error.message, "PARSE_FAILED", 500);
    }
    
    return errorResponse("An unexpected error occurred", "INTERNAL_ERROR", 500);
  }
}

// ============================================================================
// Helpers
// ============================================================================

function errorResponse(
  message: string,
  code: ParseError["code"],
  status: number
): NextResponse {
  return NextResponse.json(
    { error: message, code } satisfies ParseError,
    { status }
  );
}
