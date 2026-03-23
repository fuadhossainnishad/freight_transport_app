import { InfoType } from "../domain/entities/info.entity"

export type TransporterTabParamList = {
    HomeStack: undefined
    AvailableBids: undefined
    Shipments: undefined
    Settings: undefined
    Earning: undefined
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
    Home: undefined;

};
export type AvailableBidsStackParamList = {
    AvailableBids: undefined;
    ShipmentDetails: { shipmentId: string }
    AssignVehicleDriver: { shipmentId: string }
};


export type ActiveShipmentsStackParamList = {
    ActiveShipments: undefined;
    CreateShipment: undefined
    ShipmentDetails: { shipmentId: string }
    ShipmentTracking: { shipmentId: string }
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
    MyVehicles: undefined
    DriverProfiles: undefined
    EarningOverview: undefined
    Privacy: undefined
    Terms: undefined
    Hiring: undefined
    Carrier: undefined
    Faq: undefined
    Info: { type: InfoType; title: string }; // type-safe


};

export type VehicleStackParamList = {
    Vehicle: undefined;
    VehicleDetails: { vehicleId: string }
    UpdateVehicle: { vehicleId: string }
    AddVehicle: undefined

};