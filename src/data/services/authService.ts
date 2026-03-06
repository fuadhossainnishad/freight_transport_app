import axiosClient from "../../shared/config/axios.config"
import { FORGOT_PASSWORD, RESET_PASSWORD, SIGNIN, VERIFY_OTP } from "../../domain/constants/api"
import publicAxios from "../../shared/config/publicAxios.config"

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


export interface ForgotPasswordResponse {
    otp: number
    verification_token: string
}

export const forgotPassword = async (
    email: string
): Promise<ForgotPasswordResponse> => {
    try {

        const response = await axiosClient.post(
            FORGOT_PASSWORD,
            { email }
        )

        if (!response.data.success) {
            throw new Error(response.data.message)
        }
        console.log("forgotPassword:", response.data.data)
        return response.data.data

    } catch (error: any) {

        const message =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to send reset email"

        throw new Error(message)
    }
}

export interface VerifyOtpPayload {
    email: string
    otp: string
}

export const verifyOtp = async (
    payload: VerifyOtpPayload
): Promise<boolean> => {

    try {
        console.log("VERIFY_OTP payload:", payload)

        const response = await publicAxios.post(
            VERIFY_OTP,
            payload
        )

        if (!response.data.success) {
            throw new Error(response.data.message || "OTP verification failed")
        }
        console.log("VERIFY_OTP:", response.data.data)
        return response.data.data

    } catch (error: any) {

        console.log(
            "VERIFY OTP ERROR:",
            error?.response?.data || error.message
        )

        throw error
    }

}

export interface ResetPasswordPayload {
    verification_token: string
    new_password: string
    confirm_password: string
}

export const resetPassword = async (
    payload: ResetPasswordPayload
): Promise<boolean> => {

    const response = await publicAxios.post(
        RESET_PASSWORD,
        payload
    )
    console.log("RESET_PASSWORD:", response)
    if (!response.data.success) {
        throw new Error(response.data.message || "Password reset failed")
    }

    return true
}