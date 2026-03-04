/**
 * GET  /api/admin/users          - List blocked users
 * POST /api/admin/users          - Block a user by email
 * DELETE /api/admin/users?email= - Unblock a user by email
 *
 * Admin-only endpoint to manage user access.
 * Requires the authenticated user to be in the ADMIN_USERS list.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getBlockedUsers,
  blockUser,
  unblockUser,
  getUserDailyLimits,
  setUserDailyLimit,
  deleteUserDailyLimit,
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

  const [blockedUsers, userLimits] = await Promise.all([
    getBlockedUsers(),
    getUserDailyLimits(),
  ]);
  return NextResponse.json({ blockedUsers, userLimits });
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

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>).email !== "string"
  ) {
    return NextResponse.json(
      { error: "Request body must include { email: string }" },
      { status: 400 }
    );
  }

  const email = (body as { email: string }).email.trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "Email must not be empty" }, { status: 400 });
  }

  await blockUser(email);
  return NextResponse.json({ success: true, email });
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

  await unblockUser(email);
  return NextResponse.json({ success: true, email });
}

export async function PATCH(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>).email !== "string"
  ) {
    return NextResponse.json(
      { error: "Request body must include { email: string, dailyLimit: number | null }" },
      { status: 400 }
    );
  }

  const { email, dailyLimit } = body as { email: string; dailyLimit: unknown };
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    return NextResponse.json({ error: "Email must not be empty" }, { status: 400 });
  }

  if (dailyLimit === null || dailyLimit === undefined) {
    // Remove override — revert to global limit
    await deleteUserDailyLimit(normalizedEmail);
    return NextResponse.json({ success: true, email: normalizedEmail, dailyLimit: null });
  }

  const limitVal = Number(dailyLimit);
  if (!Number.isInteger(limitVal) || limitVal < 1) {
    return NextResponse.json(
      { error: "Field 'dailyLimit' must be a positive integer or null" },
      { status: 400 }
    );
  }

  await setUserDailyLimit(normalizedEmail, limitVal);
  return NextResponse.json({ success: true, email: normalizedEmail, dailyLimit: limitVal });
}
