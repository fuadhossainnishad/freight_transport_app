import { GET_SHIIPER_PROFILE, GET_TRANSPORTER_PROFILE } from './../../domain/constants/api';
import axiosClient from "../../shared/config/axios.config"

export const ProfileService = {

    async getTransporterProfile(id: string) {
        try {
            const res = await axiosClient.get(GET_TRANSPORTER_PROFILE(id))
            console.log("GET_TRANSPORTER_PROFILE:", res.data.data)
            return res.data?.data
        } catch (error) {
            console.error("Transporter profile fetch error:", error)
            throw error
        }
    },

    async getShipperProfile(id: string) {
        try {
            const res = await axiosClient.get(GET_SHIIPER_PROFILE(id))
            console.log("GET_SHIIPER_PROFILE:", res.data.data)
            return res.data?.data
        } catch (error) {
            console.error("Shipper profile fetch error:", error)
            throw error
        }
    },

}