import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const DriverHeader = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        
        <Image 
          source={require('../../../../assets/logo/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <TouchableOpacity 
          activeOpacity={0.7}
          onPress={() => navigation.navigate('DriverProfile')}
        >
          <UserCircle size={32} color="#1A1C1E" strokeWidth={1.5} />
        </TouchableOpacity>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    zIndex: 100,
  },
  content: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  logo: {
    width: 120, 
    height: 100,
  },
});

export default DriverHeader;