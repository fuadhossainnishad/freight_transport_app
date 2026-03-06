import { useState } from "react"
import { signIn } from "../../../data/services/authService"
import { saveAuth } from "../../../shared/storage/authStorage"
import { decodeAccessToken } from "../../../shared/utils/jwt"
import { useAuth } from "../../../app/context/Auth.context"

export const useLogin = () => {
    const [loading, setLoading] = useState(false)
    const { login: setAuthUser } = useAuth();


    const login = async (email: string, password: string) => {
        try {
            setLoading(true)
            console.log(email, password)
            const data = await signIn(email, password)

            const decoded = decodeAccessToken(data.accessToken)

            const user = {
                id: decoded._id,
                role: decoded.role,
            };

            await saveAuth(data.accessToken, data.refreshToken)
            setAuthUser(user);

            return user;


        } finally {
            setLoading(false)
        }
    }

    return { login, loading }
}