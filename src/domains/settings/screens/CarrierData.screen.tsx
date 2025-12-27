import AppHeader from '../../../shared/components/AppHeader';
import { Text, ScrollView, ActivityIndicator, View } from 'react-native';
import { useEffect, useState } from 'react';

export default function CarrierDataScreen() {
  const [data, setData] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {});
  return (
    <View>
      <AppHeader title="Your Career Data" />
      <Text>Your carrer data</Text>
      {isLoading ? (
        <View>
          <ActivityIndicator size="small" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>{data}</ScrollView>
      )}
    </View>
  );
}
