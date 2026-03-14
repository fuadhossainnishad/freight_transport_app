import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthFormContext from '../presentation/auth/AuthForm.context';
import { SettingsStackParamList } from './types';
import FaqScreen from '../presentation/settings/screens/FaqScreen';
import SettingsScreen from '../presentation/settings/screens/SettingsScreen';
import EditProfileScreen from '../presentation/settings/screens/EditProfileScreen';
import ChangePasswordScreen from '../presentation/settings/screens/ChangePassword.screen';
import BankDetailsScreen from '../presentation/settings/screens/BankDetailsScreen';
import IssuesScreen from '../presentation/settings/screens/IssuesScreen';
import InfoScreen from '../presentation/settings/screens/Info.screen';

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
          component={EditProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='ChangePassword'
          component={ChangePasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='BankDetails'
          component={BankDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='IssueReported'
          component={IssuesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Info'
          component={InfoScreen}
          options={{ headerShown: false }}
        />

        {/* 
        
        <Stack.Screen
          name='Privacy'
          component={PrivacyScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='IssueReported'
          component={VerifyOtpScreen}
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
