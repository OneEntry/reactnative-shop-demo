import React from 'react';
import {Screen} from '../../components/ui/templates/Screen';
import {OTPInput, OTPKeyboard} from '../../components/auth/OTPScreen';

type Props = {};

const OTPScreen: React.FC<Props> = ({}) => {
  const [value, setValue] = React.useState('');

  return (
    <Screen isHideKeyboard isFull edges={['horizontal', 'top', 'bottom']}>
      <OTPInput setValue={setValue} value={value} />
      <OTPKeyboard value={value} setValue={setValue} />
    </Screen>
  );
};

export default OTPScreen;
