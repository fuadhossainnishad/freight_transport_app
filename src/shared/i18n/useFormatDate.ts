import { useCallback } from "react"

import { useMonthNames } from "./useMonthNames"

/** Shown when a date is missing or unparseable. */
const EMPTY = "—"

/**
 * Formats an API date for display in the active language: "25 June 2026" /
 * "25 juin 2026".
 *
 * Built on useMonthNames() rather than `toLocaleDateString(language)` on
 * purpose. Hermes ships a PARTIAL Intl — it has no `Intl.PluralRules`, which is
 * why the app runs `compatibilityJSON: "v3"` — so leaning on
 * `Intl.DateTimeFormat` risks breaking dates on device in a way Node-based tests
 * would never catch (Node has full ICU). This path needs no Intl at all.
 *
 * Display only. Never use this to build a value that gets submitted — see
 * `shared/utils/dateWireFormat.ts` for the wire format, which stays English.
 */
export const useFormatDate = () => {
  const months = useMonthNames()

  return useCallback(
    (value?: string | null): string => {
      if (!value) return EMPTY

      const date = new Date(value)
      if (isNaN(date.getTime())) return EMPTY

      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
    },
    [months],
  )
}
