"use client";

/**
 * Language Switcher Component
 * 
 * Allows users to switch between English, French, Spanish, German, Dutch, and Italian.
 */

import React from "react";
import { useI18n, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
}

const FLAGS: Record<Locale, string> = {
  en: "🇬🇧",
  fr: "🇫🇷",
  es: "🇪🇸",
  de: "🇩🇪",
  nl: "🇳🇱",
  it: "🇮🇹",
};

const LABELS: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  es: "ES",
  de: "DE",
  nl: "NL",
  it: "IT",
};

const LANGUAGE_NAMES: Record<Locale, string> = {
  en: "English",
  fr: "French",
  es: "Spanish",
  de: "German",
  nl: "Dutch",
  it: "Italian",
};

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { locale, setLocale } = useI18n();

  return (
    <div className={cn("flex items-center gap-1 bg-muted rounded-full p-1", className)}>
      {(["en", "fr", "es", "de", "nl", "it"] as Locale[]).map((lang) => (
        <button
          key={lang}
          onClick={() => setLocale(lang)}
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors",
            locale === lang
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={`Switch to ${LANGUAGE_NAMES[lang]}`}
        >
          <span>{FLAGS[lang]}</span>
          <span>{LABELS[lang]}</span>
        </button>
      ))}
    </div>
  );
}
