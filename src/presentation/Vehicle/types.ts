// src/presentation/vehicle/types.ts
export interface VehicleFormValues {
    name: string;
    plateNumber: string;
    type: string;
    capacity: string;
    modelYear: string;

    // File uploads
    registration?: string[];   // Array of file URIs
    insurance?: string[];
    plateId?: string[];
    vehicleImages?: string[];
}