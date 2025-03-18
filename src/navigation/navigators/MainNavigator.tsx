import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {UserStackParamList} from '../types/UserStackParamList';
import AuthNavigator from './AuthNavigator';
import DrawerNavigator from './DrawerNavigator';
import ErrorScreen from '../../pages/ErrorScreen';
import {navigationRef} from '../utils/NavigatonRef';
import {NavigationContainer} from '@react-navigation/native';

type Props = {};

const Stack = createNativeStackNavigator<UserStackParamList>();

const MainNavigator: React.FC<Props> = ({}) => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={'Drawer'}
        screenOptions={{headerShown: false}}>
        <Stack.Screen name={'Drawer'} component={DrawerNavigator} />
        <Stack.Screen name={'Auth'} component={AuthNavigator} />
        <Stack.Screen name={'Error'} component={ErrorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
