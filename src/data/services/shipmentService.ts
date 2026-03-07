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