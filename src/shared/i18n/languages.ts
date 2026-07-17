export const SUPPORTED_LANGUAGES = ["en", "fr"] as const

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const FALLBACK_LANGUAGE: SupportedLanguage = "en"

/** Labels are intentionally shown in their own language, not translated. */
export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: "English",
  fr: "Français",
}