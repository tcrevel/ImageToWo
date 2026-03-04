/**
 * GET /api/admin/settings
 * PATCH /api/admin/settings
 *
 * Admin-only endpoint to view and update system settings (prompts, etc.)
 * Requires the authenticated user to be in the ADMIN_USERS list.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getAdminSettings,
  updateAdminSettings,
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

  const settings = await getAdminSettings();
  return NextResponse.json(settings);
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

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const updates: Record<string, unknown> = body as Record<string, unknown>;
  const allowedStrings = ["systemPrompt", "userPromptTemplate"];
  const patch: Partial<{ systemPrompt: string; userPromptTemplate: string; dailyLimit: number }> = {};

  for (const key of allowedStrings) {
    if (key in updates) {
      if (typeof updates[key] !== "string") {
        return NextResponse.json(
          { error: `Field '${key}' must be a string` },
          { status: 400 }
        );
      }
      (patch as Record<string, unknown>)[key] = updates[key];
    }
  }

  if ("dailyLimit" in updates) {
    const val = Number(updates["dailyLimit"]);
    if (!Number.isInteger(val) || val < 1) {
      return NextResponse.json(
        { error: "Field 'dailyLimit' must be a positive integer" },
        { status: 400 }
      );
    }
    patch.dailyLimit = val;
  }

  const updated = await updateAdminSettings(patch);
  return NextResponse.json(updated);
}
