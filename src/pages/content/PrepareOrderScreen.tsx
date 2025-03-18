import React, {useState} from 'react';
import {KeyboardAvoidingView} from 'react-native';
import {Screen} from '../../components/ui/templates/Screen';
import {proportionY} from '../../utils/consts';
import TopSpacerV2 from '../../components/ui/space/TopSpacerV2';
import {useAuth} from '../../state/contexts/AuthContext';
import UnauthorizedBlock from '../../components/shared/UnauthorizedBlock';
import ItemsInOrderList from '../../components/content/PrepareOrderScreen/ItemsInOrderList';
import GoToPayButton from '../../components/content/PrepareOrderScreen/GoToPayButton';
import OrderForm from '../../components/content/PrepareOrderScreen/OrderForm';
import OrderTotal from '../../components/content/PrepareOrderScreen/OrderTotal';

interface Props {}

const PrepareOrderScreen: React.FC<Props> = ({}) => {
  const [total, setTotal] = useState<number>(0);
  const {errorPage, user} = useAuth();

  if (errorPage && !user) {
    return <UnauthorizedBlock page={errorPage} />;
  }

  return (
    <KeyboardAvoidingView behavior={'position'}>
      <Screen isFull white edges={['horizontal', 'bottom']}>
        <TopSpacerV2 height={75 * proportionY} />
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
