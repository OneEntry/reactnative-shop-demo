import {NavigatorScreenParams} from '@react-navigation/native';
import {DrawerStackNavigatorParamList} from './DrawerStackNavigatorParamList';
import {AuthStackNavigatorParamList} from './AuthStackNavigatorParamList';
import {IPagesEntity} from 'oneentry/dist/pages/pagesInterfaces';

export type UserStackParamList = {
  Drawer: NavigatorScreenParams<DrawerStackNavigatorParamList>;
  Auth: NavigatorScreenParams<AuthStackNavigatorParamList>;
  Error: {
    page: IPagesEntity;
  };
};
