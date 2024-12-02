import React, {memo, useContext} from 'react';
import {styleColors} from '../../../utils/consts';
import {logOutUser} from '../../../api';
import {Button} from '../../ui/buttons/Button';
import {ViewStyle} from 'react-native';
import {AuthContext} from '../../../providers/AuthContext';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {removeAllProductsFromCart} from '../../../store/reducers/CartSlice';
import {removeAllFavorites} from '../../../store/reducers/FavoritesSlice';

type Props = {
  provider?: string;
  style?: ViewStyle;
};

const LogOutButton: React.FC<Props> = ({provider, style}) => {
  const {authenticate} = useContext(AuthContext);
  const logOutText = useAppSelector(
    state => state.systemContentReducer.content.log_out_button,
  );
  const dispatch = useAppDispatch();

  const onLogout = async () => {
    if (!provider) {
      return;
    }
    const res = await logOutUser({marker: provider});
    if (!res.error) {
      authenticate();
      dispatch(removeAllProductsFromCart());
      dispatch(removeAllFavorites());
    }
  };

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
      onPress={onLogout}>
      {logOutText}
    </Button>
  );
};

export default memo(LogOutButton);
