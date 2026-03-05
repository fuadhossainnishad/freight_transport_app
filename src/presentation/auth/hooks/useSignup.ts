import { useState } from "react";
import { CompanyRegistrationForm } from "../../../domain/entities/CompanyRegistrationForm";
import { registerTransporter } from "../../../domain/usecases/registerTransporter";

export const useSignup = () => {
    const [loading, setLoading] = useState(false);

    const signup = async (data: CompanyRegistrationForm, logo?: any) => {
        try {
            setLoading(true);
            const response = await registerTransporter(data, logo);
            return response;
        } finally {
            setLoading(false);
        }
    };

    return {
        signup,
        loading,
    };
};