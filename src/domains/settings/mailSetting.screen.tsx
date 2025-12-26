import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MailIcon from '../../assets/icons/mail.svg';
import ThreeDotIcon from '../../assets/icons/threedot.svg';
import { MailSettingsAction } from '../../components/Actions';
import { useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../../navigation/SettingsNavigator';
import { useNavigation } from '@react-navigation/native';
import SearchIcon from '../../assets/icons/search.svg';
import AppHeader from '../../components/AppHeader';

export const MailList = [
  'buildright.contractors@gmail.com',
  'buildright.contractors@gmail.com',
  'buildright.contractors@gmail.com',
  'buildright.contractors@gmail.com',
];

type Props = NativeStackNavigationProp<SettingsStackParamList, 'MailSettings'>;

export default function MailSettings() {
  const navigation = useNavigation<Props>();
  const [openActionIndex, setOpenActionIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View className="flex-1 gap-y-6">
      <AppHeader
        title="Mail Settings"
        onBack={() => {
          navigation.goBack();
        }}
      />

      <View className="px-6  flex-row items-center gap-5">
        <View className="flex-1 flex-row items-center bg-white rounded-xl px-4 py-1">
          <SearchIcon height={16} width={16} className="" />

          <TextInput
            className="ml-2 text-base"
            placeholder="Search here..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} className="px-6">
        {MailList.map((mail, ind) => (
          <View
            key={ind}
            className="bg-white p-5 rounded-xl flex-row justify-between items-center"
          >
            <MailIcon width={24} height={24} />
            <Text className="">{mail}</Text>
            <TouchableOpacity
              onPress={() =>
                setOpenActionIndex(openActionIndex === ind ? null : ind)
              }
              className=""
            >
              <ThreeDotIcon width={16} height={16} />
            </TouchableOpacity>

            {/* DROPDOWN MENU */}
            {openActionIndex === ind && (
              <View style={styles.dropdown}>
                <MailSettingsAction />
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={() => navigation.navigate('AddNewMail')}
        className=" bg-[#B09050] px-6 py-4 rounded-full shadow-lg"
        style={styles.btn}
      >
        <Text className="text-black text-center font-normal text-lg">
          Add New Mail
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    position: 'absolute',
    top: 35,
    right: 0,
    zIndex: 999,
    elevation: 10,
    backgroundColor: 'white',
    padding: 1,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  btn: {
    marginHorizontal: 24,
    marginTop: 8,
  },
});
