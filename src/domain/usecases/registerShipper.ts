import { signupApi } from "../../shared/api/auth.api";
import { CompanyRegistrationForm } from "../entities/companyRegistrationForm";

export const registerShipper = async (
    payload: CompanyRegistrationForm
) => {
    const body = {
        company_name: payload.companyName ?? "",
        email: payload.email,
        phone: payload.phone,
        country: payload.country,
        password: payload.password,
        role: payload.role,
        service_policy: payload.service_policy,
        terms_and_conditions: payload.acceptTerms,
    };

    return signupApi(body);
};