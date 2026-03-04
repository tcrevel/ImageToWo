"use client";

/**
 * Admin Panel
 *
 * Accessible only to users listed in the ADMIN_USERS environment variable.
 * Provides:
 *  - Settings management (system prompt, user prompt template, daily parse limit)
 *  - User management (block / unblock users by email)
 *  - User limit overrides (per-user daily analysis limit)
 */

import React, { useState, useEffect, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Save, UserX, Trash2, ShieldAlert, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================================================
// Types
// ============================================================================

interface AdminSettings {
  systemPrompt: string;
  userPromptTemplate: string;
  dailyParseLimit: number | null;
}

interface UserLimit {
  email: string;
  limit: number;
}

// ============================================================================
// Component
// ============================================================================

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect non-admins once the session is loaded
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("google");
    } else if (status === "authenticated" && !session.user?.isAdmin) {
      router.replace("/");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session?.user?.isAdmin) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push("/")}>
            ← Back to App
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-10">
        <SettingsSection />
        <UsersSection />
        <UserLimitsSection />
      </div>
    </main>
  );
}

// ============================================================================
// Settings Section
// ============================================================================

function SettingsSection() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data: AdminSettings) => setSettings(data))
      .catch(() => setError("Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = useCallback(async () => {
    if (!settings) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Save failed");
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }, [settings]);

  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">AI Prompt Settings</h2>

      {loading && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading…
        </div>
      )}

      {!loading && settings && (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="dailyParseLimit">
              Daily Analysis Limit
            </label>
            <p className="text-xs text-muted-foreground">
              Maximum number of workout analyses per user per day. Leave empty
              to use the environment default (currently 5).
            </p>
            <input
              id="dailyParseLimit"
              type="number"
              min={0}
              placeholder="e.g. 10 (leave empty for env default)"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={settings.dailyParseLimit ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                setSettings(
                  (s) =>
                    s && {
                      ...s,
                      dailyParseLimit: val === "" ? null : parseInt(val, 10),
                    }
                );
              }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="systemPrompt">
              System Prompt
            </label>
            <p className="text-xs text-muted-foreground">
              Instructs the AI on how to analyze workout images.
            </p>
            <textarea
              id="systemPrompt"
              className="w-full min-h-[280px] rounded-md border bg-background px-3 py-2 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-ring"
              value={settings.systemPrompt}
              onChange={(e) =>
                setSettings((s) => s && { ...s, systemPrompt: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="userPrompt">
              User Prompt Template
            </label>
            <p className="text-xs text-muted-foreground">
              Base instruction sent with each image. FTP, locale, and note
              context is appended automatically.
            </p>
            <textarea
              id="userPrompt"
              className="w-full min-h-[80px] rounded-md border bg-background px-3 py-2 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-ring"
              value={settings.userPromptTemplate}
              onChange={(e) =>
                setSettings(
                  (s) => s && { ...s, userPromptTemplate: e.target.value }
                )
              }
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          {success && (
            <p className="text-sm text-green-600 dark:text-green-400">
              Settings saved successfully.
            </p>
          )}

          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      )}
    </section>
  );
}

// ============================================================================
// Users Section
// ============================================================================

function UsersSection() {
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [blocking, setBlocking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setBlockedUsers(data.blockedUsers ?? []);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleBlock = useCallback(async () => {
    const email = newEmail.trim().toLowerCase();
    if (!email) return;
    setBlocking(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Block failed");
      }
      setNewEmail("");
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Block failed");
    } finally {
      setBlocking(false);
    }
  }, [newEmail, loadUsers]);

  const handleUnblock = useCallback(
    async (email: string) => {
      setError(null);
      try {
        const res = await fetch(
          `/api/admin/users?email=${encodeURIComponent(email)}`,
          { method: "DELETE" }
        );
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? "Unblock failed");
        }
        await loadUsers();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unblock failed");
      }
    },
    [loadUsers]
  );

  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">User Management</h2>

      {/* Block a user */}
      <div className="flex gap-2 mb-6">
        <input
          type="email"
          placeholder="user@example.com"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleBlock()}
          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button
          variant="destructive"
          onClick={handleBlock}
          disabled={blocking || !newEmail.trim()}
        >
          {blocking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <UserX className="h-4 w-4 mr-2" />
              Block
            </>
          )}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      {/* Blocked users list */}
      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading…
        </div>
      ) : blockedUsers.length === 0 ? (
        <p className="text-sm text-muted-foreground">No users are currently blocked.</p>
      ) : (
        <ul className="divide-y border rounded-md overflow-hidden">
          {blockedUsers.map((email) => (
            <li
              key={email}
              className="flex items-center justify-between px-4 py-3 text-sm bg-background"
            >
              <span className="font-mono">{email}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleUnblock(email)}
                title="Unblock user"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// ============================================================================
// User Limits Section
// ============================================================================

function UserLimitsSection() {
  const [userLimits, setUserLimits] = useState<UserLimit[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [newLimit, setNewLimit] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLimits = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/user-limits");
      const data = await res.json();
      const limits: UserLimit[] = Object.entries(
        (data.userLimits ?? {}) as Record<string, number>
      ).map(([email, limit]) => ({ email, limit }));
      setUserLimits(limits);
    } catch {
      setError("Failed to load user limits");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLimits();
  }, [loadLimits]);

  const handleSet = useCallback(async () => {
    const email = newEmail.trim().toLowerCase();
    const limit = parseInt(newLimit, 10);
    if (!email || isNaN(limit) || limit < 0) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/user-limits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, limit }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to set limit");
      }
      setNewEmail("");
      setNewLimit("");
      await loadLimits();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set limit");
    } finally {
      setSaving(false);
    }
  }, [newEmail, newLimit, loadLimits]);

  const handleRemove = useCallback(
    async (email: string) => {
      setError(null);
      try {
        const res = await fetch(
          `/api/admin/user-limits?email=${encodeURIComponent(email)}`,
          { method: "DELETE" }
        );
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? "Failed to remove limit");
        }
        await loadLimits();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to remove limit");
      }
    },
    [loadLimits]
  );

  return (
    <section>
      <h2 className="text-lg font-semibold mb-1">Per-User Limit Overrides</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Override the daily analysis limit for specific users. Overrides take
        precedence over the global daily limit setting above.
      </p>

      {/* Set a user limit */}
      <div className="flex gap-2 mb-6">
        <input
          type="email"
          placeholder="user@example.com"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          type="number"
          min={0}
          placeholder="Limit"
          value={newLimit}
          onChange={(e) => setNewLimit(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSet()}
          className="w-24 rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button
          onClick={handleSet}
          disabled={saving || !newEmail.trim() || newLimit === ""}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Set
            </>
          )}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      {/* User limits list */}
      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading…
        </div>
      ) : userLimits.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No per-user overrides set. All users use the global limit.
        </p>
      ) : (
        <ul className="divide-y border rounded-md overflow-hidden">
          {userLimits.map(({ email, limit }) => (
            <li
              key={email}
              className="flex items-center justify-between px-4 py-3 text-sm bg-background"
            >
              <span className="font-mono">{email}</span>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">{limit} / day</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(email)}
                  title="Remove limit override"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
