import React, {useEffect} from 'react';
import {Screen} from '../../components/ui/templates/Screen';
import {SignUpButton, SignUpForm} from '../../components/auth/SignUpScreen';

type Props = object;

const SignUpScreen: React.FC<Props> = () => {
  useEffect(() => {}, []);
  return (
    <Screen isHideKeyboard isFull edges={['horizontal']}>
      <SignUpForm />
      <SignUpButton />
    </Screen>
  );
};

export default SignUpScreen;
