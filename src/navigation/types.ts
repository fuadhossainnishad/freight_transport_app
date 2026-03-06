export type TransporterTabParamList = {
    Home: undefined
    AvailableBids: undefined
}

export type ShipperTabParamList = {
    Home: undefined
    Shippments: undefined
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