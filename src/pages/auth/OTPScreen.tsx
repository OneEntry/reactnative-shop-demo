import React from 'react';
import {Screen} from '../../components/ui/templates/Screen';
import OTPButton from '../../components/auth/OTPScreen/OTPButton';
import OTPInput from '../../components/auth/OTPScreen/OTPInput';

type Props = {};

const OTPScreen: React.FC<Props> = ({}) => {
  const [value, setValue] = React.useState('');

  return (
    <Screen isHideKeyboard isFull edges={['horizontal', 'top', 'bottom']}>
      <OTPInput setValue={setValue} value={value} />
      <OTPButton value={value} setValue={setValue} />
    </Screen>
  );
};

export default OTPScreen;
