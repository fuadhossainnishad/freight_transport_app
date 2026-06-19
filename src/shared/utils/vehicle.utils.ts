//vehicle.utils.ts

import { Vehicle } from "../../domain/entities/vehicle";
import { normalizeImageUrl } from "./normalizeImageUrl";


export const mapVehicleFromApi = (item: any): Vehicle => {
  return {
    id: item._id,

    name: item.vehicle_number, // or custom naming later
    plateNumber: item.plate_number,
    type: item.vehicle_type,
    capacity: item.capicity, // ⚠️ backend typo handled here
    modelYear: item.year_model,

    // Real uploaded images from the backend, normalized to the production host.
    images: (item.vehicle_images || [])
      .map(normalizeImageUrl)
      .filter(Boolean),

    documents: [
      ...(item.plate_id || []).map((url: string, i: number) => ({
        id: `plate-${i}`,
        type: "plateId",
        url: normalizeImageUrl(url),
      })),

      ...(item.insurance || []).map((url: string, i: number) => ({
        id: `insurance-${i}`,
        type: "insurance",
        url: normalizeImageUrl(url),
      })),

      ...(item.technical_visit || []).map((url: string, i: number) => ({
        id: `technical-${i}`,
        type: "technicalVisit",
        url: normalizeImageUrl(url),
      })),
    ],

    createdAt: item.createdAt,
  };
};