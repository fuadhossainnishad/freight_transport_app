import { GET_BIDS } from "../../domain/constants/api";
import { axiosClient } from "../../shared/config/axios.config";

export const getAvailableBids = async (searchTerm?: string) => {
    const params: any = {};

    if (searchTerm) params.searchTerm = searchTerm;

    const res = await axiosClient.get(GET_BIDS, { params });
    console.log("getAvailableBids:", res.data)

    return res.data;
};

type CreateBidPayload = {
    transporter_id: string;
    shipment_id: string;
    driver_id: string;
    vehicle_id: string;
    bid_amount: string;
};

export const createBid = async (payload: CreateBidPayload) => {
    try {
        const res = await axiosClient.post("/bid/api", payload);
        console.log("createBid:", res.data);

        return res.data;
    } catch (error: any) {
        console.log("createBid error:", error?.response?.data || error);
        throw error;
    }
};