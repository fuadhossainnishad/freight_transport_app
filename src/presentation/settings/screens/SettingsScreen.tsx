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

type props = NativeStackNavigationProp<SettingsStackParamList, 'Settings'>;
export default function SettingsScreen() {

  const navigation = useNavigation<props>()
  const [avatar, setAvatar] = useState<PickedFile | null>(null);

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

        {SETTINGS_MENU.map((item) => (
          <SettingsItem
            key={item.id}
            title={item.label}
            Icon={item.Icon}
            onPress={() => handlePress(item.id)}
          />
        ))}
        <TouchableOpacity
          onPress={onSubmit}
          className="bg-[#036BB4] p-4 rounded-full"
          disabled={loading}
        >
          {loading ?
            <ActivityIndicator color="#fff" />
            :
            <Text className="text-white text-center font-semibold">
              Log Out
            </Text>
          }

        </TouchableOpacity>      </ScrollView>

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