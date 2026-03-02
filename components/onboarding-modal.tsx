"use client";

/**
 * OnboardingModal Component
 *
 * A multi-step introductory guide shown to first-time visitors.
 * Users can skip at any point or navigate step-by-step to the end.
 * Skipping / completing is persisted via the useOnboarding hook so the
 * modal is never shown again after a decision has been made.
 */

import React, { useState } from "react";
import { X, Upload, Sparkles, Download, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";

// ============================================================================
// Step definitions
// ============================================================================

function useSteps() {
  const t = useTranslation();
  return [
    {
      icon: <span className="text-5xl">🚴</span>,
      title: t("onboardingStep1Title"),
      description: t("onboardingStep1Desc"),
    },
    {
      icon: <Upload className="h-12 w-12 text-primary" />,
      title: t("onboardingStep2Title"),
      description: t("onboardingStep2Desc"),
    },
    {
      icon: <Sparkles className="h-12 w-12 text-primary" />,
      title: t("onboardingStep3Title"),
      description: t("onboardingStep3Desc"),
    },
    {
      icon: <Download className="h-12 w-12 text-primary" />,
      title: t("onboardingStep4Title"),
      description: t("onboardingStep4Desc"),
    },
  ];
}

// ============================================================================
// Component
// ============================================================================

interface OnboardingModalProps {
  onSkip: () => void;
  onComplete: () => void;
}

export function OnboardingModal({ onSkip, onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const t = useTranslation();
  const steps = useSteps();
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(0, s - 1));
  };

  const step = steps[currentStep];

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      {/* Panel */}
      <div className="relative w-full max-w-md rounded-2xl bg-background border shadow-2xl p-8">
        {/* Skip button */}
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={t("onboardingSkip")}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Step content */}
        <div className="flex flex-col items-center text-center gap-4 mb-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            {step.icon}
          </div>
          <h2 id="onboarding-title" className="text-xl font-bold">
            {step.title}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            {step.description}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8" aria-hidden="true">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? "w-6 bg-primary"
                  : i < currentStep
                  ? "w-2 bg-primary/50"
                  : "w-2 bg-muted-foreground/25"
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          {currentStep > 0 ? (
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t("onboardingBack")}
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={onSkip}>
              {t("onboardingSkip")}
            </Button>
          )}

          <Button onClick={handleNext} className="min-w-[100px]">
            {isLastStep ? (
              t("onboardingGetStarted")
            ) : (
              <>
                {t("onboardingNext")}
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
