import {createNavigationContainerRef} from '@react-navigation/native';
import {UserStackParamList} from '../types/UserStackParamList';
import {IPagesEntity} from 'oneentry/dist/pages/pagesInterfaces';

export const navigationRef = createNavigationContainerRef<UserStackParamList>();

export const navigate = (stack: any, params?: any) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Drawer', {screen: stack, params});
  }
};

export const navigateAuth = (stack: any, params?: any) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Auth', {screen: stack, params});
  }
};

export const navigateError = (page: IPagesEntity) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Error', {page});
  }
};

export function goBack() {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}
