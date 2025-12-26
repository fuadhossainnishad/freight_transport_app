import {
  ScrollView,
  // StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../../navigation/SettingsNavigator';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';
import EditIcon from '../../assets/icons/edit.svg';
import DeleteIcon from '../../assets/icons/delete.svg';

export const RoleList = [
  'Project Manager',
  'Crew',
  'Admin',
  'Accountant',
  'Viewer',
];

type Props = NativeStackNavigationProp<
  SettingsStackParamList,
  'RolePermission'
>;

export default function RolePermissionScreen() {
  const navigation = useNavigation<Props>();

  const handleEditActionPress = (roleName: string) => {
    // Here you can handle Edit/Delete/Add permissions
    console.log(`clicked for role: ${roleName}`);
  };
  const handleDeleteActionPress = (roleName: string) => {
    // Here you can handle Edit/Delete/Add permissions
    console.log(`clicked for role: ${roleName}`);
  };

  return (
    <View className="flex-1 gap-y-6 bg-gray-100">
      <AppHeader title="Role Permission" onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false} className="px-6">
        {RoleList.map((role, ind) => (
          <View
            key={ind}
            className="bg-white p-4 rounded-xl flex-row justify-between items-center mb-1"
          >
            <Text className="text-base font-medium">{role}</Text>
            <View className="flex-row gap-4">
              <TouchableOpacity
                className="rounded-full bg-[#F9F9FB] p-3"
                onPress={() => handleEditActionPress(role)}
              >
                <EditIcon width={20} height={20} />
              </TouchableOpacity>
              <TouchableOpacity
                className="rounded-full bg-[#F9F9FB] p-3"
                onPress={() => handleDeleteActionPress(role)}
              >
                <DeleteIcon width={20} height={20} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add New Role Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('AddNewRole')}
        className="bg-[#B09050] px-6 py-4 rounded-full shadow-lg mb-6 mx-6"
      >
        <Text className="text-black text-center font-normal text-lg">
          Add New Role
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// const styles = StyleSheet.create({
//   dropdown: {
//     position: 'absolute',
//     top: 40,
//     right: 0,
//     zIndex: 999,
//     elevation: 10,
//     backgroundColor: 'white',
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     shadowOffset: { width: 0, height: 2 },
//   },
// });
