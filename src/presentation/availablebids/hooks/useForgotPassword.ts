import { useState } from "react"
import { sendForgotPasswordEmail } from "../../../domain/usecases/sendForgotPasswordEmail"

export const useForgotPassword = () => {

  const [loading, setLoading] = useState(false)

  const requestOtp = async (email: string) => {

    try {

      setLoading(true)

      const data = await sendForgotPasswordEmail(email)

      return data

    } finally {
      setLoading(false)
    }

  }

  return {
    requestOtp,
    loading
  }
}