import type { ParseKeys } from "i18next"

/**
 * Shipment category / packaging options.
 *
 * CRITICAL: `value` is what gets POSTed to the backend and stored. It used to be
 * the same string that was shown on screen (a plain `string[]`), which meant
 * translating the list would have silently started sending French categories to
 * the API and corrupted existing data — `CreateShipmentScreen` appends every
 * form field onto FormData verbatim.
 *
 * So: `value` stays English forever, `labelKey` is what the user sees.
 * Never "simplify" this back into a flat string array.
 */
export type ShipmentOption = {
  /** API value — never translate, never change (existing rows depend on it). */
  value: string
  /** Resolved with t() at render time. */
  labelKey: ParseKeys
}

export const CATEGORY_OPTIONS: ShipmentOption[] = [
  { value: "Furniture", labelKey: "shipment.categories.furniture" },
  { value: "Electronics", labelKey: "shipment.categories.electronics" },
  { value: "Food", labelKey: "shipment.categories.food" },
  { value: "Clothing", labelKey: "shipment.categories.clothing" },
  { value: "Construction Materials", labelKey: "shipment.categories.constructionMaterials" },
]

export const PACKAGING_OPTIONS: ShipmentOption[] = [
  { value: "Wooden Crates", labelKey: "shipment.packaging.woodenCrates" },
  { value: "Pallets", labelKey: "shipment.packaging.pallets" },
  { value: "Boxes", labelKey: "shipment.packaging.boxes" },
  { value: "Drums", labelKey: "shipment.packaging.drums" },
  { value: "Loose Cargo", labelKey: "shipment.packaging.looseCargo" },
]

/**
 * Read path: the backend hands back the stored English `value`, so screens that
 * display it need the matching key. Returns undefined for values not in the
 * list (legacy or admin-entered data) — callers should fall back to the raw
 * string rather than render nothing.
 */
export const optionLabelKey = (
  options: ShipmentOption[],
  value?: string | null,
): ParseKeys | undefined => options.find((o) => o.value === value)?.labelKey
