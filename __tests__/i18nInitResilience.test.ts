/**
 * Reproduces the "raw translation keys on screen" failure.
 *
 * Device-locale detection is a NATIVE call. If it throws for any reason, the
 * whole init must NOT be lost — translations have nothing to do with locale
 * detection, and failing to load them renders `nav.tabs.home` to the user.
 */
jest.mock("react-native-localize", () => ({
  findBestLanguageTag: () => {
    throw new Error("RNLocalize: NativeModule.RNLocalize is null")
  },
}))

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => undefined),
  removeItem: jest.fn(async () => undefined),
}))

describe("i18n init resilience", () => {
  it("still translates when device locale detection throws", async () => {
    const { initI18n } = require("../src/shared/i18n")
    const i18n = require("../src/shared/i18n").default

    await initI18n()

    // The exact symptom from the screenshot: these must not echo back.
    expect(i18n.t("nav.tabs.home")).toBe("Home")
    expect(i18n.t("components.statCard.thisMonth")).toBe("This Month")
  })
})
