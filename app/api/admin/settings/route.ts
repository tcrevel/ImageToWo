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
  type AdminSettings,
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
  const allowed = ["systemPrompt", "userPromptTemplate", "dailyParseLimit"];
  const patch: Partial<AdminSettings> = {};

  for (const key of allowed) {
    if (key in updates) {
      if (key === "dailyParseLimit") {
        const val = updates[key];
        if (val !== null && (typeof val !== "number" || !Number.isInteger(val) || val < 0)) {
          return NextResponse.json(
            { error: `Field 'dailyParseLimit' must be a non-negative integer or null` },
            { status: 400 }
          );
        }
        (patch as Record<string, unknown>)[key] = val as number | null;
      } else {
        if (typeof updates[key] !== "string") {
          return NextResponse.json(
            { error: `Field '${key}' must be a string` },
            { status: 400 }
          );
        }
        (patch as Record<string, unknown>)[key] = updates[key] as string;
      }
    }
  }

  const updated = await updateAdminSettings(patch);
  return NextResponse.json(updated);
}
