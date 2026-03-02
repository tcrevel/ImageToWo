/**
 * POST /api/subscriptions/webhook
 *
 * Handles Lemon Squeezy webhook events to keep subscription status in sync.
 *
 * Supported events:
 *   subscription_created, subscription_updated, subscription_resumed,
 *   subscription_cancelled, subscription_expired, subscription_paused
 *
 * @see https://docs.lemonsqueezy.com/api/webhooks
 */

import { NextRequest, NextResponse } from "next/server";
import {
  processWebhookEvent,
  verifyWebhookSignature,
} from "@/lib/services/lemonsqueezy";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-signature") ?? "";
  const body = await request.text();

  // Verify HMAC signature
  const valid = await verifyWebhookSignature(body, signature);
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(body) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventName = request.headers.get("x-event-name") ?? "";

  try {
    await processWebhookEvent(eventName, payload as Record<string, unknown>);
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
