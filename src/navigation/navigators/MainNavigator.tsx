import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {UserStackParamList} from '../types/UserStackParamList';
import AuthNavigator from './AuthNavigator';
import DrawerNavigator from './DrawerNavigator';
import {AuthContext} from '../../providers/AuthContext';
import Loader from '../../components/ui/space/Loader';
import ErrorScreen from '../../pages/ErrorScreen';

type Props = {};

const Stack = createNativeStackNavigator<UserStackParamList>();

const MainNavigator: React.FC<Props> = ({}) => {
  const {isLoading} = useContext(AuthContext);

  if (isLoading) {
    return <Loader showBanner />;
  }

  return (
    <Stack.Navigator
      initialRouteName={'Drawer'}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={'Drawer'} component={DrawerNavigator} />
      <Stack.Screen name={'Auth'} component={AuthNavigator} />
      <Stack.Screen name={'Error'} component={ErrorScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
