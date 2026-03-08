import { FAQ } from "../domain/entities/faq"

export type TransporterTabParamList = {
    Home: undefined
    AvailableBids: undefined
}

export type ShipperTabParamList = {
    HomeStack: undefined
    Shipments: undefined
    Settings: undefined
    Invoices: undefined
}

export type AuthParamList = {
    RootAuth: undefined;
    SignIn: undefined
    ShipperAuth: undefined;
    TransporterAuth: undefined;
    ForgotPassword: undefined;
    VerifyOtp: {
        email: string,
        verificationToken: string
    }
    ResetPassword: { verificationToken: string };
    CompleteTransporterProfile: undefined
    TransporterDashboard: undefined
    CompleteShipperProfile: undefined
    ShipperDashboard: undefined
};

export type TransporterRootParamList = {
    ProfileWizard: undefined;
    Tabs: undefined

};

export type ShipperRootParamList = {
    ProfileWizard: undefined;
    Tabs: undefined
};

export type ShipperHomeStackParamList = {
    Home: undefined;
    CreateShipment: undefined
};

export type TransporterHomeStackParamList = {
    ProfileWizard: undefined;
    Tabs: undefined
};

export type SettingsStackParamList = {
    Settings: undefined
    EditProfile: undefined;
    ChangePassword: undefined
    BankDetails: undefined;
    IssueReported: undefined;
    About: undefined;
    // VerifyOtp: {
    //     email: string,
    //     verificationToken: string
    // }
    // ResetPassword: { verificationToken: string };
    Privacy: undefined
    Terms: undefined
    Hiring: undefined
    Carrier: undefined
    Faq: undefined

};