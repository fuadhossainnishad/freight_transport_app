import { useState } from "react"
import { verifyOtp } from "../../../data/services/authService"

export const useVerifyOtp = () => {

    const [loading, setLoading] = useState(false)

    const verify = async (email: string, otp: string) => {

        try {

            setLoading(true)

            const result = await verifyOtp({ email, otp })

            return result

        } finally {

            setLoading(false)

        }

    }

    return { verify, loading }

}