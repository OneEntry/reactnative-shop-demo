import {
  useNavigation,
} from '@react-navigation/native';
import {
  DrawerNavigationProp,
  DrawerScreenProps,
} from '@react-navigation/drawer';
import {DrawerStackNavigatorParamList} from './DrawerStackNavigatorParamList';

export const useAppNavigation = () =>
  useNavigation<DrawerNavigationProp<DrawerStackNavigatorParamList>>();

export type NavigationProps = DrawerScreenProps<DrawerStackNavigatorParamList>;
