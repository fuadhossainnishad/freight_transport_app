import { useState } from "react";
import { CompanyRegistrationForm } from "../../../domain/entities/CompanyRegistrationForm";
import { registerTransporter } from "../../../domain/usecases/registerTransporter";
import { registerShipper } from "../../../domain/usecases/registerShipper";

export const useSignup = () => {
    const [loading, setLoading] = useState(false);

    const signup = async (data: CompanyRegistrationForm) => {
        try {
            setLoading(true);
            console.log("data:", data)

            switch (data.role) {
                case "TRANSPORTER":
                    return registerTransporter(data);

                case "SHIPPER":
                    return registerShipper(data);

                default:
                    throw new Error("Invalid role");
            }
        } finally {
            setLoading(false);
        }
    };
    console.log("signup:", signup)

    return { signup, loading };
};