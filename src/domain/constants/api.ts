export const SIGNUP = '/auth/sign-up'
export const SIGNIN = '/auth/sign-in'
export const FORGOT_PASSWORD = "/auth/forget-password"
export const VERIFY_OTP = '/auth/verify-otp'
export const RESET_PASSWORD = '/auth/reset-password'

export const COMPLETE_TRANSPORTER_PROFILE = '/transporter/complete-transporter-profile'
export const COMPLETE_SHIPPER_PROFILE = '/shipper/complete-shipper-profile'

export const GET_SHIIPER_PROFILE = (id: string) => `/shipper/${id}`
export const GET_TRANSPORTER_PROFILE = (id: string) => `/transporter/${id}`