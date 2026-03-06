import { GET_SHIPPER_STATS } from "../../domain/constants/api"
import axiosClient from "../../shared/config/axios.config"

export const getShipperStats = async (shipperId: string) => {
    console.log("shipperId:", shipperId)
    const res = await axiosClient.get(
        GET_SHIPPER_STATS(shipperId)
    )
    console.log("getShipperStats:", res.data)
    return res.data
} 