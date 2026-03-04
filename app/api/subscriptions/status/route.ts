/**
 * GET /api/subscriptions/status
 *
 * Returns the current subscription status for the authenticated user.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSubscriptionStatus } from "@/lib/services/lemonsqueezy";

export async function GET(_request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const status = await getSubscriptionStatus(session.user.email);
    return NextResponse.json(status);
  } catch (error) {
    console.error("Subscription status error:", error);
    return NextResponse.json({ active: false });
  }
}
