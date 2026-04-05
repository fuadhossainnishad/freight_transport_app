import { normalizeImageUrl } from "../../shared/utils/normalizeImageUrl";

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
    timeWindow: shipment.time_window,
    datePreference: shipment.date_preference,
    contactPerson: shipment.contact_person,
    price: shipment.price,
    status: shipment.status,

    locationHistory: shipment.location_history || {
      coordinates: [],
    },

    driver: driver
      ? {
        name: driver.driver_name,
        phone: driver.number,
        email: driver.email,
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
    timeWindow: shipment.time_window,
    datePreference: shipment.date_preference,
    price: shipment.price,
    driverId: shipment.driver_id,
    vehicleId: shipment.vehicle_id,
    status: shipment.status,
    contactPerson: shipment.contact_person!,
  }));
};