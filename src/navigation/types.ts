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
    Invoices: undefined
    Payments: undefined
    Settings: undefined
}

export type PaymentsStackParamList = {
    PaymentRequests: undefined
    PayWebView: { paymentId: string; url: string; title?: string }
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
    Bids: undefined
    BidDetails: { shipmentId: string; shipment?: any }
};

export type TransporterHomeStackParamList = {
    Home: undefined;
    ShipmentDetails: { shipmentId: string }
    ShipmentTracking: { shipmentId: string }
    ActiveShipments: undefined
    ActiveShipmentDetailsScreen: { shipmentId: string }
    AssignVehicleDriver: { shipmentId: string }
    PayWebView: { paymentId: string; url: string; title?: string }
};
export type AvailableBidsStackParamList = {
    AvailableBids: undefined;
    ShipmentDetails: { shipmentId: string }
    AssignVehicleDriver: { shipmentId: string }
};


export type ActiveShipmentsStackParamList = {
    ActiveShipments: undefined;
    ActiveShipmentDetailsScreen: { shipmentId: string}
    CreateShipment: undefined
    ShipmentDetails: { shipmentId: string }
    ShipmentTracking: { shipmentId: string }
    ShipperShipmentDetail: { shipmentId: string }
    PayWebView: { paymentId: string; url: string; title?: string }
};

export type InvoiceStackParamList = {
    Invoices: undefined;
    CreateShipment: undefined
    InvoiceDetails: { paymentId: string }
    ShipmentTracking: { shipmentId: string }
};

export type EarningsStackParamList = {
    Earning: undefined;
    Withdraw: undefined
    WithdrawalHistory: undefined
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
    Privacy: undefined
    Terms: undefined
    Hiring: undefined
    Carrier: undefined
    Faq: undefined
    // The header title is derived from `type` inside Info.screen so it follows
    // the active language; passing it as a param froze it at navigation time.
    Info: { type: InfoType };


};

export type VehicleStackParamList = {
    Vehicle: undefined;
    VehicleDetails: { vehicleId: string }
    UpdateVehicle: { vehicleId: string }
    AddVehicle: undefined

};

export type MyDriversStackParamList = {
    MyDrivers: undefined;
    DriverProfileDetails: { driverId: string }
    UpdateDriverProfile: { driverId: string }
    AddDriver: undefined

};

export type DriverStackParamList = {
    DriverHome: undefined;
    DriverProfile: undefined;
    ShipmentDetail: { shipmentId: string }
    DriverProfileDetails: { driverId: string }
    UpdateDriverProfile: { driverId: string }
    AddDriver: undefined
    LiveTracking: { shipmentId: string }

};

export type DriverHomeStackParamList = {
    DriverHome: undefined;
    DriverProfileDetails: { driverId: string }
    UpdateDriverProfile: { driverId: string }
    AddDriver: undefined

};