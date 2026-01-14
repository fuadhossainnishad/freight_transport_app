export interface CompanyRegistrationForm {
    companyName?: string;
    ownerName: string;
    email: string;
    phone: string;
    country: string;

    numberOfTrucks?: number;
    truckType?: string;

    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
}
