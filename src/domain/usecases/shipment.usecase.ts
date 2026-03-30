import { fetchShipmentDetails, fetchShipments, fetchTransporterShipments } from "../../data/services/shipmentService";
import { mapShipmentDetails, mapShipments } from "../entities/shipment.entity";

export const getShipmentDetailsUseCase = async (id: string) => {
  const res = await fetchShipmentDetails(id);

  if (!res?.success) {
    throw new Error("Failed to fetch shipment details");
  }
  console.log("getShipmentDetailsUseCase:", mapShipmentDetails(res.data!))

  const mapped = mapShipmentDetails(res.data!);

  return mapped;
};

export const getTransporterShipmentsUseCase = async (transporterId: string, page = 1, limit = 10) => {
  const res = await fetchTransporterShipments(transporterId, page, limit);

  if (!res?.success) {
    throw new Error("Failed to fetch shipments");
  }
  console.log("getTransporterShipmentsUseCase:", res.data)
  return {
    shipments: mapShipments(res),
    pagination: res.data.pagination,
  };
};

export const getShipmentsUseCase = async (role: string, id: string, page = 1, limit = 10) => {
  const res = await fetchShipments(role, id, page, limit);

  if (!res?.success) {
    throw new Error("Failed to fetch shipments");
  }
  console.log("getShipmentsUseCase:", res.data)
  return {
    shipments: mapShipments(res),
    pagination: res.data.pagination,
  };
};