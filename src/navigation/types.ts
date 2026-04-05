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
    ShipmentDetails: { shipmentId: string }
    ShipmentTracking: { shipmentId: string }
    ActiveShipments: undefined
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

export type InvoiceStackParamList = {
    Invoices: undefined;
    CreateShipment: undefined
    InvoiceDetails: undefined
    // InvoiceDetails: { shipmentId: string }
    ShipmentTracking: { shipmentId: string }
};

export type EarningsStackParamList = {
    Earning: undefined;
    Withdraw: undefined
};

export type SettingsStackParamList = {
    Settings: undefined
    EditProfile: undefined;
    ChangePassword: undefined
    BankDetails: undefined;
    IssueReported: undefined;
    IssueSummary: { issueId: string };
    About: undefined;
    // VerifyOtp: {
    //     email: string,
    //     verificationToken: string
    // }
    // ResetPassword: { verificationToken: string };
    MyVehicles: undefined
    Driver: undefined
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

export type DriverStackParamList = {
    DriverProfile: undefined;
    DriverProfileDetails: { driverId: string }
    UpdateDriverProfile: { driverId: string }
    AddDriver: undefined

};

export type DriverHomeStackParamList = {
    DriverHome: undefined;
    DriverProfileDetails: { driverId: string }
    UpdateDriverProfile: { driverId: string }
    AddDriver: undefined

};