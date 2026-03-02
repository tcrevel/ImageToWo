/**
 * Rate Limit Service Tests
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { 
  generateUserId,
  generateUserIdFromEmail,
  checkRateLimit, 
  consumeRateLimit,
  checkRateLimitAsync,
  consumeRateLimitAsync,
  getClientIp,
  getFingerprint,
} from "@/lib/services/rate-limit";

// Mock env
vi.mock("@/lib/utils/env", () => ({
  getServerEnv: () => ({
    DAILY_PARSE_LIMIT: 5,
    RATE_LIMIT_ENABLED: true,
  }),
}));

// Mock redis (returns null to use memory fallback)
vi.mock("@/lib/services/redis", () => ({
  getRedisClient: () => null,
}));

describe("Rate Limit Service", () => {
  describe("generateUserId", () => {
    it("generates consistent hash for same IP", () => {
      const id1 = generateUserId("192.168.1.1");
      const id2 = generateUserId("192.168.1.1");
      expect(id1).toBe(id2);
    });

    it("generates different hash for different IPs", () => {
      const id1 = generateUserId("192.168.1.1");
      const id2 = generateUserId("192.168.1.2");
      expect(id1).not.toBe(id2);
    });

    it("combines IP and fingerprint", () => {
      const idWithoutFp = generateUserId("192.168.1.1");
      const idWithFp = generateUserId("192.168.1.1", "abc123");
      expect(idWithoutFp).not.toBe(idWithFp);
    });

    it("same IP + fingerprint produces same hash", () => {
      const id1 = generateUserId("192.168.1.1", "fp123");
      const id2 = generateUserId("192.168.1.1", "fp123");
      expect(id1).toBe(id2);
    });
  });

  describe("generateUserIdFromEmail", () => {
    it("generates consistent hash for the same email", () => {
      const id1 = generateUserIdFromEmail("user@example.com");
      const id2 = generateUserIdFromEmail("user@example.com");
      expect(id1).toBe(id2);
    });

    it("is case-insensitive (normalises to lower-case)", () => {
      const lower = generateUserIdFromEmail("user@example.com");
      const upper = generateUserIdFromEmail("User@Example.COM");
      expect(lower).toBe(upper);
    });

    it("generates different hash for different emails", () => {
      const id1 = generateUserIdFromEmail("alice@example.com");
      const id2 = generateUserIdFromEmail("bob@example.com");
      expect(id1).not.toBe(id2);
    });

    it("does not collide with an IP-based ID for the same raw string", () => {
      // The "email:" prefix must prevent collisions with IP-based keys.
      const emailId = generateUserIdFromEmail("1.2.3.4");
      const ipId = generateUserId("1.2.3.4");
      expect(emailId).not.toBe(ipId);
    });
  });

  describe("checkRateLimit", () => {
    beforeEach(() => {
      // Clear usage store by using a unique user ID for each test
    });

    it("allows first request for new user", () => {
      const userId = `test-user-${Date.now()}-1`;
      const result = checkRateLimit(userId);
      
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(5);
      expect(result.limit).toBe(5);
      expect(result.resetAt).toBeInstanceOf(Date);
    });

    it("returns correct remaining count", () => {
      const userId = `test-user-${Date.now()}-2`;
      
      // First request
      checkRateLimit(userId);
      consumeRateLimit(userId);
      
      // Check after consumption
      const result = checkRateLimit(userId);
      expect(result.remaining).toBe(4);
    });
  });

  describe("consumeRateLimit", () => {
    it("decrements remaining count", () => {
      const userId = `test-user-${Date.now()}-3`;
      
      const before = checkRateLimit(userId);
      const after = consumeRateLimit(userId);
      
      expect(after.remaining).toBe(before.remaining - 1);
    });

    it("blocks when limit reached", () => {
      const userId = `test-user-${Date.now()}-4`;
      
      // Consume all quota
      for (let i = 0; i < 5; i++) {
        consumeRateLimit(userId);
      }
      
      const result = checkRateLimit(userId);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it("sets correct reset time to end of day UTC", () => {
      const userId = `test-user-${Date.now()}-5`;
      const result = consumeRateLimit(userId);
      
      const resetAt = result.resetAt;
      expect(resetAt.getUTCHours()).toBe(0);
      expect(resetAt.getUTCMinutes()).toBe(0);
      expect(resetAt.getUTCSeconds()).toBe(0);
    });
  });

  describe("getClientIp", () => {
    it("extracts IP from cf-connecting-ip header", () => {
      const request = new Request("https://example.com", {
        headers: { "cf-connecting-ip": "1.2.3.4" },
      });
      expect(getClientIp(request)).toBe("1.2.3.4");
    });

    it("extracts first IP from x-forwarded-for header", () => {
      const request = new Request("https://example.com", {
        headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
      });
      expect(getClientIp(request)).toBe("1.2.3.4");
    });

    it("extracts IP from x-real-ip header", () => {
      const request = new Request("https://example.com", {
        headers: { "x-real-ip": "1.2.3.4" },
      });
      expect(getClientIp(request)).toBe("1.2.3.4");
    });

    it("returns unknown when no IP headers present", () => {
      const request = new Request("https://example.com");
      expect(getClientIp(request)).toBe("unknown");
    });
  });

  describe("getFingerprint", () => {
    it("extracts fingerprint from header", () => {
      const request = new Request("https://example.com", {
        headers: { "x-client-fingerprint": "abc123" },
      });
      expect(getFingerprint(request)).toBe("abc123");
    });

    it("returns undefined when no fingerprint header", () => {
      const request = new Request("https://example.com");
      expect(getFingerprint(request)).toBeUndefined();
    });
  });

  describe("async functions (with Redis fallback)", () => {
    it("checkRateLimitAsync falls back to memory", async () => {
      const userId = `test-async-${Date.now()}-1`;
      const result = await checkRateLimitAsync(userId);
      
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(5);
      expect(result.storage).toBe("memory");
    });

    it("consumeRateLimitAsync falls back to memory", async () => {
      const userId = `test-async-${Date.now()}-2`;
      const result = await consumeRateLimitAsync(userId);
      
      expect(result.remaining).toBe(4);
      expect(result.storage).toBe("memory");
    });

    it("async functions work together", async () => {
      const userId = `test-async-${Date.now()}-3`;
      
      // Check initial
      const check1 = await checkRateLimitAsync(userId);
      expect(check1.remaining).toBe(5);
      
      // Consume
      await consumeRateLimitAsync(userId);
      await consumeRateLimitAsync(userId);
      
      // Check after consumption
      const check2 = await checkRateLimitAsync(userId);
      expect(check2.remaining).toBe(3);
    });

    it("email-based quota is shared regardless of IP or fingerprint", async () => {
      const userId = generateUserIdFromEmail(`shared-${Date.now()}@example.com`);

      // Consume twice using the same email-based key
      await consumeRateLimitAsync(userId);
      await consumeRateLimitAsync(userId);

      // A second "device" using the identical email-derived key sees 3 remaining
      const check = await checkRateLimitAsync(userId);
      expect(check.remaining).toBe(3);
    });
  });
});
