/**
 * Admin Settings Service
 *
 * Stores and retrieves admin-configurable settings:
 * - systemPrompt: The system prompt used with OpenAI GPT-4 Vision
 * - userPromptTemplate: The base user prompt template
 * - dailyParseLimit: Global daily analysis limit per user (null = use env default)
 * - blockedUsers: Emails of users blocked from using the service
 * - userLimits: Per-user daily analysis limit overrides (keyed by email)
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
  dailyParseLimit: number | null;
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

const memorySettings: AdminSettings = {
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
  userPromptTemplate: DEFAULT_USER_PROMPT_TEMPLATE,
  dailyParseLimit: null,
};

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
          dailyParseLimit: parsed.dailyParseLimit ?? null,
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
  if ("dailyParseLimit" in updates) {
    memorySettings.dailyParseLimit = updates.dailyParseLimit ?? null;
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

// ============================================================================
// User Limit Operations
// ============================================================================

/**
 * Get all per-user daily limit overrides (Redis or in-memory fallback)
 */
export async function getUserLimits(): Promise<Record<string, number>> {
  const redis = getRedisClient();

  if (redis) {
    try {
      const raw = await redis.get(USER_LIMITS_KEY);
      if (raw) {
        return JSON.parse(raw) as Record<string, number>;
      }
      return {};
    } catch (error) {
      console.error("Redis getUserLimits error:", error);
    }
  }

  return Object.fromEntries(memoryUserLimits);
}

/**
 * Get daily limit override for a specific user email (null if not set)
 */
export async function getUserLimit(email: string): Promise<number | null> {
  const limits = await getUserLimits();
  const key = email.trim().toLowerCase();
  return key in limits ? limits[key] : null;
}

/**
 * Set daily limit override for a specific user email
 */
export async function setUserLimit(email: string, limit: number): Promise<void> {
  const key = email.trim().toLowerCase();
  const redis = getRedisClient();

  if (redis) {
    try {
      const raw = await redis.get(USER_LIMITS_KEY);
      const limits: Record<string, number> = raw ? JSON.parse(raw) : {};
      limits[key] = limit;
      await redis.set(USER_LIMITS_KEY, JSON.stringify(limits));
      return;
    } catch (error) {
      console.error("Redis setUserLimit error:", error);
    }
  }

  memoryUserLimits.set(key, limit);
}

/**
 * Remove daily limit override for a specific user email
 */
export async function removeUserLimit(email: string): Promise<void> {
  const key = email.trim().toLowerCase();
  const redis = getRedisClient();

  if (redis) {
    try {
      const raw = await redis.get(USER_LIMITS_KEY);
      if (raw) {
        const limits: Record<string, number> = JSON.parse(raw);
        delete limits[key];
        await redis.set(USER_LIMITS_KEY, JSON.stringify(limits));
      }
      return;
    } catch (error) {
      console.error("Redis removeUserLimit error:", error);
    }
  }

  memoryUserLimits.delete(key);
}
