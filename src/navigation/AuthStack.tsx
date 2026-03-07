import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthFormContext from '../presentation/auth/AuthForm.context';
import SignupScreen from '../presentation/auth/screens/Signup.screen';
import LoginScreen from '../presentation/auth/screens/LoginScreen';
import ForgetPasswordScreen from '../presentation/auth/screens/ForgetPassword.screen';
import VerifyOtpScreen from '../presentation/auth/screens/VerifyOtp.screen';
import { AuthParamList } from './types';
import ResetPasswordScreen from '../presentation/auth/screens/ResetPassword.screen';
import CreateShipmentScreen from '../presentation/shipper/screens/CreateShipmentScreen';

const Stack = createNativeStackNavigator<AuthParamList>();

export default function AuthStack() {
  return (
    <AuthFormContext>
      <Stack.Navigator
        initialRouteName='SignIn'
        screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name='RootAuth'
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='SignIn'
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='ForgotPassword'
          component={ForgetPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='VerifyOtp'
          component={VerifyOtpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='ResetPassword'
          component={ResetPasswordScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </AuthFormContext>
  );
}
