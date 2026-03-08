import { About } from "../../domain/entities/about.entity";
import { FAQ } from "../../domain/entities/faq";
import axiosClient from "../../shared/config/axios.config";

export const getFaqs = async (): Promise<FAQ[]> => {
    const { data } = await axiosClient.get("/faqs");
    console.log("getFaqs:", data.data)

    return data.data;
};

export const getAbout = async (): Promise<About> => {
    const { data } = await axiosClient.get("/setting/about");
    return data.data;
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