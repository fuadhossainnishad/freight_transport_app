import { logger } from '../shared/utils/logger'
import { useEffect, useState, useCallback } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";

import ShipperProfileWizard from "../presentation/profile_completion/screens/ShipperProfileWizard";
import ShipperTab from "./ShipperTab";
import { useUser } from "../app/context/User.context";
import { ProfileService } from "../data/services/profileService";
import { ShipperRootParamList } from "./types";

const Stack = createNativeStackNavigator<ShipperRootParamList>();

export default function ShipperRootStack({ userId }: { userId: string }) {

  const [loading, setLoading] = useState(true);
  const { setUser } = useUser();
  const [profileComplete, setProfileComplete] = useState<boolean>(false);
  logger.info("userid:", userId)
  const checkProfile = useCallback(async () => {
    try {
      const profile = await ProfileService.getShipperProfile(userId);
      logger.info("checkProfile:", profile)
      const isComplete = Boolean(
        profile?.company_address &&
        profile?.employee_size &&
        profile?.monthly_budget_for_shipment &&
        profile?.type_of_shipment &&
        profile?.shipping_marchandise_at &&
        profile?.ship_type
      );
      logger.info("isComplete:", isComplete)
      setProfileComplete(isComplete);
      setUser({ shipperProfile: profile } as any);

    } catch (error) {
      logger.error("Profile check failed:", error);
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
    <Stack.Navigator
      initialRouteName={profileComplete ? "Tabs" : "ProfileWizard"}
      screenOptions={{
        headerShown: false
      }}>

      <Stack.Screen
        name="ProfileWizard"
        component={ShipperProfileWizard}
      />
      <Stack.Screen
        name="Tabs"
        component={ShipperTab}
      />

    </Stack.Navigator>
  );
}