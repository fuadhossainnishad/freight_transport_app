import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { changeLanguage, detectDeviceLanguage, initI18n } from "./index"
import { clearStoredLanguage } from "./languageStorage"
import { logger } from "../utils/logger"
import { FALLBACK_LANGUAGE, SupportedLanguage } from "./languages"

/**
 * Current language plus the setters. `language` tracks i18next, so any
 * component using this re-renders on switch.
 */
export const useLanguage = () => {
  const { i18n } = useTranslation()

  const language = (i18n.resolvedLanguage ?? FALLBACK_LANGUAGE) as SupportedLanguage

  const setLanguage = useCallback(
    (next: SupportedLanguage) => changeLanguage(next),
    [],
  )

  const useDeviceLanguage = useCallback(async () => {
    await clearStoredLanguage()
    await i18n.changeLanguage(detectDeviceLanguage())
  }, [i18n])

  return { language, setLanguage, useDeviceLanguage }
}

/**
 * Gates the first render until the stored language has been read, so the UI
 * never flashes English before switching to French.
 */
export const useI18nReady = () => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    initI18n()
      .catch((error) => {
        // Do NOT swallow this. An i18next that failed to init renders raw keys
        // ("nav.tabs.home") on every screen, so this must be loud rather than
        // look like a translation typo.
        logger.error(
          "i18n: init failed — the UI will render raw translation keys",
          error,
        )
      })
      .finally(() => {
        if (!cancelled) setReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return ready
}
