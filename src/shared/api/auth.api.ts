import { SIGNUP } from "../../domain/constants/api";
import axiosClient from "../config/axios.config";

export const signupApi = async (
  payload: FormData | Record<string, any>
) => {
  try {
    const response = await axiosClient.post(SIGNUP, payload, {
      headers:
        payload instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" },
    });

    console.log("✅ Signup Response:", response.data);

    return response.data;
  } catch (error: any) {
    console.log("❌ Signup API Error:", error.response?.data || error.message);
    throw error;
  }
};