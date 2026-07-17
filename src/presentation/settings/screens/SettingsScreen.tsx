import React, { useState } from "react";
import { Text, ScrollView, Alert, View, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { SETTINGS_MENU } from "../../../domain/constants/settingsMenu";
import { BRAND_NAME } from "../../../domain/constants/brand";
import SettingsItem from "../components/SettingsItem";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SettingsStackParamList } from "../../../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileImagePicker from "../../../shared/components/ProfileImagePicker";
import { PickedFile } from "../../../shared/components/DocPicker";
import LanguageSwitcher from "../../../shared/components/LanguageSwitcher";
import { useAuth } from "../../../app/context/Auth.context";

type props = NativeStackNavigationProp<SettingsStackParamList, 'Settings'>;
export default function SettingsScreen() {

  const { t } = useTranslation()
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
        navigation.navigate('Driver');
        break;

      case "earning_overview":
        navigation.navigate('EarningOverview');
        break;

      // No `title` param: Info derives its header from `type` so it stays in
      // sync with the menu label and re-renders when the language changes.
      case "about":
        navigation.navigate("Info", { type: "about" });
        break;

      case "privacy":
        navigation.navigate("Info", { type: "privacy" });
        break;

      case "terms":
        navigation.navigate("Info", { type: "terms" });
        break;

      case "hiring":
        navigation.navigate("Info", { type: "hiring" });
        break;

      case "carrier_data":
        navigation.navigate("Info", { type: "carrier" });
        break;

      case "faq":
        navigation.navigate('Faq');
        break;
    }
  };

  const handleLogout = () => {
    Alert.alert(t("settings.logout.title"), t("settings.logout.message"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("settings.logout.confirm"),
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
        <Text className='text-center text-lg font-semibold text-black w-full'>{t("settings.title")}</Text>
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
            // `brand` is a no-op for keys that don't interpolate it; it keeps
            // the product name out of the translators' reach.
            title={t(item.labelKey, { brand: BRAND_NAME })}
            Icon={item.Icon}
            onPress={() => handlePress(item.id)}
          />
        ))}

        <View className="mt-4">
          <LanguageSwitcher />
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          className="bg-[#FF0000]/10 p-4 rounded-full my-5"
          disabled={loading}
        >
          {loading ?
            <ActivityIndicator color="#fff" />
            :
            <Text className="text-[#FF0702] text-center font-semibold">
              {t("settings.logOut")}
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