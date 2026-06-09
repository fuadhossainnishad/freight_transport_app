import { ActivityIndicator, View } from "react-native";
import ShipperRootStack from "./ShipperRootStack";
import TransporterRootStack from "./TransporterRootStack";
import { useAuth } from "../app/context/Auth.context";
import DriverStackStack from "./DriverStack";


export default function AppStack() {
    const { user } = useAuth();
    console.log("AppStack", user)
    if (!user) {
        // User not loaded yet
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }
    return user?.role === "SHIPPER" ? (
        <ShipperRootStack userId={user?.shipper_id!} />
    ) : user?.role === "DRIVER" ? (
        <DriverStackStack />
    ) : (
        <TransporterRootStack userId={user?.transporter_id!} />
    );
}