import { View, Image, Text, ImageSourcePropType } from 'react-native';

export interface User {
    profile: ImageSourcePropType
    name: string
    role: string
}

export default function UserModal({ data }: { data: User }) {
    return (
        <View className="flex-row items-center gap-4 p-4">
            <Image
                source={data.profile}
                className='h-16 w-16'
                resizeMode='cover'
            />
            <View className=''>
                <Text className='font-medium text-base'>{data.name}</Text>
                <Text className='font-normal text-sm'>{data.role}</Text>

            </View>
        </View>
    )
}