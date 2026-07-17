/**
 * A raw translation key on screen has cost several round-trips because it fails
 * silently. This pins the dev-only handler that makes it loud.
 */
jest.mock("react-native-localize", () => ({
  findBestLanguageTag: () => ({ languageTag: "en", isRTL: false }),
}))

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => undefined),
  removeItem: jest.fn(async () => undefined),
}))

describe("i18n missing-key reporting", () => {
  it("logs a loud, actionable error when a key does not resolve", async () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {})

    const { initI18n } = require("../src/shared/i18n")
    const i18n = require("../src/shared/i18n").default
    await initI18n()

    // Simulates the on-device symptom: component asks for a key the loaded
    // resources don't have (e.g. added after i18next initialised).
    const rendered = i18n.t("driver.tracking.doesNotExistYet")

    expect(rendered).toBe("driver.tracking.doesNotExistYet") // renders raw
    const logged = spy.mock.calls.flat().join(" ")
    expect(logged).toContain("MISSING KEY")
    expect(logged).toContain("driver.tracking.doesNotExistYet")
    // The message must tell the reader what to actually do.
    expect(logged).toContain("FULLY reload")

    spy.mockRestore()
  })

  it("does not fire for keys that exist", async () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {})

    const i18n = require("../src/shared/i18n").default
    expect(i18n.t("driver.tracking.pickupLocationMissing")).toBe(
      "This shipment's pickup location isn't available yet.",
    )
    expect(spy.mock.calls.flat().join(" ")).not.toContain("MISSING KEY")

    spy.mockRestore()
  })
})
