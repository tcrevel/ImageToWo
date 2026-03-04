/**
 * Admin Settings Service
 *
 * Stores and retrieves admin-configurable settings:
 * - systemPrompt: The system prompt used with OpenAI GPT-4 Vision
 * - userPromptTemplate: The base user prompt template
 * - blockedUsers: Emails of users blocked from using the service
 *
 * Uses Redis for persistence when available, falls back to in-memory storage.
 */

import { DEFAULT_SYSTEM_PROMPT, DEFAULT_USER_PROMPT_TEMPLATE } from "@/lib/services/openai";
import { getRedisClient } from "@/lib/services/redis";

// ============================================================================
// Types
// ============================================================================

export interface AdminSettings {
  systemPrompt: string;
  userPromptTemplate: string;
}

// ============================================================================
// Redis Keys
// ============================================================================

const SETTINGS_KEY = "admin:settings";
const BLOCKED_USERS_KEY = "admin:blocked_users";

// ============================================================================
// In-Memory Fallback
// ============================================================================

const memorySettings: AdminSettings = {
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
  userPromptTemplate: DEFAULT_USER_PROMPT_TEMPLATE,
};

const memoryBlockedUsers = new Set<string>();

// ============================================================================
// Settings Operations
// ============================================================================

/**
 * Get current admin settings (Redis or in-memory fallback)
 */
export async function getAdminSettings(): Promise<AdminSettings> {
  const redis = getRedisClient();

  if (redis) {
    try {
      const raw = await redis.get(SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AdminSettings>;
        return {
          systemPrompt: parsed.systemPrompt ?? DEFAULT_SYSTEM_PROMPT,
          userPromptTemplate:
            parsed.userPromptTemplate ?? DEFAULT_USER_PROMPT_TEMPLATE,
        };
      }
    } catch (error) {
      console.error("Redis getAdminSettings error:", error);
    }
  }

  return { ...memorySettings };
}

/**
 * Update admin settings (Redis or in-memory fallback)
 */
export async function updateAdminSettings(
  updates: Partial<AdminSettings>
): Promise<AdminSettings> {
  const current = await getAdminSettings();
  const next: AdminSettings = { ...current, ...updates };

  const redis = getRedisClient();

  if (redis) {
    try {
      await redis.set(SETTINGS_KEY, JSON.stringify(next));
      return next;
    } catch (error) {
      console.error("Redis updateAdminSettings error:", error);
    }
  }

  // In-memory fallback
  if (updates.systemPrompt !== undefined) {
    memorySettings.systemPrompt = updates.systemPrompt;
  }
  if (updates.userPromptTemplate !== undefined) {
    memorySettings.userPromptTemplate = updates.userPromptTemplate;
  }

  return { ...memorySettings };
}

// ============================================================================
// Blocked Users Operations
// ============================================================================

/**
 * Get the list of blocked user emails (Redis or in-memory fallback)
 */
export async function getBlockedUsers(): Promise<string[]> {
  const redis = getRedisClient();

  if (redis) {
    try {
      const members = await redis.smembers(BLOCKED_USERS_KEY);
      return members;
    } catch (error) {
      console.error("Redis getBlockedUsers error:", error);
    }
  }

  return Array.from(memoryBlockedUsers);
}

/**
 * Check if a user email is blocked
 */
export async function isUserBlocked(email: string): Promise<boolean> {
  const redis = getRedisClient();

  if (redis) {
    try {
      const isMember = await redis.sismember(BLOCKED_USERS_KEY, email);
      return isMember === 1;
    } catch (error) {
      console.error("Redis isUserBlocked error:", error);
    }
  }

  return memoryBlockedUsers.has(email);
}

/**
 * Block a user by email
 */
export async function blockUser(email: string): Promise<void> {
  const redis = getRedisClient();

  if (redis) {
    try {
      await redis.sadd(BLOCKED_USERS_KEY, email);
      return;
    } catch (error) {
      console.error("Redis blockUser error:", error);
    }
  }

  memoryBlockedUsers.add(email);
}

/**
 * Unblock a user by email
 */
export async function unblockUser(email: string): Promise<void> {
  const redis = getRedisClient();

  if (redis) {
    try {
      await redis.srem(BLOCKED_USERS_KEY, email);
      return;
    } catch (error) {
      console.error("Redis unblockUser error:", error);
    }
  }

  memoryBlockedUsers.delete(email);
}
