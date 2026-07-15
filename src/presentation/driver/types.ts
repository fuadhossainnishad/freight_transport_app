export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  country?: string;
  avatar?: string;
  licenseFront?: string;
  licenseBack?: string;
}

export interface DriverApi {
  _id: string;
  transporter_id: string;
  driver_name: string;
  number: string;
  email: string;
  profile_picture: string[];
  driver_license: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Coord {
  latitude: number;
  longitude: number;
}

export interface Shipment {
  id: string;
  title: string;
  pickupAddress: string;
  deliveryAddress: string;
  pickupCoord?: Coord;
  deliveryCoord?: Coord;
  status: "IN_PROGRESS" | "COMPLETED" | "PENDING" | "IN_TRANSIT";
  driverId?: string;
  transporterId?: string;
  imageUrl?: string;
  // null until a price is agreed (no accepted bid yet) — render via
  // formatPriceRange(), which shows "—" rather than "$0".
  priceMin: number | null;
  priceMax: number | null;
  origin?: string;
  destination?: string;
  commodity?: string;
  description?: string;
  weight?: string;
  dimensions?: string;
  packaging?: string;
  timeWindow?: string;
  contactPerson?: string;
  pallets?: number;
}

export interface DriverEntity {
  transporter_id: string
  name: string;
  phone: string;
  email: string;
  country: string;
  profilePicture: string[];
  driverLicense: string[];
}