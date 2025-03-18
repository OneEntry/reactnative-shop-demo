import React, {useState} from 'react';
import {View} from 'react-native';
import TermsAndConditions from './TermsAndConditions';
import ConfirmOrderButton from './CreateOrderButton';

type Props = {};

const PaymentActions: React.FC<Props> = ({}) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <View
      style={{gap: 20}}
      className={
        'w-full items-center justify-center'
      }>
      <TermsAndConditions agreed={agreed} setAgreed={setAgreed} />
      <ConfirmOrderButton agreed={agreed} />
    </View>
  );
};

export default PaymentActions;
