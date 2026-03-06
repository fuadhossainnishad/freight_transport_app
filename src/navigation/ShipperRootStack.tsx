import { useEffect, useState, useCallback } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";

import ShipperProfileWizard from "../presentation/profile_completion/screens/ShipperProfileWizard";
import ShipperTab from "./ShipperTab";
import { ProfileService } from "../data/services/profileService";
import { ShipperRootParamList } from "./types";

const Stack = createNativeStackNavigator<ShipperRootParamList>();

export default function ShipperRootStack({ userId }: { userId: string }) {

  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null);

  const checkProfile = useCallback(async () => {
    try {
      const profile = await ProfileService.getShipperProfile(userId);

      const isComplete = Boolean(
        profile?.company_address &&
        profile?.employee_size &&
        profile?.monthly_budget_for_shipment &&
        profile?.type_of_shipment &&
        profile?.shipping_marchandise_at &&
        profile?.ship_type &&
        profile?.shipper_type
      );

      setProfileComplete(isComplete);

    } catch (error) {
      console.error("Profile check failed:", error);
      setProfileComplete(false);
    } finally {
      setLoading(false);
    }

  }, [userId]);

  useEffect(() => {
    checkProfile();
  }, [checkProfile]);

  if (loading || profileComplete === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      {!profileComplete ? (
        <Stack.Screen
          name="ProfileWizard"
          component={ShipperProfileWizard}
        />
      ) : (
        <Stack.Screen
          name="Tabs"
          component={ShipperTab}
        />
      )}

    </Stack.Navigator>
  );
}