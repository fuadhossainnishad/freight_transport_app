import AppHeader from '../../../shared/components/AppHeader';
import { Text, ScrollView, ActivityIndicator, View, StyleSheet, RefreshControl } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CarrierDataScreen() {
  const [data, setData] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false)
  const handleFetchData = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(() => resolve, 1500))
    setData("This is a settings portion")
  }
  useEffect(() => {
    handleFetchData()
  }, []);
  const refreshHandler = useCallback(() => {
    setIsRefreshing(true)
    handleFetchData()
  }, [])
  return (
    <SafeAreaView edges={['top', 'left', 'right']}>
      <AppHeader title="Your Career Data" />
      <Text>Your carrer data</Text>
      {isLoading ? (
        <View>
          <ActivityIndicator size="small" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={refreshHandler} tintColor='#1D3557' />
          }
        >{data}</ScrollView>
      )}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  scrollViewStyle: {

  }
})