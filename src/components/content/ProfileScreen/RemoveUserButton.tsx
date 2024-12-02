import React, {useContext} from 'react';
import {api, logOutUser} from '../../../api';
import {AuthContext} from '../../../providers/AuthContext';
import {TouchableOpacity} from 'react-native';
import {Paragraph} from '../../ui/texts/Paragraph';
import { useAppDispatch } from "../../../store/hooks";
import { removeAllProductsFromCart } from "../../../store/reducers/CartSlice";
import { removeAllFavorites } from "../../../store/reducers/FavoritesSlice";

type Props = {};

const RemoveUserButton: React.FC<Props> = ({}) => {
  const {authenticate, user} = useContext(AuthContext);
  const dispatch = useAppDispatch();

  const removeUser = async () => {
    try {
      const form = await api.FormData.postFormsData({
        formIdentifier: 'remove_user',
        formData: [
          {
            marker: 'email',
            type: 'string',
            value: user?.identifier,
          },
        ],
      });
      const res = await logOutUser({marker: 'email'});
      if (!res.error) {
        dispatch(removeAllProductsFromCart());
        dispatch(removeAllFavorites());
        authenticate();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <TouchableOpacity onPress={removeUser} className={'w-full items-center justify-center'}>
      <Paragraph size={20} color={'red'}>Remove user</Paragraph>
    </TouchableOpacity>
  );
};

export default RemoveUserButton;
