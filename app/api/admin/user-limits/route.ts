/**
 * GET  /api/admin/user-limits          - List per-user daily limit overrides
 * POST /api/admin/user-limits          - Set limit for a user { email, limit }
 * DELETE /api/admin/user-limits?email= - Remove limit override for a user
 *
 * Admin-only endpoint to manage per-user workout analysis limits.
 * Requires the authenticated user to be in the ADMIN_USERS list.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getUserLimits,
  setUserLimit,
  removeUserLimit,
} from "@/lib/services/admin-settings";

// ============================================================================
// Auth Guard Helper
// ============================================================================

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

// ============================================================================
// Handlers
// ============================================================================

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const userLimits = await getUserLimits();
  return NextResponse.json({ userLimits });
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = body as Record<string, unknown>;

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    typeof parsed.email !== "string"
  ) {
    return NextResponse.json(
      { error: "Request body must include { email: string, limit: number }" },
      { status: 400 }
    );
  }

  if (
    typeof parsed.limit !== "number" ||
    !Number.isInteger(parsed.limit) ||
    parsed.limit < 0
  ) {
    return NextResponse.json(
      { error: "Field 'limit' must be a non-negative integer" },
      { status: 400 }
    );
  }

  const email = parsed.email.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  await setUserLimit(email, parsed.limit);
  return NextResponse.json({ success: true, email, limit: parsed.limit });
}

export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json(
      { error: "Query parameter 'email' is required" },
      { status: 400 }
    );
  }

  await removeUserLimit(email);
  return NextResponse.json({ success: true, email });
}
