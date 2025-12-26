import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../../navigation/SettingsNavigator';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';


type Props = NativeStackNavigationProp<SettingsStackParamList, 'AddNewMail'>

export default function AddNewMailScreen() {
    const navigation = useNavigation<Props>()
    const [email, setEmail] = useState('')

    return (
        <View className="flex-1 gap-y-6 fle-col">
            <AppHeader title='Add New Mail' onBack={() => { navigation.goBack() }} />
            <View className='bg-white mx-6 rounded-lg p-4 gap-y-4'>
                <View className="">
                    <Text className=" text-xl font-medium text-black">
                        Add Mail Address!
                    </Text>
                    <Text className=" text-base font-normal text-black">
                        Please enter email address to get uploaded receipt
                    </Text>
                </View>
                <View className="gap-y-2">
                    <Text className="">Email</Text>
                    <TextInput
                        className="border border-gray-300 rounded-lg bg-white px-4 py-3 text-sm text-black"
                        placeholder="Enter your email"
                        placeholderTextColor="#62636C"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
            </View>
            <TouchableOpacity
                // onPress={() => navigation.navigate('CreateJob')}
                className=" bg-[#B09050] mx-6  py-4 rounded-full shadow-lg mt-auto"
            // style={styles.btn}
            >
                <Text className="text-black text-center font-normal text-lg">
                    Add New Mail
                </Text>
            </TouchableOpacity>
        </View>
    );
}

// const styles = StyleSheet.create({
//     dropdown: {
//         position: 'absolute',
//         top: 35,
//         right: 0,
//         zIndex: 999,
//         elevation: 10,
//         backgroundColor: 'white',
//         padding: 1,
//         borderRadius: 10,
//         shadowColor: '#000',
//         shadowOpacity: 0.3,
//         shadowRadius: 5,
//         shadowOffset: { width: 0, height: 2 },
//     },
//     btn: {
//         marginHorizontal: 24,
//         marginTop: 8,
//     },
// });
