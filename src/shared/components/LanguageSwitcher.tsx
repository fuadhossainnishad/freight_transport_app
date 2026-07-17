import React from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useTranslation } from "react-i18next"
import { Check } from "lucide-react-native"

import { useLanguage } from "../i18n/useLanguage"
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES } from "../i18n/languages"

const BLUE = "#036BB4"

type Props = {
  /** Hides the section header when the screen already provides one. */
  showTitle?: boolean
}

/**
 * Grouped-list language picker, styled to match the profile/settings cards.
 *
 * Uses StyleSheet rather than NativeWind classNames on purpose: this renders
 * inside StyleSheet-based screens (DriverProfilesScreen), and the className
 * version shipped visibly unstyled — no card, no row padding, and the tick
 * dropping below the label instead of anchoring right. StyleSheet removes that
 * variable entirely.
 */
export default function LanguageSwitcher({ showTitle = true }: Props) {
  const { t } = useTranslation()
  const { language, setLanguage } = useLanguage()

  return (
    <View>
      {showTitle && <Text style={styles.sectionHeader}>{t("language.title")}</Text>}

      <View style={styles.card}>
        {SUPPORTED_LANGUAGES.map((code, index) => {
          const selected = language === code

          return (
            <TouchableOpacity
              key={code}
              onPress={() => setLanguage(code)}
              activeOpacity={0.6}
              // Announce selection to screen readers rather than relying on the
              // tick alone.
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={LANGUAGE_LABELS[code]}
              style={[
                styles.row,
                index > 0 && styles.rowDivider,
                selected && styles.rowSelected,
              ]}
            >
              <Text style={[styles.label, selected && styles.labelSelected]}>
                {LANGUAGE_LABELS[code]}
              </Text>

              {selected && <Check size={20} color={BLUE} strokeWidth={2.5} />}
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 8,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    // Clears the 44pt minimum touch target.
    minHeight: 48,
  },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E7EB",
  },
  rowSelected: {
    backgroundColor: "#F1F6FB",
  },
  label: {
    fontSize: 16,
    color: "#6B7280",
  },
  labelSelected: {
    fontWeight: "600",
    color: "#1A1C1E",
  },
})
