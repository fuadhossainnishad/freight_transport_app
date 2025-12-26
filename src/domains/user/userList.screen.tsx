import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  LayoutChangeEvent,
} from 'react-native';
import { listData } from './data';
import UserModal from '../../components/user/user.component';
import SearchIcon from '../../assets/icons/search.svg';
import { useRef, useState } from 'react';
import FilterIcon from '../../assets/icons/filter.svg';
import AppHeader from '../../components/AppHeader';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UsersStackParamList } from '../../navigation/UsersNavigator';
import { UsersAction } from '../../components/Actions';
import ThreedotIcon from '../../assets/icons/threedot.svg';
import UserActionModal from '../../components/modals/userActionModal';
// import LockIcon from '../../assets/icons/lock.svg'

type Props = NativeStackNavigationProp<UsersStackParamList, 'Users'>;

export default function UserListScreen() {
  const navigation = useNavigation<Props>();
  const [searchQuery, setSearchQuery] = useState('');
  const [openActionIndex, setOpenActionIndex] = useState<number | null>(0);
  const [actionPosition, setActionPosition] = useState<number>(0);
  const scrollRef = useRef<ScrollView>(null);

  // inside UserListScreen
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState<
    'sendInvite' | 'edit' | 'activate' | 'deactivate' | 'delete' | null
  >(null);
  const [selectedUserName, setSelectedUserName] = useState<string | undefined>(
    undefined,
  );

  const handleActionPress = (action: string, userName: string) => {
    switch (action) {
      case 'Send Invite':
        setSelectedUserName(userName);
        setModalAction('sendInvite');
        setModalVisible(true);
        break;
      case 'Edit':
        const userData = listData.find(u => u.name === userName);
        if (userData) navigation.navigate('AddNewUser');
        break;
      case 'Deactivate':
        setSelectedUserName(userName);
        setModalAction('deactivate');
        setModalVisible(true);
        break;
      case 'Delete':
        setSelectedUserName(userName);
        setModalAction('delete');
        setModalVisible(true);
        break;
      case 'Activate':
        setSelectedUserName(userName);
        setModalAction('activate');
        setModalVisible(true);
        break;
    }
  };

  const handleConfirmAction = () => {
    console.log(`${modalAction} confirmed for user: ${selectedUserName}`);
    // TODO: handle API call or state update here
    setModalVisible(false);
  };

  const handleLayout = (ind: number, event: LayoutChangeEvent) => {
    if (openActionIndex === ind) {
      const layout = event.nativeEvent.layout;
      setActionPosition(layout.y);
    }
  };
  const handlePress = (ind: number) => {
    if (openActionIndex === ind) {
      setOpenActionIndex(null);
    } else {
      setOpenActionIndex(ind);
      scrollRef.current?.scrollTo({ y: actionPosition, animated: true });
    }
  };

  return (
    <View className="flex-1 ">
      <AppHeader
        title="User Management"
        onBack={() => {
          navigation.goBack();
        }}
      />
      <View className="px-6  flex-row items-center gap-5">
        <View className="flex-1 flex-row items-center bg-white rounded-lg px-4 py-2">
          <SearchIcon height={16} width={16} className="" />

          <TextInput
            className="ml-2 text-base"
            placeholder="Search here..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          // onPress={showPicker}
          className="bg-white p-3 rounded-lg"
        >
          <FilterIcon height={20} width={20} className="" />
          {/* {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onChange}
                        />
                    )} */}
        </TouchableOpacity>
      </View>
      <ScrollView ref={scrollRef} className="px-3">
        {listData.map((item, ind) => (
          <View
            key={ind}
            className="flex-row justify-between relative"
            onLayout={event => handleLayout(ind, event)}
          >
            <UserModal data={item} />
            <View className="flex-col gap-2 items-end self-center">
              <TouchableOpacity className="" onPress={() => handlePress(ind)}>
                {/* <LockIcon height={16} width={16} /> */}
                <ThreedotIcon height={16} width={16} className="" />
              </TouchableOpacity>
              <View className="py-1 px-2 bg-[#E9FFF4] rounded-md">
                <Text>Active</Text>
              </View>
            </View>

            {openActionIndex === ind && (
              <UsersAction
                container={{
                  className:
                    'absolute right-0 bg-white rounded-2xl shadow shadow-md',
                  style: { top: actionPosition + 20, marginRight: 20 },
                }}
                onActionPress={actionName =>
                  handleActionPress(actionName, item.name)
                }
              />
            )}

            <UserActionModal
              visible={modalVisible}
              action={modalAction}
              userName={selectedUserName}
              onClose={() => setModalVisible(false)}
              onConfirm={handleConfirmAction}
            />
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        onPress={() => navigation.navigate('AddNewUser')}
        className=" bg-[#B09050] px-6 py-4 rounded-full shadow-lg my-auto"
      >
        <Text className="text-black text-center font-normal text-lg">
          Add New User
        </Text>
      </TouchableOpacity>
    </View>
  );
}
