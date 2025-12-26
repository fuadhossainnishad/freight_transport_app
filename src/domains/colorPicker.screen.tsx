// src/screens/ColorPickerScreen.tsx
import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = NativeStackNavigationProp<RootStackParamList, 'ColorPicker'>;

const colors = [
  { name: 'Warm Khaki', color: '#B09050' },
  { name: 'Ocean Crest', color: '#2A4D9B' },
  { name: 'Emerald Forge', color: '#2E8B57' },
  { name: 'Crimson Brick', color: '#B22222' },
  { name: 'Iron Shadow', color: '#333333' },
  { name: 'Steel Horizon', color: '#4682B4' },
  { name: 'Sunset Ember', color: '#FF7043' },
  { name: 'Everwood Green', color: '#228B22' },
  { name: 'Royal Amethyst', color: '#6A1B9A' },
  { name: 'Teal Aurora', color: '#008080' },
  { name: 'Copper Flame', color: '#CC6600' },
  { name: 'Slate Storm', color: '#708090' },
];

export default function ColorPickerScreen() {
  const [selectedColor, setSelectedColor] = useState<string>(colors[0].color);
  const navigation = useNavigation<Props>();

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };
  // useEffect(() => {
  //     handleColorSelect
  // }, [selectedColor])
  return (
    <ScrollView className="">
      <View className="flex-row items-center px-6 py-2 bg-white border-b border-b-[#D8D9E0]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text className="flex-1 text-center text-2xl font-medium text-black">
          Create New Account
        </Text>

        <View className="w-8" />
      </View>

      <View className="flex-row flex-wrap justify-between p-4 w-full">
        {colors.map((item, ind) => (
          <View key={ind} className="w-1/3 items-center mb-4">
            <TouchableOpacity
              className={`w-full h-24 rounded-full items-center justify-center`}
              style={[styles.colorItem, { backgroundColor: item.color }]}
              onPress={() => {
                handleColorSelect(item.color);
              }}
            >
              {selectedColor === item.color && (
                // <Image
                //     source={require('../assets/icons/select.png')}
                //     className="w-2 h-2"
                //     resizeMode="contain" />

                <Icon name="checkmark" size={30} color="#fff" />
              )}
            </TouchableOpacity>
            <Text className="text-sm text-black mt-2">{item.name}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity
        className=" py-4 rounded-full m-4"
        style={[styles.buttonBg, { backgroundColor: selectedColor }]}
        onPress={() => {
          navigation.navigate('Signup', { selectedColor: selectedColor });
        }}
      >
        <Text className="text-center font-normal text-lg">Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  colorItem: {
    width: '30%',
    aspectRatio: 1,
  },
  buttonBg: {},
});
