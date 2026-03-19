import { CREATE_SHIPMENTS } from "../../domain/constants/api"
import axiosClient from "../../shared/config/axios.config"


export const createShipment = async (formData: FormData) => {
    const res = await axiosClient.post(
        CREATE_SHIPMENTS,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    )
    console.log("createShipment:", res.data)
    return res.data
}

export const getShipperShipments = async (
    shipperId: string,
    searchTerm?: string,
    page: number = 1,
    limit: number = 10
) => {
    const params: any = {
        page,
        limit,
    };

    if (searchTerm) params.searchTerm = searchTerm;

    const res = await axiosClient.get(`/shipment/${shipperId}`, { params });

    return res.data;
};

export const fetchShipmentDetails = async (id: string) => {
    const res = await axiosClient.get(`/shipment/${id}`);
    console.log("fetchShipmentDetails:", res.data)
    return res.data;
};

export const fetchTransporterShipments = async (transporterId: string, page = 1, limit = 10) => {
    try {
        const res = await axiosClient.get(`/shipment/transporter/${transporterId}`);
        console.log("fetchTransporterShipments:", res.data);
        return res.data;
    } catch (err) {
        console.error("Error fetching shipments:", err);
        throw err;
    }
};

export const getShipmentBids = async (shipmentId: string) => {
    const res = await axiosClient.get(`/bid/${shipmentId}`);
    console.log("getShipmentBids:", res.data.data);
    return res.data?.data || [];
};