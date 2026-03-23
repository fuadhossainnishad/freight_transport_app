export interface VehicleDocument {
  id: string;
  type: "plateId" | "insurance" | "technicalVisit" | "registration";
  url: string;
}

export interface Vehicle {
  id: string;
  name: string;
  plateNumber: string;
  type: string;
  capacity: string;
  modelYear: string;

  images: string[];
  documents: VehicleDocument[];

  createdAt: string;
}