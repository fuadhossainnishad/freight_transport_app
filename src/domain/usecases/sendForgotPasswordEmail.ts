import { forgotPassword } from "../../data/services/authService"

export const sendForgotPasswordEmail = async (email: string) => {
  return await forgotPassword(email)
}