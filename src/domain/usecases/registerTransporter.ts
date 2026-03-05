import { signupApi } from "../../shared/api/auth.api";
import { CompanyRegistrationForm } from "../entities/CompanyRegistrationForm";

export const registerTransporter = async (
  payload: CompanyRegistrationForm,
  logo?: any
) => {
  const formData = new FormData();

  if (payload.companyName) {
    formData.append("company_name", payload.companyName);
  }

  formData.append("owner_name", payload.ownerName);
  formData.append("email", payload.email);
  formData.append("phone", payload.phone);
  formData.append("country", payload.country);

  if (payload.numberOfTrucks) {
    formData.append("number_of_trucks", String(payload.numberOfTrucks));
  }

  if (payload.truckType) {
    formData.append("truck_type", payload.truckType);
  }

  formData.append("password", payload.password);
  formData.append("role", "TRANSPORTER");

  formData.append("service_policy", "true");
  formData.append("terms_and_conditions", "true");

  if (logo) {
    formData.append("logo", {
      uri: logo.uri,
      name: logo.fileName ?? "logo.jpg",
      type: logo.type ?? "image/jpeg",
    } as any);
  }

  return signupApi(formData);
};