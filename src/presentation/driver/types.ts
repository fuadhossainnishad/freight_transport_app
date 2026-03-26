export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
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

export interface Shipment {
  id: string; // instead of _id (keep UI clean)
  title: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: "IN_PROGRESS" | "COMPLETED" | "PENDING";
  driverId?: string;
  transporterId?: string;
}
