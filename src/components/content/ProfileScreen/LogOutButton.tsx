import React, {memo} from 'react';
import {styleColors} from '../../../utils/consts';
import {Button} from '../../ui/buttons/Button';
import {ViewStyle} from 'react-native';
import {useAuth} from '../../../state/contexts/AuthContext';
import {useAppSelector} from '../../../state/hooks';

type Props = {
  provider?: string;
  style?: ViewStyle;
};

const LogOutButton: React.FC<Props> = ({provider, style}) => {
  const {logOutUser} = useAuth();
  const logOutText = useAppSelector(
    state => state.systemContentReducer.content.log_out_button,
  );

  if (!provider) {
    return <></>;
  }

  return (
    <Button
      rounded
      style={style}
      paragraphProps={{
        style: {color: styleColors.white},
        weight: 'bold',
        size: 16,
      }}
      onPress={logOutUser}>
      {logOutText}
    </Button>
  );
};

export default memo(LogOutButton);
