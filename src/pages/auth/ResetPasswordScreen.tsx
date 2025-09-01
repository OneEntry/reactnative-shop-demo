import React from 'react';
import {Screen} from '../../components/ui/templates/Screen';
import {
  ResetPasswordContent,
  ResetPasswordHeader,
} from '../../components/auth/ResetPasswordScreen';

type Props = object;

const ResetPasswordScreen: React.FC<Props> = () => {
  return (
    <Screen isFull white edges={['top', 'horizontal', 'bottom']}>
      <ResetPasswordHeader />
      <ResetPasswordContent />
    </Screen>
  );
};

export default ResetPasswordScreen;
