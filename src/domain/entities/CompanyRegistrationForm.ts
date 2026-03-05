export interface CompanyRegistrationForm {
  companyName?: string;
  ownerName: string;
  email: string;
  phone: string;
  country: string;

  role: 'TRANSPORTER' | 'SHIPPER'

  numberOfTrucks?: number;
  truckType?: string;

  password: string;
  confirmPassword: string;

  acceptTerms: boolean;
  service_policy: boolean

}