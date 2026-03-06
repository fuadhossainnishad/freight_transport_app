import { ActivityIndicator, View } from "react-native";
import ShipperRootStack from "./ShipperRootStack";
import TransporterRootStack from "./TransporterRootStack";
import { useAuth } from "../app/context/Auth.context";


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
    ) : (
        <TransporterRootStack userId={user?.transporter_id!} />
    );
}
