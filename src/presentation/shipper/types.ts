export interface CreateShipmentForm {
    shipment_title: string
    category: string
    discription: string
    weight: string
    type_of_packaging: string
    dimensions: string
    pickup_address: string
    time_window: string
    delivery_address: string
    contact_person: string
    date_preference: string
    price: string
}

export type ShipmentStatus = "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "DELIVERED"

export interface Shipment {
    _id: string
    shipper_id: string
    shipment_title: string
    category: string
    discription: string
    weight: string
    type_of_packaging: string
    dimensions: string
    shipment_images: string[]

    pickup_address: string
    time_window: string
    delivery_address: string

    delivery_proof: string[]

    contact_person: string
    date_preference: string
    price: number

    status: ShipmentStatus

    createdAt: string
    updatedAt: string
}

export interface CreateShipmentResponse {
    success: boolean
    message: string
    data: Shipment
}

export interface AddressLocation {
    address: string
    latitude: number
    longitude: number
}


export type ShipmentFormValues = {
    shipment_title: string
    category: string | null
    discription: string
    weight: string
    type_of_packaging: string | null
    dimensions: string

    pickup_address: AddressLocation | null
    delivery_address: AddressLocation | null

    time_window: string
    contact_person: string
    date_preference: string

    insurance: boolean
    forwarding: boolean
}