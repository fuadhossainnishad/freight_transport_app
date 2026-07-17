import en from "../src/shared/i18n/locales/en"
import fr from "../src/shared/i18n/locales/fr"

type Json = { [key: string]: string | Json }

const flatten = (obj: Json, prefix = ""): string[] =>
  Object.entries(obj).flatMap(([key, value]) =>
    typeof value === "object" && value !== null
      ? flatten(value, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  )

const enKeys = flatten(en as Json)
const frKeys = flatten(fr as Json)

describe("i18n locales", () => {
  it("has no French keys missing", () => {
    expect(enKeys.filter((key) => !frKeys.includes(key))).toEqual([])
  })

  it("has no French keys that English does not define", () => {
    expect(frKeys.filter((key) => !enKeys.includes(key))).toEqual([])
  })

  it("keeps interpolation placeholders identical across locales", () => {
    const placeholders = (value: string) =>
      (value.match(/{{\s*\w+\s*}}/g) ?? []).sort()

    const read = (obj: Json, key: string) =>
      key.split(".").reduce<any>((acc, part) => acc[part], obj) as string

    const mismatched = enKeys.filter(
      (key) =>
        placeholders(read(en as Json, key)).join() !==
        placeholders(read(fr as Json, key)).join(),
    )

    expect(mismatched).toEqual([])
  })
})
