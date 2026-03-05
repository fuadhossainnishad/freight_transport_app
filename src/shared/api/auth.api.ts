import { LOGIN } from "../../domain/constants/api";
import axiosClient from "../config/axios.config";

export const signupApi = async (formData: FormData) => {
  const response = await axiosClient.post(LOGIN, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};