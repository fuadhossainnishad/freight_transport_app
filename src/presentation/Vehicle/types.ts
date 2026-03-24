// src/presentation/vehicle/types.ts
export interface VehicleFormValues {
    transporter_id: string
    vehicle_number: string;
    plate_number: string;
    vehicle_type: string;
    capicity: string;
    year_model: string;

    // File uploads
    technical_visit?: string[]  // Array of file URIs
    insurance?: string[]
    plate_id?: string[];
    vehicle_images?: string[];
}