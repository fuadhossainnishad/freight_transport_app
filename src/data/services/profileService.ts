import axiosClient from "../../shared/config/axios.config"

export const getTransporterProfile = async (id: string) => {
    const res = await axiosClient.get(`/transporter/${id}`)
    return res.data.data
}

export const getShipperProfile = async (id: string) => {
    const res = await axiosClient.get(`/shipper/${id}`)
    return res.data.data
}