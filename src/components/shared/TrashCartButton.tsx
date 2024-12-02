import React from 'react';
import Trash from '../../assets/icons/trash.svg';
import {TouchableOpacity} from 'react-native';
import {removeProduct} from '../../store/reducers/CartSlice';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {updateUserState} from '../../api/utils/updateUserState';

type Props = {
  id: number;
};

const TrashCartButton: React.FC<Props> = ({id}) => {
  const items = useAppSelector(state => state.cartReducer.products);
  const favorites = useAppSelector(state => state.favoritesReducer.products);

  const dispatch = useAppDispatch();
  const onTrash = async () => {
    await updateUserState({
      favorites,
      cart: items
        .filter(product => product.id !== id)
        .map(product => {
          return {
            id: product.id,
            quantity: product.quantity,
          };
        }),
    });
    dispatch(removeProduct(id));
  };
  return (
    <TouchableOpacity onPress={onTrash}>
      <Trash />
    </TouchableOpacity>
  );
};

export default TrashCartButton;
