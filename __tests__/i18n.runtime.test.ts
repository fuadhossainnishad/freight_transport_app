import i18next from "i18next"

import en from "../src/shared/i18n/locales/en"
import fr from "../src/shared/i18n/locales/fr"
import { I18N_BASE_OPTIONS } from "../src/shared/i18n/config"

// Exercises the real resources through the app's REAL config, so interpolation
// and plural-suffix mistakes surface here rather than on device. Never inline
// options here — Node has Intl.PluralRules and Hermes does not, so a test with
// its own config can pass while the device diverges.
const i18n = i18next.createInstance()

beforeAll(async () => {
  await i18n.init({
    ...I18N_BASE_OPTIONS,
    resources: { en: { translation: en }, fr: { translation: fr } },
    lng: "en",
  })
})

describe("i18n runtime", () => {
  it("translates in English", () => {
    expect(i18n.t("auth.login.title")).toBe("Login to Account")
  })

  it("translates in French after switching", async () => {
    await i18n.changeLanguage("fr")
    expect(i18n.t("auth.login.title")).toBe("Connexion au compte")
    await i18n.changeLanguage("en")
  })

  it("interpolates variables in both locales", async () => {
    expect(i18n.t("auth.verifyOtp.subtitle", { length: 6 })).toContain("6")

    await i18n.changeLanguage("fr")
    expect(i18n.t("auth.verifyOtp.subtitle", { length: 6 })).toContain("6")
    expect(i18n.t("validation.passwordMinLength", { min: 6 })).toBe(
      "Le mot de passe doit contenir au moins 6 caractères",
    )
    await i18n.changeLanguage("en")
  })

  it("pluralises via the v3 `_plural` suffix in both locales", async () => {
    // Guards two things at once: that we used the v3 suffix the device runs
    // (not `_one`/`_other`), and French's rule that 0 is singular — English
    // treats 0 as plural, so a naive `count === 1` ternary gets French wrong.
    await i18n.changeLanguage("en")
    expect(i18n.t("driver.home.activeDeliveries", { count: 1 })).toBe("1 active delivery")
    expect(i18n.t("driver.home.activeDeliveries", { count: 2 })).toBe("2 active deliveries")
    expect(i18n.t("driver.home.activeDeliveries", { count: 0 })).toBe("0 active deliveries")

    await i18n.changeLanguage("fr")
    expect(i18n.t("driver.home.activeDeliveries", { count: 1 })).toBe("1 livraison active")
    expect(i18n.t("driver.home.activeDeliveries", { count: 2 })).toBe("2 livraisons actives")
    expect(i18n.t("driver.home.activeDeliveries", { count: 0 })).toBe("0 livraison active")

    await i18n.changeLanguage("en")
  })

  it("has 12 distinct month names in each locale", async () => {
    // Mirrors MONTH_KEYS in src/shared/i18n/useMonthNames.ts.
    const monthKeys = [
      "january", "february", "march", "april", "may", "june",
      "july", "august", "september", "october", "november", "december",
    ].map((m) => `common.months.${m}`)

    for (const lng of ["en", "fr"]) {
      await i18n.changeLanguage(lng)
      const names = monthKeys.map((key) => i18n.t(key as any))

      expect(names).toHaveLength(12)
      // Catches copy-paste duplicates, which a parity test would not.
      expect(new Set(names).size).toBe(12)
      names.forEach((name) => expect(name).not.toMatch(/^common\.months\./))
    }

    await i18n.changeLanguage("en")
  })

  it("resolves every key to a real string, not the key itself", () => {
    type Json = { [key: string]: string | Json }
    const flatten = (obj: Json, prefix = ""): string[] =>
      Object.entries(obj).flatMap(([key, value]) =>
        typeof value === "object" && value !== null
          ? flatten(value, `${prefix}${key}.`)
          : [`${prefix}${key}`],
      )

    // A key that needs interpolation still resolves; we only assert it is not
    // echoed back verbatim, which is what i18next does on a lookup miss.
    for (const lng of ["en", "fr"]) {
      i18n.changeLanguage(lng)
      for (const key of flatten(en as Json)) {
        expect(i18n.t(key as any)).not.toBe(key)
      }
    }
  })
})
