import React from "react";
import { Text, ScrollView, Alert } from "react-native";
import { SETTINGS_MENU } from "../../../domain/constants/settingsMenu";
import SettingsItem from "../components/SettingsItem";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SettingsStackParamList } from "../../../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

type props = NativeStackNavigationProp<SettingsStackParamList, 'Settings'>;
export default function SettingsScreen() {

  const navigation = useNavigation<props>()
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

      case "about":
        navigation.navigate("About");
        break;

      case "privacy":
        navigation.navigate("Privacy");
        break;

      case "terms":
        navigation.navigate("Terms");
        break;

      case "hiring":
        navigation.navigate("Hiring");
        break;

      case "carrier_data":
        navigation.navigate('Carrier');
        break;

      case "faq":
        navigation.navigate('Faq');
        break;

      case "logout":
        Alert.alert("Logout", "Are you sure?", [
          { text: "Cancel" },
          { text: "Logout", onPress: () => console.log("logout") },
        ]);
        break;
    }
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white px-4">

      <Text className="text-xl font-bold mt-4 mb-6">
        Settings
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {SETTINGS_MENU.map((item) => (
          <SettingsItem
            key={item.id}
            title={item.label}
            onPress={() => handlePress(item.id)}
          />
        ))}
      </ScrollView>

    </SafeAreaView>
  );
}