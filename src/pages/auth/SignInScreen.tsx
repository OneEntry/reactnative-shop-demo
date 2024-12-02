import React from 'react';
import {Screen} from '../../components/ui/templates/Screen';
import {SignInForm} from '../../components/auth/SignInScreen';

type Props = {};

const SignInScreen: React.FC<Props> = ({}) => {
  return (
    <Screen isHideKeyboard isFull white edges={['horizontal']}>
      <SignInForm />
    </Screen>
  );
};

export default SignInScreen;
