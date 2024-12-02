import React, {memo} from 'react';
import {navigateAuth} from '../../navigation/utils/NavigatonRef';
import {Button} from '../ui/buttons/Button';
import {styleColors} from '../../utils/consts';

type Props = {};

const CreateAccountButton: React.FC<Props> = ({}) => {
  return (
    <Button
      className={
        'w-full border-accent border-sm py-0 items-center justify-center'
      }
      paragraphProps={{
        weight: '600',
        style: {color: styleColors.background, fontSize: 20},
      }}
      onPress={() => navigateAuth('auth_sign_up')}
      rounded>
      Create An Account
    </Button>
  );
};

export default memo(CreateAccountButton);
