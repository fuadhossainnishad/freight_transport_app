import { logger } from '../../shared/utils/logger';
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

        logger.info("Sending login request:", email)

        const response = await publicAxios.post(
            SIGNIN,
            { email, password }
        )

        logger.info("Raw API Response:", response.data)

        if (!response.data.success) {
            throw new Error(response.data.message || "Login failed")
        }

        logger.info("LoginResponse:", response.data.data)

        return response.data.data

    } catch (error: any) {


        logger.info("LOGIN API ERROR:", error.response?.data || error.message)

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

        const response = await publicAxios.post(
            FORGOT_PASSWORD,
            { email }
        )

        if (!response.data.success) {
            throw new Error(response.data.message)
        }
        logger.info("forgotPassword:", response.data.data)
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
        logger.info("VERIFY_OTP payload:", payload)

        const response = await publicAxios.post(
            VERIFY_OTP,
            payload
        )

        if (!response.data.success) {
            throw new Error(response.data.message || "OTP verification failed")
        }
        logger.info("VERIFY_OTP:", response.data.data)
        return response.data.data

    } catch (error: any) {

        logger.info(
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
    logger.info("RESET_PASSWORD:", response)
    if (!response.data.success) {
        throw new Error(response.data.message || "Password reset failed")
    }

    return true
}