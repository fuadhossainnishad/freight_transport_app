import { About } from "../../domain/entities/info.entity";
import { FAQ } from "../../domain/entities/faq";
import axiosClient from "../../shared/config/axios.config";
import { GET_INFO } from "../../domain/constants/api";

export const getFaqs = async (): Promise<FAQ[]> => {
    const { data } = await axiosClient.get("/faqs");
    console.log("getFaqs:", data.data)

    return data.data;
};

export const getInfo = async (infoType: string): Promise<About | null> => {
    try {
        const response = await axiosClient.get(GET_INFO(infoType));

        if (response.data.success) {
            return response.data.data;
        }

        return null;
    } catch (error) {
        console.error(`Failed to fetch ${infoType} data`, error);
        return null;
    }
};

export const reportShipmentIssue = async (
    shipmentId: string,
    message: string
) => {
    const { data } = await axiosClient.post(`/issues/shipment/${shipmentId}`, {
        message,
    });

    return data;
};