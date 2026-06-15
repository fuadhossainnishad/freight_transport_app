import { normalizeImageUrl } from "../../shared/utils/normalizeImageUrl";

export type LatLng = { latitude: number; longitude: number };

// Backend stores pickup/delivery as GeoJSON Points: { coordinates: [lng, lat] }.
// react-native-maps wants { latitude, longitude }, so swap the order here.
// Returns undefined when missing/malformed so the map falls back to geocoding
// the address instead of dropping a bad pin. (matches the driver-side mapper)
export const fromGeoJsonPoint = (point: any): LatLng | undefined => {
  const coords = point?.coordinates;
  if (!Array.isArray(coords) || coords.length < 2) return undefined;
  const [lng, lat] = coords;
  if (typeof lat !== "number" || typeof lng !== "number") return undefined;
  if (lat === 0 && lng === 0) return undefined; // null-island placeholder
  return { latitude: lat, longitude: lng };
};

export const mapShipmentDetails = (res: any) => {
  const { shipment, vehicle, driver } = res;

  return {
    id: shipment._id,
    title: shipment.shipment_title!,
    description: shipment.discription,
    category: shipment.category,
    weight: shipment.weight,
    dimensions: shipment.dimensions,
    packaging: shipment.type_of_packaging,
    images: (shipment.shipment_images || []).map((img: string) =>
      normalizeImageUrl(img)
    ),
    pickup: shipment.pickup_address,
    delivery: shipment.delivery_address,
    // Backend coords (GeoJSON) — preferred over geocoding the address strings.
    pickupCoord: fromGeoJsonPoint(shipment.pickup_location),
    deliveryCoord: fromGeoJsonPoint(shipment.delivery_location),
    timeWindow: shipment.time_window,
    datePreference: shipment.date_preference,
    contactPerson: shipment.contact_person,
    price: shipment.price,
    status: shipment.status,

    driverId: driver?._id || shipment.driver_id || null,

    locationHistory: shipment.location_history || {
      coordinates: [],
    },

    driver: driver
      ? {
        name: driver.driver_name,
        phone: driver.user_id?.phone ?? driver.number ?? null,
        email: driver.user_id?.email ?? driver.email ?? null,
        country: driver.user_id?.country ?? null,
        avatar: driver.profile_picture?.[0],
      }
      : null,

    vehicle: vehicle
      ? {
        type: vehicle.vehicle_type,
        number: vehicle.vehicle_number,
        plate: vehicle.plate_number,
        images: (vehicle.vehicle_images || []).map((img: string) => normalizeImageUrl(img)),
      }
      : null,
  };
};

// domain/entities/shipment.entity.ts
export interface Shipment {
  id: string;
  title: string;
  description: string;
  category: string;
  weight: string;
  dimensions: string;
  packaging: string;
  images: string[];
  pickup: string;
  delivery: string;
  timeWindow: string;
  datePreference: string;
  price: number;
  driverId?: string;
  vehicleId?: string;
  status: string
  contactPerson?: string;
  pickupCoord?: LatLng;
  deliveryCoord?: LatLng;
}

export const mapShipments = (res: any): Shipment[] => {
  return res.data.shipments.map((shipment: any) => ({
    id: shipment._id,
    title: shipment.shipment_title,
    description: shipment.discription,
    category: shipment.category,
    weight: shipment.weight,
    dimensions: shipment.dimensions,
    packaging: shipment.type_of_packaging,
    images: (shipment.shipment_images || []).map((img: string) =>
      normalizeImageUrl(img)
    ),
    pickup: shipment.pickup_address,
    delivery: shipment.delivery_address,
    pickupCoord: fromGeoJsonPoint(shipment.pickup_location),
    deliveryCoord: fromGeoJsonPoint(shipment.delivery_location),
    timeWindow: shipment.time_window,
    datePreference: shipment.date_preference,
    price: shipment.price,
    driverId: shipment.driver_id,
    vehicleId: shipment.vehicle_id,
    status: shipment.status,
    contactPerson: shipment.contact_person!,
  }));
};