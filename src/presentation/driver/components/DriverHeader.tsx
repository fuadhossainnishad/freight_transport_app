import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const DriverHeader = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <Image
          source={require('../../../../assets/logo/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('DriverProfile')}
          style={styles.avatarButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <UserCircle size={26} color="#036BB4" strokeWidth={1.75} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
    zIndex: 100,
    ...Platform.select({
      ios: {
        shadowColor: '#0A4E80',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  content: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  logo: {
    width: 132,
    height: 40,
  },
  avatarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F6FB',
    borderWidth: 1,
    borderColor: '#E5EEF6',
  },
});

export default DriverHeader;
