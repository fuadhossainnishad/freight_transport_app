import { DELETE_VEHICLE, GET_VEHICLE, GET_VEHICLES, POST_VEHICLE, UPDATE_VEHICLE } from "../../domain/constants/api";
import { Vehicle } from "../../domain/entities/vehicle";
import { mockVehicles } from "../../presentation/shipment/dummy";
import axiosClient from "../../shared/config/axios.config";
import { mapVehicleFromApi } from "../../shared/utils/vehicle.utils";

export const searchVehicles = async (
    transporterId: string,
    searchTerm?: string
) => {
    const res = await axiosClient.get(`/vehicle/transporter/${transporterId}`, {
        params: { searchTerm }
    });
    console.log("Vehicle search data:", res.data);

    return res.data?.data?.vehicles || [];
};


const ENABLE_MOCK = true
export const getVehicles = async (transporterId: string): Promise<Vehicle[]> => {
    const res = await axiosClient.get(GET_VEHICLES(transporterId));
    console.log("getVehicles:", res.data)
    const vehicles = res.data?.data?.vehicles || [];

    if (ENABLE_MOCK && vehicles.length === 0) {
        console.log("⚠️ Using mock vehicles");
        return mockVehicles;
    }

    return vehicles.map(mapVehicleFromApi);
};

export const getVehicleById = async (vehicleId: string): Promise<Vehicle> => {
    const res = await axiosClient.get(GET_VEHICLE(vehicleId));
    return res.data.data;
};

export const addVehicle = async (formData: FormData) => {
    const res = await axiosClient.post(POST_VEHICLE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

export const updateVehicle = async (vehicleId: string, formData: FormData) => {
    const res = await axiosClient.put(UPDATE_VEHICLE(vehicleId), formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

export const deleteVehicle = async (vehicleId: string) => {
    const res = await axiosClient.delete(DELETE_VEHICLE(vehicleId));
    return res.data;
};