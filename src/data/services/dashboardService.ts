import { GET_SHIPPER_STATS, GET_TRANSPORTER_STATS } from "../../domain/constants/api"
import axiosClient from "../../shared/config/axios.config"

export const getShipperStats = async (shipperId: string) => {
    console.log("shipperId:", shipperId)
    const res = await axiosClient.get(
        GET_SHIPPER_STATS(shipperId)
    )
    console.log("getShipperStats:", res.data)
    return res.data
}
export const getTransporterStats = async (transporterId: string) => {
    console.log("shipperId:", transporterId)
    const res = await axiosClient.get(
        GET_TRANSPORTER_STATS(transporterId)
    )
    console.log("getTransporterStats:", res.data)
    return res.data
} 