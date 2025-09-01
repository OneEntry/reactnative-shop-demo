import {RouteProp, useRoute} from '@react-navigation/native';
import {AuthStackNavigatorParamList} from '../types/AuthStackNavigatorParamList';
import {UserStackParamList} from '../types/UserStackParamList';

export const useErrorRoute = () =>
  useRoute<RouteProp<UserStackParamList, 'Error'>>();

export type AuthActivateRouteProp = RouteProp<
  AuthStackNavigatorParamList,
  'activate_user'
>;
