import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Arrow from '../../../assets/icons/arrow.svg'

type Props = {
    onpress: () => void
    text: string
}


export default function AppHeader({
    text,
    onpress
}: Props) {
    return (
        <View className='relative flex-row w-full p-4  items-center'>
            <Text className='text-center text-lg font-semibold text-black w-full'>{text}</Text>
            <TouchableOpacity
                className='absolute ml-4'
                onPress={onpress}
            >
                <Arrow height={24} width={24} />
            </TouchableOpacity>
        </View>
    );
};
