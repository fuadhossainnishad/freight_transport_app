import axiosClient from "../../shared/config/axios.config"

export const completeTransporterProfile = async (formData: FormData) => {

  const res = await axiosClient.post(
    "/transporter/complete-transporter-profile",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  )

  return res.data
}