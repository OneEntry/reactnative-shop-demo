import React, {useCallback, useContext} from 'react';
import {NavigationProps, useAppNavigation} from '../../navigation/types/types';
import {AuthContext} from '../../state/contexts/AuthContext';
import {UserOrdersList} from '../../components/content/UserOrdersScreen';
import {useAppDispatch} from '../../state/hooks';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {setScreen} from '../../state/reducers/lastVisitedScreenSlice';

const UserOrdersScreen: React.FC<NavigationProps> = () => {
  const {user} = useContext(AuthContext);
  const dispatch = useAppDispatch();
  const params = useRoute();
  const navigation = useAppNavigation();

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        // @ts-ignore
        navigation.replace('Auth');
        dispatch(setScreen(params.name));

        return () => {};
      }
    }, [user]),
  );

  return <UserOrdersList />;
};

export default UserOrdersScreen;
