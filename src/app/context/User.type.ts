// export interface UserType {
//     id?: string
//     role: 'SHIPPER' | 'TRANSPORTER';
//     profile?: any

import React from "react";


// }

export interface UserContextType {
    user: UserType | null;
    setUser: React.Dispatch<React.SetStateAction<UserType | null>>
    // setUser: (user: UserType | null) => void;
}

export interface TransporterProfile {
    _id: string
    user_id: string
    company_name: string
    logo?: string
    number_of_trucks: number
    truck_type: string
    company_address?: string
    insurance_certificate?: string
    registration_certificate?: string
    transport_license?: string
    status?: "pending" | "approved" | "rejected"
}

export interface ShipperProfile {
    _id: string
    user_id: string
    company_address: string
    employee_size: string
    monthly_budget_for_shipment: string
    ship_type: string
    shipments_per_month: string
    shipping_marchandise_at: string
    type_of_shipment: string
}

export interface UserType {
    id: string
    role: "SHIPPER" | "TRANSPORTER"
    shipperProfile?: ShipperProfile
    transporterProfile?: TransporterProfile
}