import { useState } from "react"
import { ChangePassword } from "../../../domain/entities/user.entity"
import { changePasswordUseCase } from "../../../domain/entities/changePassword.usecase copy"

export const useChangePassword = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null);


    const changePassword = async (payload: ChangePassword) => {
        try {
            setLoading(true)
            console.log(payload)

            const res = await changePasswordUseCase(payload);

            console.log("changePassword:", res)


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