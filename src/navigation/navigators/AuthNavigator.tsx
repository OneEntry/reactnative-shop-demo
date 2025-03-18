import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStackNavigatorParamList} from '../types/AuthStackNavigatorParamList';
import WelcomeScreen from '../../pages/auth/WelcomeScreen';
import SignInScreen from '../../pages/auth/SignInScreen';
import SignUpScreen from '../../pages/auth/SignUpScreen';
import OTPScreen from '../../pages/auth/OTPScreen';
import ResetPasswordScreen from '../../pages/auth/ResetPasswordScreen';
import NewPasswordScreen from '../../pages/auth/NewPasswordScreen';
import AuthTopBar from '../components/AuthTopBar';
import {useAppSelector} from '../../state/hooks';

type Props = {};

const Stack = createNativeStackNavigator<AuthStackNavigatorParamList>();

const AuthNavigator: React.FC<Props> = ({}) => {
  const {
    sign_in_title,
    sign_up_title,
    welcome_title,
    reset_title,
    otp_title,
    new_password_title,
  } = useAppSelector(state => state.systemContentReducer.content);
  return (
    <Stack.Navigator
      screenOptions={{
        header: ({options}) => {
          return <AuthTopBar title={options.title} />;
        },
        contentStyle: {backgroundColor: 'white'},
      }}
      initialRouteName={'auth_home'}>
      <Stack.Screen
        name={'auth_home'}
        options={{title: welcome_title}}
        component={WelcomeScreen}
      />
      <Stack.Screen
        name={'auth_sign_in'}
        options={{title: sign_in_title}}
        component={SignInScreen}
      />
      <Stack.Screen
        name={'auth_sign_up'}
        options={{title: sign_up_title}}
        component={SignUpScreen}
      />
      <Stack.Screen
        name={'activate_user'}
        options={{title: otp_title}}
        component={OTPScreen}
      />
      <Stack.Screen
        name={'reset_password'}
        options={{title: reset_title}}
        component={ResetPasswordScreen}
      />
      <Stack.Screen
        name={'new_password'}
        options={{title: new_password_title}}
        component={NewPasswordScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
