import { useState } from "react"
import { saveAuth } from "../../../shared/storage/authStorage"
import { signIn } from "../../../data/services/authService"

export const useLogin = () => {
    const [loading, setLoading] = useState(false)

    const login = async (email: string, password: string) => {
        try {
            setLoading(true)

            const data = await signIn(email, password)

            await saveAuth(data.accessToken, data.refreshToken)

            return data
        } finally {
            setLoading(false)
        }
    }

    return { login, loading }
}