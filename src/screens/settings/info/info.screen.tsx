import { View, Text, ScrollView } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import { SettingsStackParamList } from '../../../navigation/SettingsNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = NativeStackNavigationProp<SettingsStackParamList, 'InfoScreen'>

export default function InfoScreen() {
    const route = useRoute<RouteProp<SettingsStackParamList, 'InfoScreen'>>();
    const navigation = useNavigation<Props>()
    const { title, content } = route.params;

    return (
        <View className="flex-1 ">
            <AppHeader title={title} onBack={() => { navigation.goBack() }} />

            <ScrollView className="mx-6 my-4 rounded-xl p-6 bg-white">
                <Text className="text-base text-black leading-6">
                    {content}
                </Text>
            </ScrollView>
        </View>
    );
}
