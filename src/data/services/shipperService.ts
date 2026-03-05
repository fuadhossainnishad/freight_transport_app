import axiosClient from "../../shared/config/axios.config"

export const completeShipperProfile = async (body: any) => {

  const res = await axiosClient.post(
    "/shipper/complete-shipper-profile",
    body
  )

  return res.data
}