import { ActivityIndicator, View } from "react-native";
import { useUser } from "../app/context/User.context";
import ShipperRootStack from "./ShipperRootStack";
import TransporterRootStack from "./TransporterRootStack";


export default function AppStack() {
    const { user } = useUser();
    if (!user) {
        // User not loaded yet
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }
    return user?.role === "SHIPPER" ? (
        <ShipperRootStack userId={user?.id!} />
    ) : (
        <TransporterRootStack userId={user?.id!} />
    );
}
