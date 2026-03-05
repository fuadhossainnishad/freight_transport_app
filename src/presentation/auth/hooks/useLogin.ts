import { useState } from "react"
import { signIn } from "../../../data/services/authService"
import { saveAuth } from "../../../shared/storage/authStorage"
import { decodeAccessToken } from "../../../shared/utils/jwt"

export const useLogin = () => {
    const [loading, setLoading] = useState(false)

    const login = async (email: string, password: string) => {
        try {
            setLoading(true)
            console.log(email, password)
            const data = await signIn(email, password)

            const decoded = decodeAccessToken(data.accessToken)

            const userId = decoded._id

            await saveAuth(data.accessToken, data.refreshToken)

            return {
                ...data,
                userId,
            }

        } finally {
            setLoading(false)
        }
    }

    return { login, loading }
}