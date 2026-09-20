import { GET_SHIPPER_STATS, GET_TRANSPORTER_STATS } from "../../domain/constants/api"
import axiosClient from "../../shared/config/axios.config"

export const getShipperStats = async (shipperId: string, month?: number, year?: number) => {
    console.log("shipperId:", shipperId, "month:", month, "year:", year)
    const params: any = {};
    if (month) params.month = month;
    if (year) params.year = year;

    const res = await axiosClient.get(
        GET_SHIPPER_STATS(shipperId),
        { params }
    )
    console.log("getShipperStats:", res.data)
    return res.data
}
export const getTransporterStats = async (transporterId: string, month?: number, year?: number) => {
    console.log("transporterId:", transporterId, "month:", month, "year:", year)
    const params: any = {};
    if (month) params.month = month;
    if (year) params.year = year;
    
    const res = await axiosClient.get(
        GET_TRANSPORTER_STATS(transporterId),
        { params }
    )
    console.log("getTransporterStats:", res.data)
    return res.data
} 