import React, {useContext, useState} from 'react';
import {KeyboardAvoidingView} from 'react-native';
import {Screen} from '../../components/ui/templates/Screen';
import {proportionY} from '../../utils/consts';
import TopSpacerV2 from '../../components/ui/space/TopSpacerV2';
import {AuthContext} from '../../providers/AuthContext';
import UnauthorizedBlock from '../../components/shared/UnauthorizedBlock';
import {ItemsInOrderList, ShipInfo} from '../../components/content/OrderScreen';

interface Props {}

const OrderScreen: React.FC<Props> = ({}) => {
  const [total, setTotal] = useState<number>(0);
  const {errorPage, user} = useContext(AuthContext);

  if (errorPage && !user) {
    return <UnauthorizedBlock page={errorPage} />;
  }

  return (
    <KeyboardAvoidingView behavior={'position'}>
      <Screen isFull white edges={['horizontal']}>
        <TopSpacerV2 height={75 * proportionY} />
        <ItemsInOrderList setTotal={setTotal} />
        {/* List of items in the order */}
        <ShipInfo total={total} />
        {/* Shipping information, total amount and logic */}
      </Screen>
    </KeyboardAvoidingView>
  );
};

export default OrderScreen;
