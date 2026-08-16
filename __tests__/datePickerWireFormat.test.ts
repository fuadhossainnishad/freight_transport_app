import i18next from "i18next"

import { formatDateForWire } from "../src/shared/utils/dateWireFormat"
import en from "../src/shared/i18n/locales/en"
import fr from "../src/shared/i18n/locales/fr"
import { I18N_BASE_OPTIONS } from "../src/shared/i18n/config"

/**
 * DatePickerField emits formatDateForWire's output, and callers store it as a
 * form value POSTed verbatim (`date_preference` in CreateShipmentScreen). It
 * must stay English regardless of the UI language, or the backend starts
 * receiving French dates.
 *
 * If you are here because you localised the date display: emit the ISO string
 * and format at render time instead of translating the month names.
 */
describe("date wire format", () => {
  it("formats dates with English month names", () => {
    expect(formatDateForWire("2026-06-25")).toBe("25 June 2026")
    expect(formatDateForWire("2026-01-01")).toBe("1 January 2026")
    expect(formatDateForWire("2026-12-31")).toBe("31 December 2026")
  })

  it("does not follow the active language", async () => {
    const i18n = i18next.createInstance()
    await i18n.init({
      ...I18N_BASE_OPTIONS,
      resources: { en: { translation: en }, fr: { translation: fr } },
      lng: "fr",
    })

    // Sanity-check that French really is active, so the assertion below means
    // something rather than passing on a no-op.
    expect(i18n.t("common.months.june")).toBe("juin")
    expect(formatDateForWire("2026-06-25")).toBe("25 June 2026")
  })
})
