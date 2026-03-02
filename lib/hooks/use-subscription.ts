/**
 * Subscription Hook
 *
 * Client-side hook for managing the user's Lemon Squeezy subscription state.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import type { SubscriptionStatus } from "@/lib/services/lemonsqueezy";

// ============================================================================
// Hook
// ============================================================================

export function useSubscription() {
  const { data: session, status: authStatus } = useSession();
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const fetchStatus = useCallback(async () => {
    if (authStatus !== "authenticated") return;
    setLoading(true);
    try {
      const res = await fetch("/api/subscriptions/status");
      if (res.ok) {
        const data: SubscriptionStatus = await res.json();
        setSubscription(data);
      }
    } catch {
      // Ignore errors — subscription status is best-effort
    } finally {
      setLoading(false);
    }
  }, [authStatus]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  /**
   * Redirect the user to a Lemon Squeezy hosted checkout page.
   */
  const startCheckout = useCallback(async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/subscriptions/checkout", {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to create checkout");
      }
      const { url } = await res.json();
      window.location.href = url as string;
    } catch (err) {
      console.error("Checkout error:", err);
      setCheckoutLoading(false);
    }
  }, []);

  return {
    subscription,
    isSubscribed: subscription?.active === true,
    loading,
    checkoutLoading,
    startCheckout,
    refreshStatus: fetchStatus,
  };
}
