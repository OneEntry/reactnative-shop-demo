import React from 'react';
import {Screen} from '../../components/ui/templates/Screen';
import {
  AuthMethodsList,
  PolicyLink,
  WelcomeHeader,
} from '../../components/auth/WelcomeScreen';

type Props = object;

const WelcomeScreen: React.FC<Props> = () => {
  return (
    <Screen isFlex edges={['horizontal', 'bottom']}>
      <WelcomeHeader />
      <AuthMethodsList />
      <PolicyLink />
    </Screen>
  );
};

export default WelcomeScreen;
