/**
 * Lemon Squeezy Service Tests
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ============================================================================
// Mocks
// ============================================================================

vi.mock("@/lib/utils/env", () => ({
  getServerEnv: () => ({
    OPENAI_API_KEY: "sk-test",
    LEMONSQUEEZY_API_KEY: "test-api-key",
    LEMONSQUEEZY_STORE_ID: "123",
    LEMONSQUEEZY_VARIANT_ID: "456",
    LEMONSQUEEZY_WEBHOOK_SECRET: "test-secret",
  }),
}));

vi.mock("@/lib/services/redis", () => ({
  getRedisClient: () => null, // use in-memory fallback
}));

vi.mock("@lemonsqueezy/lemonsqueezy.js", () => ({
  lemonSqueezySetup: vi.fn(),
  createCheckout: vi.fn(),
  getSubscription: vi.fn(),
}));

import {
  hasActiveSubscription,
  getSubscriptionStatus,
  processWebhookEvent,
  verifyWebhookSignature,
} from "@/lib/services/lemonsqueezy";

// ============================================================================
// Tests
// ============================================================================

describe("Lemon Squeezy Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("hasActiveSubscription", () => {
    it("returns false for unknown email", async () => {
      const result = await hasActiveSubscription("unknown@example.com");
      expect(result).toBe(false);
    });
  });

  describe("getSubscriptionStatus", () => {
    it("returns inactive status for unknown email", async () => {
      const status = await getSubscriptionStatus("nobody@example.com");
      expect(status.active).toBe(false);
    });
  });

  describe("processWebhookEvent", () => {
    it("marks subscription as active on subscription_created with active status", async () => {
      const email = `webhook-test-created-${Date.now()}@example.com`;
      await processWebhookEvent("subscription_created", {
        data: {
          id: "sub_123",
          attributes: {
            status: "active",
            customer_id: "cust_1",
            variant_id: "var_1",
            renews_at: null,
            ends_at: null,
            custom_data: { user_email: email },
          },
        },
        meta: { custom_data: { user_email: email } },
      });

      const status = await getSubscriptionStatus(email);
      expect(status.active).toBe(true);
      expect(status.subscriptionId).toBe("sub_123");
    });

    it("marks subscription as inactive on subscription_cancelled", async () => {
      const email = `webhook-test-cancelled-${Date.now()}@example.com`;

      // First activate
      await processWebhookEvent("subscription_created", {
        data: {
          id: "sub_456",
          attributes: {
            status: "active",
            customer_id: "cust_2",
            variant_id: "var_2",
            renews_at: null,
            ends_at: null,
            custom_data: { user_email: email },
          },
        },
      });

      expect((await getSubscriptionStatus(email)).active).toBe(true);

      // Then cancel
      await processWebhookEvent("subscription_cancelled", {
        data: {
          id: "sub_456",
          attributes: {
            status: "cancelled",
            customer_id: "cust_2",
            variant_id: "var_2",
            renews_at: null,
            ends_at: null,
            custom_data: { user_email: email },
          },
        },
      });

      const status = await getSubscriptionStatus(email);
      expect(status.active).toBe(false);
    });

    it("does not throw when email is missing from payload", async () => {
      await expect(
        processWebhookEvent("subscription_created", {
          data: {
            id: "sub_789",
            attributes: {
              status: "active",
            },
          },
        })
      ).resolves.not.toThrow();
    });

    it("marks on_trial subscription as active", async () => {
      const email = `webhook-test-trial-${Date.now()}@example.com`;
      await processWebhookEvent("subscription_created", {
        data: {
          id: "sub_trial",
          attributes: {
            status: "on_trial",
            customer_id: "cust_3",
            variant_id: "var_3",
            renews_at: null,
            ends_at: null,
            custom_data: { user_email: email },
          },
        },
      });

      const status = await getSubscriptionStatus(email);
      expect(status.active).toBe(true);
    });
  });

  describe("verifyWebhookSignature", () => {
    it("returns false when webhook secret is not configured", async () => {
      vi.doMock("@/lib/utils/env", () => ({
        getServerEnv: () => ({
          OPENAI_API_KEY: "sk-test",
          LEMONSQUEEZY_WEBHOOK_SECRET: undefined,
        }),
      }));

      // No secret means invalid
      const result = await verifyWebhookSignature("body", "signature");
      expect(result).toBe(false);
    });

    it("returns true for a valid HMAC-SHA256 signature", async () => {
      const secret = "test-secret";
      const body = '{"data":"test"}';

      // Compute expected signature using Web Crypto
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const sigBuffer = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(body)
      );
      const expectedHex = Array.from(new Uint8Array(sigBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      const result = await verifyWebhookSignature(body, expectedHex);
      expect(result).toBe(true);
    });

    it("returns false for an invalid signature", async () => {
      const result = await verifyWebhookSignature("body", "invalidsignature00");
      expect(result).toBe(false);
    });
  });
});
