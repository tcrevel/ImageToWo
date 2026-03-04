/**
 * Lemon Squeezy Service
 *
 * Handles subscription checkout creation, status checks, and webhook processing.
 * Subscription status is stored in Redis (or in-memory as fallback).
 */

import {
  lemonSqueezySetup,
  createCheckout,
  getSubscription,
} from "@lemonsqueezy/lemonsqueezy.js";
import { getRedisClient } from "./redis";
import { getServerEnv } from "@/lib/utils/env";

// ============================================================================
// Constants
// ============================================================================

const SUBSCRIPTION_PREFIX = "subscription:";
// 33-day TTL in seconds (grace period for subscription renewals)
const SUBSCRIPTION_TTL = 33 * 24 * 60 * 60;

// ============================================================================
// Types
// ============================================================================

export interface SubscriptionStatus {
  active: boolean;
  customerId?: string;
  subscriptionId?: string;
  variantId?: string;
  renewsAt?: string | null;
  endsAt?: string | null;
  status?: string;
}

// ============================================================================
// SDK Initialisation
// ============================================================================

let initialised = false;

function ensureInitialised(): void {
  if (initialised) return;
  const env = getServerEnv();
  if (!env.LEMONSQUEEZY_API_KEY) {
    throw new Error("LEMONSQUEEZY_API_KEY is not configured");
  }
  lemonSqueezySetup({ apiKey: env.LEMONSQUEEZY_API_KEY });
  initialised = true;
}

// ============================================================================
// Storage (Redis with in-memory fallback)
// ============================================================================

const memoryStore = new Map<string, SubscriptionStatus>();

async function storeSubscription(
  email: string,
  data: SubscriptionStatus
): Promise<void> {
  const key = `${SUBSCRIPTION_PREFIX}${email.toLowerCase()}`;
  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.set(key, JSON.stringify(data), "EX", SUBSCRIPTION_TTL);
      return;
    } catch {
      // fall through to memory
    }
  }
  memoryStore.set(key, data);
}

async function loadSubscription(
  email: string
): Promise<SubscriptionStatus | null> {
  const key = `${SUBSCRIPTION_PREFIX}${email.toLowerCase()}`;
  const redis = getRedisClient();
  if (redis) {
    try {
      const raw = await redis.get(key);
      if (raw) return JSON.parse(raw) as SubscriptionStatus;
    } catch {
      // fall through to memory
    }
  }
  return memoryStore.get(key) ?? null;
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Check whether a user (identified by email) has an active subscription.
 */
export async function hasActiveSubscription(email: string): Promise<boolean> {
  const data = await loadSubscription(email);
  return data?.active === true;
}

/**
 * Get full subscription status for a user.
 */
export async function getSubscriptionStatus(
  email: string
): Promise<SubscriptionStatus> {
  const data = await loadSubscription(email);
  return data ?? { active: false };
}

/**
 * Create a Lemon Squeezy checkout URL for the monthly subscription.
 *
 * @param email  Pre-fill the checkout form with the user's email address.
 * @param name   Pre-fill the checkout form with the user's display name.
 * @returns      The URL the user should be redirected to.
 */
export async function createSubscriptionCheckout(
  email: string,
  name?: string
): Promise<string> {
  ensureInitialised();

  const env = getServerEnv();

  if (!env.LEMONSQUEEZY_STORE_ID || !env.LEMONSQUEEZY_VARIANT_ID) {
    throw new Error(
      "LEMONSQUEEZY_STORE_ID and LEMONSQUEEZY_VARIANT_ID must be configured"
    );
  }

  const { data, error } = await createCheckout(
    env.LEMONSQUEEZY_STORE_ID,
    env.LEMONSQUEEZY_VARIANT_ID,
    {
      checkoutOptions: {
        embed: false,
      },
      checkoutData: {
        email,
        name: name ?? undefined,
        custom: { user_email: email },
      },
      productOptions: {
        redirectUrl: `${process.env.NEXTAUTH_URL ?? ""}/`,
      },
    }
  );

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to create checkout");
  }

  const url = data.data.attributes.url;
  if (!url) {
    throw new Error("Checkout URL missing from Lemon Squeezy response");
  }
  return url;
}

