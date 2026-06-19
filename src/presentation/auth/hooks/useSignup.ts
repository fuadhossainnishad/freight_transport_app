import { useState } from "react";
import { CompanyRegistrationForm } from "../../../domain/entities/companyRegistrationForm";
import { registerTransporter } from "../../../domain/usecases/registerTransporter";
import { registerShipper } from "../../../domain/usecases/registerShipper";

export const useSignup = () => {
    const [loading, setLoading] = useState(false);

    const signup = async (data: CompanyRegistrationForm) => {
        try {
            setLoading(true);
            console.log("data:", data)

            // Await the registration so `loading` stays true for the whole
            // request — returning the promise unawaited would let `finally`
            // reset it immediately, hiding the spinner.
            switch (data.role) {
                case "TRANSPORTER":
                    return await registerTransporter(data);

                case "SHIPPER":
                    return await registerShipper(data);

                default:
                    throw new Error("Invalid role");
            }
        } finally {
            setLoading(false);
        }
    };

    return { signup, loading };
};