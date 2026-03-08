import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthFormContext from '../presentation/auth/AuthForm.context';
import { SettingsStackParamList } from './types';
import FaqScreen from '../presentation/settings/screens/FaqScreen';
import SettingsScreen from '../presentation/settings/screens/SettingsScreen';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsStack() {
  return (
    <AuthFormContext>
      <Stack.Navigator
        initialRouteName='Settings'
        screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name='Settings'
          component={SettingsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='EditProfile'
          component={FaqScreen}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen
          name='ChangePassword'
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='BankDetails'
          component={ForgetPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='IssueReported'
          component={VerifyOtpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='About'
          component={ResetPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Terms'
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Privacy'
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Hiring'
          component={ForgetPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Carrier'
          component={VerifyOtpScreen}
          options={{ headerShown: false }}
        />
        */}
        <Stack.Screen
          name='Faq'
          component={FaqScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </AuthFormContext>
  );
}
