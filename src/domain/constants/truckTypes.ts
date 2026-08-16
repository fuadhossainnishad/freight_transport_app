import type { ParseKeys } from "i18next"

export type TruckType = {
  /** Resolved with t() at the render site; typed so a bad key fails the build. */
  labelKey: ParseKeys
  /** API enum sent to and stored by the backend — never translate. */
  value: string
}

export const TRUCK_TYPES: TruckType[] = [
  { labelKey: "truckTypes.tractorhead", value: "TRACTORHEAD" },
  { labelKey: "truckTypes.truck", value: "TRUCK" },
  { labelKey: "truckTypes.lightCommercialVehicle", value: "LIGHT_COMMERCIAL_VEHICLE" },
  { labelKey: "truckTypes.constructionEquipment", value: "CONSTRUCTION_EQUIPMENT" },
  { labelKey: "truckTypes.semiTrailer", value: "SEMI_TRAILER" },
  { labelKey: "truckTypes.trailer", value: "TRAILER" },
];
