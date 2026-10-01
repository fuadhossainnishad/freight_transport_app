import { signupApi } from "../../shared/api/auth.api";
import { getDefaultLogoFile } from "../../shared/utils/defaultLogo";
import { CompanyRegistrationForm } from "../entities/CompanyRegistrationForm";

export const registerTransporter = async (
  payload: CompanyRegistrationForm,
) => {
  const formData = new FormData();

  if (payload.companyName) {
    formData.append("company_name", payload.companyName);
  }

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
  formData.append("role", payload.role);
  formData.append("service_policy", true);

  // formData.append("service_policy", payload.service_policy);
  formData.append("terms_and_conditions", true); 

  // formData.append("terms_and_conditions", payload.acceptTerms);
  // formData.append("logo", DEFAULT_COMPANY_LOGO);
  formData.append("logo", getDefaultLogoFile() as any);


  // if (logo) {
  //   formData.append("logo", {
  //     uri: logo.uri,
  //     name: logo.fileName ?? "logo.jpg",
  //     type: logo.type ?? "image/jpeg",
  //   } as any);
  // }

  return signupApi(formData);
};