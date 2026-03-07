import { CREATE_SHIPMENTS } from "../../domain/constants/api"
import axiosClient from "../../shared/config/axios.config"


export const createShipment = async (formData: FormData) => {
    const res = await axiosClient.post(
        CREATE_SHIPMENTS,
        formData,
    )

    return res.data
}