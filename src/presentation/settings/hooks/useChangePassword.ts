import { useState } from "react"
import { ChangePassword } from "../../../domain/entities/user.entity"
import { changePasswordUseCase } from "../../../domain/usecases/changePassword.usecase"

export const useChangePassword = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null);


    const changePassword = async (payload: ChangePassword) => {
        try {
            setLoading(true)
            

            const res = await changePasswordUseCase(payload);

            


            return res;



        } catch (err: any) {

            setError(err?.message || "Profile update failed");
            throw err;

        } finally {
            setLoading(false)
        }
    }

    return { changePassword, loading, error }
}