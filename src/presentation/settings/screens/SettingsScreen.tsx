import React, { useState } from "react";
import { Text, ScrollView, Alert, View, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { SETTINGS_MENU } from "../../../domain/constants/settingsMenu";
import SettingsItem from "../components/SettingsItem";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SettingsStackParamList } from "../../../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileImagePicker from "../../../shared/components/ProfileImagePicker";
import { PickedFile } from "../../../shared/components/DocPicker";
import { useAuth } from "../../../app/context/Auth.context";

type props = NativeStackNavigationProp<SettingsStackParamList, 'Settings'>;
export default function SettingsScreen() {

  const navigation = useNavigation<props>()
  const [avatar, setAvatar] = useState<PickedFile | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth()

  // const performLogout = useCallback(async () => {
  //   try {
  //     setLoading(true);

  //     await logout();

  //     navigation.reset({
  //       index: 0,
  //       routes: [{ name: "SignIn" as never }],
  //     });
  //   } catch (error) {
  //     console.error("Logout failed:", error);

  //     Alert.alert(
  //       "Logout Failed",
  //       "Something went wrong while logging out. Please try again."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [navigation]);

  // const confirmLogout = useCallback(() => {
  //   Alert.alert("Logout", "Are you sure you want to log out?", [
  //     { text: "Cancel", style: "cancel" },
  //     { text: "Logout", style: "destructive", onPress: performLogout },
  //   ]);
  // }, [performLogout]);


  const handlePress = async (id: string) => {

    switch (id) {

      case "edit_profile":
        navigation.navigate("EditProfile");
        break;

      case "change_password":
        navigation.navigate("ChangePassword");
        break;

      case "bank_details":
        navigation.navigate("BankDetails");
        break;

      case "issue_report":
        navigation.navigate('IssueReported');
        break;

      case "my_vehicles":
        navigation.navigate('MyVehicles');
        break;

      case "driver_profiles":
        navigation.navigate('DriverProfiles');
        break;

      case "earning_overview":
        navigation.navigate('EarningOverview');
        break;

      case "about":
        navigation.navigate("Info", { type: "about", title: "About Us" });
        break;

      case "privacy":
        navigation.navigate("Info", { type: "privacy", title: "Privacy and security" });
        break;

      case "terms":
        navigation.navigate("Info", { type: "terms", title: "Terms & Conditions" });
        break;

      case "hiring":
        navigation.navigate("Info", { type: "hiring", title: "Lawpantruck is hiring" });
        break;

      case "carrier_data":
        navigation.navigate("Info", { type: "carrier", title: "Your Carrier Data" });
        break;

      case "faq":
        navigation.navigate('Faq');
        break;
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logout();
        },
      },
    ]);
  };
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white ">
      <View className='bg-white flex-row w-full p-4  items-center px-4'>
        <Text className='text-center text-lg font-semibold text-black w-full'>Settings</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContiner}
      >
        <ProfileImagePicker
          image={avatar}
          onChange={(file) => setAvatar(file)}
        />

        {SETTINGS_MENU.filter((item) => {
          if (!item.roles) return true;
          return item.roles.includes(user?.role as "SHIPPER" | "TRANSPORTER");
        }).map((item) => (
          <SettingsItem
            key={item.id}
            title={item.label}
            Icon={item.Icon}
            onPress={() => handlePress(item.id)}
          />
        ))}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-[#FF0000]/10 p-4 rounded-full my-5"
          disabled={loading}
        >
          {loading ?
            <ActivityIndicator color="#fff" />
            :
            <Text className="text-[#FF0702] text-center font-semibold">
              Log Out
            </Text>
          }

        </TouchableOpacity>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContiner: {
    backgroundColor: '#F9F9FB',
    flex: 1,
    gap: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,

  }
})