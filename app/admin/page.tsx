"use client";

/**
 * Admin Panel
 *
 * Accessible only to users listed in the ADMIN_USERS environment variable.
 * Provides:
 *  - Settings management (system prompt, user prompt template)
 *  - User management (block / unblock users by email, per-user daily limit overrides)
 */

import React, { useState, useEffect, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Save, UserX, Trash2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================================================
// Types
// ============================================================================

interface AdminSettings {
  systemPrompt: string;
  userPromptTemplate: string;
  dailyLimit: number;
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
            <label className="text-sm font-medium" htmlFor="dailyLimit">
              Daily Analysis Limit
            </label>
            <p className="text-xs text-muted-foreground">
              Maximum number of image analyses allowed per user per day.
            </p>
            <input
              id="dailyLimit"
              type="number"
              min={1}
              className="w-32 rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={settings.dailyLimit}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 1) {
                  setSettings((s) => s && { ...s, dailyLimit: val });
                }
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
  const [userLimits, setUserLimits] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [blocking, setBlocking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Per-user limit form state
  const [limitEmail, setLimitEmail] = useState("");
  const [limitValue, setLimitValue] = useState("");
  const [savingLimit, setSavingLimit] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setBlockedUsers(data.blockedUsers ?? []);
      setUserLimits(data.userLimits ?? {});
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

  const handleSetLimit = useCallback(async () => {
    const email = limitEmail.trim().toLowerCase();
    const val = parseInt(limitValue, 10);
    if (!email || isNaN(val) || val < 1) return;
    setSavingLimit(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, dailyLimit: val }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to set limit");
      }
      setLimitEmail("");
      setLimitValue("");
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set limit");
    } finally {
      setSavingLimit(false);
    }
  }, [limitEmail, limitValue, loadUsers]);

  const handleRemoveLimit = useCallback(
    async (email: string) => {
      setError(null);
      try {
        const res = await fetch("/api/admin/users", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, dailyLimit: null }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? "Failed to remove limit");
        }
        await loadUsers();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to remove limit");
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

      {/* Per-user daily limit overrides */}
      <h3 className="text-base font-semibold mt-8 mb-3">Per-User Daily Limit Overrides</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Set a custom daily analysis limit for a specific user, overriding the global setting.
      </p>

      <div className="flex gap-2 mb-6">
        <input
          type="email"
          placeholder="user@example.com"
          value={limitEmail}
          onChange={(e) => setLimitEmail(e.target.value)}
          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          type="number"
          min={1}
          placeholder="Limit"
          value={limitValue}
          onChange={(e) => setLimitValue(e.target.value)}
          className="w-24 rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button
          onClick={handleSetLimit}
          disabled={savingLimit || !limitEmail.trim() || !limitValue || parseInt(limitValue, 10) < 1}
        >
          {savingLimit ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Set
            </>
          )}
        </Button>
      </div>

      {!loading && Object.keys(userLimits).length === 0 ? (
        <p className="text-sm text-muted-foreground">No per-user limit overrides set.</p>
      ) : (
        <ul className="divide-y border rounded-md overflow-hidden">
          {Object.entries(userLimits).map(([email, limit]) => (
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
                  onClick={() => handleRemoveLimit(email)}
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
