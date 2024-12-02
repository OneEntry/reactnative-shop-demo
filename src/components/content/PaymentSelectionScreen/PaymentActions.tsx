import React, {useState} from 'react';
import {View} from 'react-native';
import TermsAndConditions from './TermsAndConditions';
import ConfirmOrderButton from './ConfirmOrderButton';

type Props = {};

const PaymentActions: React.FC<Props> = ({}) => {
  //should sign agreement to proceed order
  const [agreed, setAgreed] = useState(false);

  return (
    <View
      style={{gap: 20}}
      className={
        'absolute bottom-menu w-full mx-layout items-center justify-center'
      }>
      <TermsAndConditions agreed={agreed} setAgreed={setAgreed} />
      {/* Confirm order button */}
      <ConfirmOrderButton agreed={agreed} />
    </View>
  );
};

export default PaymentActions;
