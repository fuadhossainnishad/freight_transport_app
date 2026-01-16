import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from '../../../../assets/icons/logo.svg'
import RoleSelector from '../components/RoleSelector';
import { useUser } from '../../../app/context/User.context';
import { useState } from 'react';

export default function SignupScreen() {
  const { user, setUser } = useUser()
  const [selectedRole, setSelectedRole] = useState<string>('');
  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    // Update user context if needed
    setUser({ ...user, role: role as 'shipper' | 'transporter' });
  };
  return (
    <SafeAreaView edges={['top']} style={styles.safeAreaContainer}>
      <View className='justify-center items-center space-y-4'>
        <Logo height={180} width={180} />
        <Text>Create Account</Text>
        <Text>Join thousands of businesses and transporters</Text>
      </View>

      <View className='flex-row w-full justify-center gap-4'>
        <RoleSelector
          role="business"
          title="Business"
          selected={selectedRole === 'business'}
          onRoleChange={handleRoleChange}
        />
        <RoleSelector
          role="transporter"
          title="Transporter"
          selected={selectedRole === 'transporter'}
          onRoleChange={handleRoleChange}
        />
      </View>    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    backgroundColor: '#FFFFFF'
  }
})