/**
 * Admin Settings Service Tests
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAdminSettings,
  updateAdminSettings,
  getBlockedUsers,
  blockUser,
  unblockUser,
  isUserBlocked,
} from "@/lib/services/admin-settings";
import {
  DEFAULT_SYSTEM_PROMPT,
  DEFAULT_USER_PROMPT_TEMPLATE,
} from "@/lib/services/openai";

// Mock Redis to use in-memory fallback
vi.mock("@/lib/services/redis", () => ({
  getRedisClient: () => null,
}));

// ============================================================================
// Tests
// ============================================================================

describe("Admin Settings Service (in-memory fallback)", () => {
  // We cannot easily reset module-level state between tests for the in-memory
  // store, so tests that mutate use unique email addresses.

  describe("getAdminSettings", () => {
    it("returns defaults when no settings have been saved", async () => {
      const settings = await getAdminSettings();
      expect(settings.systemPrompt).toBe(DEFAULT_SYSTEM_PROMPT);
      expect(settings.userPromptTemplate).toBe(DEFAULT_USER_PROMPT_TEMPLATE);
    });
  });

  describe("updateAdminSettings", () => {
    it("updates systemPrompt", async () => {
      const updated = await updateAdminSettings({
        systemPrompt: "Custom system prompt",
      });
      expect(updated.systemPrompt).toBe("Custom system prompt");
    });

    it("updates userPromptTemplate", async () => {
      const updated = await updateAdminSettings({
        userPromptTemplate: "Custom user prompt",
      });
      expect(updated.userPromptTemplate).toBe("Custom user prompt");
    });

    it("updates both prompts at once", async () => {
      const updated = await updateAdminSettings({
        systemPrompt: "sys",
        userPromptTemplate: "usr",
      });
      expect(updated.systemPrompt).toBe("sys");
      expect(updated.userPromptTemplate).toBe("usr");
    });
  });

  describe("blockUser / unblockUser / getBlockedUsers / isUserBlocked", () => {
    it("blocks a user", async () => {
      await blockUser("blocked@example.com");
      const users = await getBlockedUsers();
      expect(users).toContain("blocked@example.com");
    });

    it("isUserBlocked returns true for blocked user", async () => {
      await blockUser("check@example.com");
      expect(await isUserBlocked("check@example.com")).toBe(true);
    });

    it("isUserBlocked returns false for non-blocked user", async () => {
      expect(await isUserBlocked("notblocked@example.com")).toBe(false);
    });

    it("unblocks a user", async () => {
      await blockUser("tounblock@example.com");
      await unblockUser("tounblock@example.com");
      expect(await isUserBlocked("tounblock@example.com")).toBe(false);
    });

    it("getBlockedUsers returns all blocked users", async () => {
      await blockUser("user1@example.com");
      await blockUser("user2@example.com");
      const users = await getBlockedUsers();
      expect(users).toContain("user1@example.com");
      expect(users).toContain("user2@example.com");
    });
  });
});
