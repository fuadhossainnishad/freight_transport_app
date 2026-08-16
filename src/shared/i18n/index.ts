import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import * as RNLocalize from "react-native-localize"

// .ts, not .json — see the note in locales/en.ts. Metro served stale cached
// JSON modules here, which surfaced as raw keys on device.
import en from "./locales/en"
import fr from "./locales/fr"
import { getStoredLanguage, storeLanguage } from "./languageStorage"
import { logger } from "../utils/logger"
import { I18N_BASE_OPTIONS } from "./config"
import {
  FALLBACK_LANGUAGE,
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
} from "./languages"

// Metro injects `module.hot` in dev builds; it is not part of the React Native
// type surface, so declare the slice we use.
declare const module: { hot?: { accept: (callback: () => void) => void } }

export const resources = {
  en: { translation: en },
  fr: { translation: fr },
} as const

/**
 * Best match between the device's preferred locales and what we ship.
 * `fr-CA`, `fr-FR` etc. all collapse to `fr`.
 *
 * findBestLanguageTag is a native call. It must never be allowed to throw out
 * of here: picking a language is optional, but loading the translations is not,
 * and an uninitialised i18next renders raw keys ("nav.tabs.home") to the user.
 */
export const detectDeviceLanguage = (): SupportedLanguage => {
  try {
    const best = RNLocalize.findBestLanguageTag([...SUPPORTED_LANGUAGES])
    const base = best?.languageTag.split("-")[0]
    return (SUPPORTED_LANGUAGES as readonly string[]).includes(base ?? "")
      ? (base as SupportedLanguage)
      : FALLBACK_LANGUAGE
  } catch (error) {
    logger.warn("i18n: device locale detection failed, using fallback", error)
    return FALLBACK_LANGUAGE
  }
}

/** The user's saved choice, else the device locale, else English. */
const resolveInitialLanguage = async (): Promise<SupportedLanguage> => {
  try {
    return (await getStoredLanguage()) ?? detectDeviceLanguage()
  } catch (error) {
    logger.warn("i18n: could not resolve initial language, using fallback", error)
    return FALLBACK_LANGUAGE
  }
}

export const initI18n = async () => {
  // Resolved defensively first, so nothing between here and init() can stop the
  // resources from loading.
  const lng = await resolveInitialLanguage()

  await i18n.use(initReactI18next).init({
    ...I18N_BASE_OPTIONS,
    resources,
    lng,
    // Dev-only: turn a silent raw key on screen into a loud console error that
    // names the cause. Every raw-key report so far has been a stale in-memory
    // resource snapshot, which is invisible without this.
    saveMissing: __DEV__,
    missingKeyHandler: __DEV__
      ? (_lngs, _ns, key) => {
          logger.error(
            `i18n: MISSING KEY "${key}" — it rendered as raw text. ` +
              "If you just added it to en.json/fr.json, FULLY reload the app: " +
              "Fast Refresh swaps components but does not re-run initI18n, so " +
              "i18next keeps the resources it loaded at startup.",
          )
        }
      : undefined,
  })

  if (__DEV__) {
    // Canary: proves the resources actually reached the running JS. A stale
    // Metro cache serves old locale JSON, which makes every screen render raw
    // keys while init itself reports success — indistinguishable otherwise.
    const canary = i18n.t("nav.tabs.home")
    if (canary === "nav.tabs.home") {
      logger.error(
        "i18n: initialised but resources are MISSING (canary key did not resolve). " +
          "The running bundle has stale locale JSON — restart Metro with: " +
          "npx react-native start --reset-cache",
      )
    } else {
      logger.info(
        `i18n: ready (lng=${i18n.resolvedLanguage}, keys loaded, canary="${canary}")`,
      )
    }
  }

  return i18n
}

/** Switches language and remembers the choice across launches. */
export const changeLanguage = async (language: SupportedLanguage) => {
  await i18n.changeLanguage(language)
  await storeLanguage(language)
}

/**
 * Dev-only: make edits to the locale JSON take effect on Fast Refresh.
 *
 * i18next copies the resources into memory during init() and never re-reads the
 * modules. Fast Refresh swaps the component and JSON modules but does NOT re-run
 * initI18n, so a newly added key renders as a raw key ("driver.tracking.foo")
 * until a full app reload. Re-injecting the bundles here closes that gap.
 *
 * Guarded and swallowed on purpose: if Metro's HMR contract differs, the worst
 * case is the pre-existing behaviour (do a full reload), never a broken app.
 */
if (__DEV__ && (module as any)?.hot) {
  ;(module as any).hot.accept(() => {
    try {
      if (!i18n.isInitialized) return
      // `true, true` = deep merge + overwrite existing keys.
      i18n.addResourceBundle("en", "translation", require("./locales/en").default, true, true)
      i18n.addResourceBundle("fr", "translation", require("./locales/fr").default, true, true)
      // Nudge subscribed components to re-render with the new bundles.
      i18n.changeLanguage(i18n.language)
      logger.info("i18n: locale resources hot-reloaded")
    } catch (error) {
      logger.warn("i18n: hot reload of locales failed — do a full app reload", error)
    }
  })
}

export * from "./languages"
export default i18n
