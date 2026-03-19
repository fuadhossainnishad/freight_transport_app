import { useState } from "react"
import { resetPassword } from "../../../data/services/authService"

export const useResetPassword = () => {

  const [loading, setLoading] = useState(false)

  const submitResetPassword = async (
    verification_token: string,
    new_password: string,
    confirm_password: string
  ) => {

    try {

      setLoading(true)

      const res = await resetPassword({
        verification_token,
        new_password,
        confirm_password
      })

      return res

    } finally {
      setLoading(false)
    }
  }

  return {
    submitResetPassword,
    loading
  }
}