import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {navigationRef} from '../utils/NavigatonRef';
import MainNavigator from './MainNavigator';

export const Router: React.FC = ({}) => {
  return (
    <NavigationContainer ref={navigationRef}>
      <MainNavigator />
    </NavigationContainer>
  );
};
