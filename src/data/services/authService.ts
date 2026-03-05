import axiosClient from "../../shared/config/axios.config"
import { SIGNIN } from "../../domain/constants/api"

export interface LoginResponse {
    accessToken: string
    refreshToken: string
    role: string
}

export const signIn = async (
    email: string,
    password: string
): Promise<LoginResponse> => {
    const response = await axiosClient.post(
        SIGNIN,
        { email, password }
    )

    return response.data.data
}