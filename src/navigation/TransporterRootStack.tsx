import { useEffect, useState, useCallback } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";

import TransporterProfileWizard from "../presentation/profile_completion/screens/TransporterProfileWizard";
import TransporterTab from "./TransporterTab";
import { ProfileService } from "../data/services/profileService";
import { TransporterRootParamList } from "./types";

const Stack = createNativeStackNavigator<TransporterRootParamList>();

export default function TransporterRootStack({ userId }: { userId: string }) {

  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null);

  const checkProfile = useCallback(async () => {
    try {
      const profile = await ProfileService.getTransporterProfile(userId);

      const isComplete = Boolean(
        profile?.company_name &&
        profile?.number_of_trucks !== undefined &&
        profile?.truck_type &&
        profile?.vehicles &&
        profile?.email &&
        profile?.phone
      );

      setProfileComplete(isComplete);

    } catch (error) {
      console.error("Transporter profile check failed:", error);
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
          component={TransporterProfileWizard}
        />
      ) : (
        <Stack.Screen
          name="Tabs"
          component={TransporterTab}
        />
      )}

    </Stack.Navigator>
  );
}