"use client";

/**
 * Onboarding Hook
 *
 * Manages whether the onboarding modal should be shown.
 * The preference is persisted in localStorage so users who skip or complete
 * the onboarding are never prompted again.
 */

import { useState, useEffect, useCallback } from "react";

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = "imagetowo-onboarding";
type OnboardingStatus = "pending" | "skipped" | "completed";

// ============================================================================
// Hook
// ============================================================================

export function useOnboarding() {
  const [status, setStatus] = useState<OnboardingStatus | null>(null);

  // Read from localStorage on mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as OnboardingStatus | null;
      setStatus(stored ?? "pending");
    } catch {
      setStatus("pending");
    }
  }, []);

  const persist = useCallback((next: OnboardingStatus) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage blocked or full — ignore
    }
    setStatus(next);
  }, []);

  const skipOnboarding = useCallback(() => persist("skipped"), [persist]);
  const completeOnboarding = useCallback(() => persist("completed"), [persist]);

  return {
    /** True only on the very first visit (not yet seen, skipped, or completed). */
    isOpen: status === "pending",
    skipOnboarding,
    completeOnboarding,
  };
}
