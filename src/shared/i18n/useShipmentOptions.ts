import { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"

import {
  CATEGORY_OPTIONS,
  PACKAGING_OPTIONS,
  ShipmentOption,
  optionLabelKey,
} from "../../domain/constants/shipmentOptions"

export type DisplayOption = { value: string; label: string }

/**
 * Translated category/packaging lists plus the reverse lookup screens need when
 * rendering a value the backend gave them.
 *
 * Keeps one rule in one place: the UI shows `label`, the API only ever sees
 * `value`.
 */
export const useShipmentOptions = () => {
  const { t, i18n } = useTranslation()

  const toDisplay = useCallback(
    (options: ShipmentOption[]): DisplayOption[] =>
      options.map((o) => ({ value: o.value, label: t(o.labelKey) })),
    [t],
  )

  const categories = useMemo(
    () => toDisplay(CATEGORY_OPTIONS),
    // i18n.language: t() is stable across renders but its output is not.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [toDisplay, i18n.language],
  )

  const packaging = useMemo(
    () => toDisplay(PACKAGING_OPTIONS),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [toDisplay, i18n.language],
  )

  /** Value -> label. Unknown values (legacy rows) render as-is, never blank. */
  const labelFor = useCallback(
    (options: ShipmentOption[], value?: string | null): string => {
      const key = optionLabelKey(options, value)
      return key ? t(key) : value ?? ""
    },
    [t],
  )

  const categoryLabel = useCallback(
    (value?: string | null) => labelFor(CATEGORY_OPTIONS, value),
    [labelFor],
  )

  const packagingLabel = useCallback(
    (value?: string | null) => labelFor(PACKAGING_OPTIONS, value),
    [labelFor],
  )

  return { categories, packaging, categoryLabel, packagingLabel }
}
