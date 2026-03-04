/**
 * POST /api/subscriptions/checkout
 *
 * Creates a Lemon Squeezy checkout session for the monthly subscription plan
 * (5 €/month) and returns the checkout URL to redirect the user to.
 *
 * Requires the user to be authenticated.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createSubscriptionCheckout } from "@/lib/services/lemonsqueezy";

export async function POST(_request: NextRequest) {
  // Require authentication
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = await createSubscriptionCheckout(
      session.user.email,
      session.user.name ?? undefined
    );
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Checkout creation error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create checkout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
