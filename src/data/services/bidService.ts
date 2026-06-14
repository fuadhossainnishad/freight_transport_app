import { GET_BIDS } from "../../domain/constants/api";
import { axiosClient } from "../../shared/config/axios.config";

export const getAvailableBids = async (searchTerm?: string, page?: number, limit?: number) => {
    const params: any = {};
    if (searchTerm) params.searchTerm = searchTerm;
    if (page !== undefined) params.page = page;
    if (limit !== undefined) params.limit = limit;

    const res = await axiosClient.get(GET_BIDS, { params });
    return res.data;
};

type CreateBidPayload = {
    transporter_id: string;
    shipment_id: string;
    driver_id: string;
    vehicle_id: string;
    bid_amount: number;
};

export const getBidById = async (bidId: string) => {
    const res = await axiosClient.get(`/bid/${bidId}`);
    return res.data;
};

export const createBid = async (payload: CreateBidPayload) => {
    try {
        const res = await axiosClient.post("/bid/", payload);
        console.log("createBid:", res.data);

        return res.data;
    } catch (error: any) {
        console.log("createBid error:", error?.response?.data || error);
        throw error;
    }
};