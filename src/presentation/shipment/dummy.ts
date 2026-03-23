// data/dummy/dummyShipments.ts

import { Vehicle } from "../../domain/entities/vehicle";

export const DUMMY_SHIPMENTS = {
  "success": true,
  "message": "Shipments fetched successfully.",
  "data": {
    "shipments": [
      {
        "location_history": {
          "coordinates": []
        },
        "_id": "69b8a2cd51dfd9e32ea1214a",
        "shipper_id": "69989f9f65301c339400e386",
        "shipment_title": "Test shipment",
        "category": "Test cagetory",
        "discription": "This is test descriptioin.",
        "weight": "1000 KG",
        "type_of_packaging": "cloths",
        "dimensions": "100KM",
        "shipment_images": [
          "https://drive.google.com/file/d/1LIdJngNlZ0vOyDb0TB_5C3yzl3NwMBOD/view?usp=sharing",
          "https://drive.google.com/file/d/1LIdJngNlZ0vOyDb0TB_5C3yzl3NwMBOD/view?usp=sharing",
          "https://drive.google.com/file/d/1LIdJngNlZ0vOyDb0TB_5C3yzl3NwMBOD/view?usp=sharing"
        ],
        "pickup_address": "Dhaka, Bangladesh",
        "time_window": "2 days",
        "delivery_address": "Chittagong, Bangladesh",
        "delivery_proof": [],
        "contact_person": "029327837383",
        "date_preference": "183-37",
        "price": 1900090893,
        "status": "IN_PROGRESS",
        "createdAt": "2026-02-20T18:04:51.129Z",
        "updatedAt": "2026-03-13T19:08:58.003Z",
        "driver_id": "69b460021dbfa8761122170d",
        "transporter_id": "6998a30c1e9b031cd1d8db3c",
        "vehicle_id": "6998ce0fe83b20ce4b3814af"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPage": 1
    }
  }
}



export const mockVehicles: Vehicle[] = [
  {
    id: "mock-1",
    name: "Benz Actros – 20T",
    plateNumber: "AB-345-CD",
    type: "Closed Truck",
    capacity: "20 Tons",
    modelYear: "2018",

    images: [
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7"
    ],

    documents: [
      {
        id: "doc-1",
        type: "plateId",
        url: "https://dummyimage.com/600x400/000/fff&text=Plate+ID",
      },
      {
        id: "doc-2",
        type: "insurance",
        url: "https://dummyimage.com/600x400/000/fff&text=Insurance",
      },
      {
        id: "doc-3",
        type: "technicalVisit",
        url: "https://dummyimage.com/600x400/000/fff&text=Technical+Visit",
      },
    ],

    createdAt: new Date().toISOString(),
  },

  {
    id: "mock-2",
    name: "Volvo FH – 40T",
    plateNumber: "XY-987-ZT",
    type: "Trailer",
    capacity: "40 Tons",
    modelYear: "2022",

    images: [
      "https://images.unsplash.com/photo-1591768793355-74d04bb6608f"
    ],

    documents: [
      {
        id: "doc-4",
        type: "plateId",
        url: "https://dummyimage.com/600x400/000/fff&text=Plate+ID",
      },
      {
        id: "doc-5",
        type: "insurance",
        url: "https://dummyimage.com/600x400/000/fff&text=Insurance",
      },
      {
        id: "doc-6",
        type: "technicalVisit",
        url: "https://dummyimage.com/600x400/000/fff&text=Technical+Visit",
      },
    ],

    createdAt: new Date().toISOString(),
  },
];