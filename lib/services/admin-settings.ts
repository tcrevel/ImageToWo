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
import { getServerEnv } from "@/lib/utils/env";

// ============================================================================
// Types
// ============================================================================

export interface AdminSettings {
  systemPrompt: string;
  userPromptTemplate: string;
  dailyLimit: number;
}

// ============================================================================
// Redis Keys
// ============================================================================

const SETTINGS_KEY = "admin:settings";
const BLOCKED_USERS_KEY = "admin:blocked_users";
const USER_LIMITS_KEY = "admin:user_limits";

// ============================================================================
// In-Memory Fallback
// ============================================================================

// In-memory settings (dailyLimit is lazily initialized from env on first read)
let memorySettingsInitialized = false;
const memorySettings: AdminSettings = {
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
  userPromptTemplate: DEFAULT_USER_PROMPT_TEMPLATE,
  dailyLimit: 5, // placeholder; replaced with env value on first read
};

function getMemorySettings(): AdminSettings {
  if (!memorySettingsInitialized) {
    memorySettings.dailyLimit = getServerEnv().DAILY_PARSE_LIMIT;
    memorySettingsInitialized = true;
  }
  return memorySettings;
}

const memoryBlockedUsers = new Set<string>();
const memoryUserLimits = new Map<string, number>();

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
          dailyLimit: parsed.dailyLimit ?? getServerEnv().DAILY_PARSE_LIMIT,
        };
      }
    } catch (error) {
      console.error("Redis getAdminSettings error:", error);
    }
  }

  return { ...getMemorySettings() };
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
  const settings = getMemorySettings();
  if (updates.systemPrompt !== undefined) {
    settings.systemPrompt = updates.systemPrompt;
  }
  if (updates.userPromptTemplate !== undefined) {
    settings.userPromptTemplate = updates.userPromptTemplate;
  }
  if (updates.dailyLimit !== undefined) {
    settings.dailyLimit = updates.dailyLimit;
  }

  return { ...settings };
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

// ============================================================================
// Per-User Daily Limit Overrides
// ============================================================================

/**
 * Get all per-user daily limit overrides (Redis or in-memory fallback)
 */
export async function getUserDailyLimits(): Promise<Record<string, number>> {
  const redis = getRedisClient();

  if (redis) {
    try {
      const raw = await redis.hgetall(USER_LIMITS_KEY);
      if (raw) {
        const result: Record<string, number> = {};
        for (const [email, val] of Object.entries(raw)) {
          const parsed = parseInt(val as string, 10);
          if (!isNaN(parsed)) result[email] = parsed;
        }
        return result;
      }
      return {};
    } catch (error) {
      console.error("Redis getUserDailyLimits error:", error);
    }
  }

  return Object.fromEntries(memoryUserLimits);
}

/**
 * Get per-user daily limit override for a specific email, or null if none set
 */
export async function getUserDailyLimit(email: string): Promise<number | null> {
  const redis = getRedisClient();

  if (redis) {
    try {
      const val = await redis.hget(USER_LIMITS_KEY, email);
      if (val !== null) {
        const parsed = parseInt(val, 10);
        return isNaN(parsed) ? null : parsed;
      }
      return null;
    } catch (error) {
      console.error("Redis getUserDailyLimit error:", error);
    }
  }

  return memoryUserLimits.has(email) ? memoryUserLimits.get(email)! : null;
}

/**
 * Set a per-user daily limit override
 */
export async function setUserDailyLimit(email: string, limit: number): Promise<void> {
  const redis = getRedisClient();

  if (redis) {
    try {
      await redis.hset(USER_LIMITS_KEY, email, limit.toString());
      return;
    } catch (error) {
      console.error("Redis setUserDailyLimit error:", error);
    }
  }

  memoryUserLimits.set(email, limit);
}

/**
 * Delete a per-user daily limit override (revert to global limit)
 */
export async function deleteUserDailyLimit(email: string): Promise<void> {
  const redis = getRedisClient();

  if (redis) {
    try {
      await redis.hdel(USER_LIMITS_KEY, email);
      return;
    } catch (error) {
      console.error("Redis deleteUserDailyLimit error:", error);
    }
  }

  memoryUserLimits.delete(email);
}
