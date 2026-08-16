import { useMemo } from "react"
import { useTranslation } from "react-i18next"

const MONTH_KEYS = [
  "common.months.january",
  "common.months.february",
  "common.months.march",
  "common.months.april",
  "common.months.may",
  "common.months.june",
  "common.months.july",
  "common.months.august",
  "common.months.september",
  "common.months.october",
  "common.months.november",
  "common.months.december",
] as const

/**
 * Month names in the active language, January-first.
 *
 * Display only. Do NOT use this to build a string that gets submitted to the
 * backend — `DatePickerField` deliberately keeps English month names because
 * its formatted output is stored as the `date_preference` field and sent
 * verbatim to the API.
 */
export const useMonthNames = (): string[] => {
  const { t, i18n } = useTranslation()

  return useMemo(
    () => MONTH_KEYS.map((key) => t(key)),
    // i18n.language is the dependency that matters: t() is stable across
    // renders but its output changes when the language does.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, i18n.language],
  )
}