/**
 * Process a Lemon Squeezy webhook event and persist subscription status.
 *
 * Supported events:
 *   subscription_created, subscription_updated, subscription_resumed,
 *   subscription_cancelled, subscription_expired, subscription_paused
 */
export async function processWebhookEvent(
  eventName: string,
  payload: Record<string, unknown>
): Promise<void> {
  const attributes =
    (
      (payload?.data as Record<string, unknown>)
        ?.attributes as Record<string, unknown>
    ) ?? {};

  // Resolve the customer email from custom data or direct fields
  const metaCustomData = (payload?.meta as Record<string, unknown>)?.custom_data as Record<string, unknown> | undefined;
  const attrCustomData = attributes?.custom_data as Record<string, unknown> | undefined;
  const email: string | undefined =
    (attrCustomData?.user_email as string | undefined) ??
    (metaCustomData?.user_email as string | undefined);

  if (!email) {
    console.warn(
      `[LemonSqueezy] No email found in webhook payload for event: ${eventName}`
    );
    return;
  }

  const activeStatuses = new Set([
    "subscription_created",
    "subscription_updated",
    "subscription_resumed",
  ]);

  const inactiveStatuses = new Set([
    "subscription_cancelled",
    "subscription_expired",
    "subscription_paused",
  ]);

  const subscriptionId = String((payload?.data as Record<string, unknown>)?.id ?? "");
  const variantId = String(attributes?.variant_id ?? "");
  const customerId = String(attributes?.customer_id ?? "");
  const lsStatus: string = (attributes?.status as string | undefined) ?? "";

  let active = false;
  if (activeStatuses.has(eventName)) {
    // The subscription is active if LS status is "active" or "on_trial"
    active = lsStatus === "active" || lsStatus === "on_trial";
  } else if (inactiveStatuses.has(eventName)) {
    active = false;
  } else {
    // For unknown events, reflect the LS status field directly
    active = lsStatus === "active" || lsStatus === "on_trial";
  }

  await storeSubscription(email, {
    active,
    customerId,
    subscriptionId,
    variantId,
    renewsAt: (attributes?.renews_at as string | null | undefined) ?? null,
    endsAt: (attributes?.ends_at as string | null | undefined) ?? null,
    status: lsStatus,
  });
}

/**
 * Refresh subscription status from Lemon Squeezy API.
 * Useful to re-sync if Redis data is stale.
 */
export async function refreshSubscriptionFromApi(
  email: string,
  subscriptionId: string
): Promise<SubscriptionStatus> {
  ensureInitialised();

  const { data, error } = await getSubscription(subscriptionId);

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to fetch subscription");
  }

  const attributes = data.data.attributes;
  const lsStatus = attributes.status;
  const active = lsStatus === "active" || lsStatus === "on_trial";

  const status: SubscriptionStatus = {
    active,
    subscriptionId,
    variantId: String(attributes.variant_id ?? ""),
    renewsAt: attributes.renews_at ?? null,
    endsAt: attributes.ends_at ?? null,
    status: lsStatus,
  };

  await storeSubscription(email, status);
  return status;
}

/**
 * Verify a Lemon Squeezy webhook signature.
 * Returns true if the signature is valid.
 */
export async function verifyWebhookSignature(
  body: string,
  signature: string
): Promise<boolean> {
  const env = getServerEnv();
  const secret = env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) return false;

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(body)
    );
    const computedHex = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Constant-time comparison
    if (computedHex.length !== signature.length) return false;
    let mismatch = 0;
    for (let i = 0; i < computedHex.length; i++) {
      mismatch |= computedHex.charCodeAt(i) ^ signature.charCodeAt(i);
    }
    return mismatch === 0;
  } catch {
    return false;
  }
}
