import React, {useCallback, useState} from 'react';
import {KeyboardAvoidingView, View} from 'react-native';
import {Screen} from '../../components/ui/templates/Screen';
import {useAuth} from '../../state/contexts/AuthContext';
import ItemsInOrderList from '../../components/content/PrepareOrderScreen/ItemsInOrderList';
import GoToPayButton from '../../components/content/PrepareOrderScreen/GoToPayButton';
import OrderForm from '../../components/content/PrepareOrderScreen/OrderForm';
import OrderTotal from '../../components/content/PrepareOrderScreen/OrderTotal';
import {useAppDispatch} from '../../state/hooks';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {setScreen} from '../../state/reducers/lastVisitedScreenSlice';
import {useAppNavigation} from '../../navigation/types/types';

type Props = object;

const PrepareOrderScreen: React.FC<Props> = () => {
  const [total, setTotal] = useState<number>(0);
  const {user} = useAuth();
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

  return (
    <KeyboardAvoidingView behavior={'position'}>
      <Screen isFull white edges={['horizontal', 'bottom', 'top']}>
        <View className={'h-14'} />
        <ItemsInOrderList setTotal={setTotal} />
        <Screen
          isHideKeyboard
          className={'w-full mt-8 bg-white pb-[85px] flex-1 justify-end'}>
          <OrderForm />
          <OrderTotal total={total} />
          <GoToPayButton />
        </Screen>
      </Screen>
    </KeyboardAvoidingView>
  );
};

export default PrepareOrderScreen;
