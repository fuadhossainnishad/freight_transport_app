import axiosClient from "../../shared/config/axios.config"
import { SIGNIN } from "../../domain/constants/api"
import { Alert } from "react-native"

export interface LoginResponse {
    accessToken: string
    refreshToken: string
    role: string
}

export const signIn = async (
    email: string,
    password: string
): Promise<LoginResponse> => {

    try {

        console.log("Sending login request:", email)

        const response = await axiosClient.post(
            SIGNIN,
            { email, password }
        )

        console.log("Raw API Response:", response.data)

        if (!response.data.success) {
            throw new Error(response.data.message || "Login failed")
        }

        console.log("LoginResponse:", response.data.data)

        return response.data.data

    } catch (error: any) {


        console.log("LOGIN API ERROR:", error.response?.data || error.message)

        throw error
    }
}