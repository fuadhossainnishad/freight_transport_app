import { FALLBACK_LANGUAGE } from "./languages"

/**
 * i18next options shared by the app and the tests.
 *
 * This lives in its own module (no react-native imports) so tests can load the
 * EXACT config the device runs. Do not inline these options into a test: Node
 * and Hermes disagree about Intl, so a test with its own config can pass while
 * the device behaves differently — which is precisely how a plural-format bug
 * would slip through.
 */
export const I18N_BASE_OPTIONS = {
  fallbackLng: FALLBACK_LANGUAGE,
  // React already escapes rendered values.
  interpolation: { escapeValue: false },
  returnNull: false,
  // Hermes ships a partial Intl with no Intl.PluralRules, so i18next cannot use
  // the v4 plural format and would downgrade to v3 at runtime anyway (logging a
  // scary error while doing it). Declaring v3 up front keeps device and tests
  // identical.
  //
  // v3 plural keys use the `_plural` suffix, NOT `_one`/`_other`:
  //   "activeDeliveries": "{{count}} active delivery"
  //   "activeDeliveries_plural": "{{count}} active deliveries"
  // `count` is the one interpolation name that legitimately means pluralise.
  compatibilityJSON: "v3",
} as const
