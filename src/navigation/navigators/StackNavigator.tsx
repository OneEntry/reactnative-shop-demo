import {Product} from '../../pages/content/ProductScreen';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ProductStackNavigatorParamList} from '../types/ProductStackNavigatorParamList';

const Stack = createNativeStackNavigator<ProductStackNavigatorParamList>();

export const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name={'Product'}
        component={Product}
        initialParams={{id: 0, category: ''}}
      />
    </Stack.Navigator>
  );
};
