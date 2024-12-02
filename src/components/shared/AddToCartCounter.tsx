import React from 'react';
import {Counter} from './Counter';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {updateUserState} from '../../api/utils/updateUserState';
import {
  addProductToCart,
  decreaseProduct,
  removeProduct,
} from '../../store/reducers/CartSlice';

type Props = {
  id: number;
  quantity: number;
  isZeroValue?: boolean;
};

const AddToCartCounter: React.FC<Props> = ({id, isZeroValue, quantity}) => {
  const items = useAppSelector(state => state.cartReducer.products);
  const favorites = useAppSelector(state => state.favoritesReducer.products);
  const dispatch = useAppDispatch();

  const onEdit = async (value: number, operator: '+' | '-') => {
    if (operator === '+') {
      await updateUserState({
        favorites,
        cart: items.map(product => {
          return {
            id: product.id,
            quantity: product.id === id ? value : product.quantity,
          };
        }),
      });
      dispatch(addProductToCart({id, quantity: value}));
    } else {
      if (value === 0) {
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
      } else {
        await updateUserState({
          favorites,
          cart: items.map(product => {
            return {
              id: product.id,
              quantity: product.id === id ? value : product.quantity,
            };
          }),
        });
        dispatch(decreaseProduct(id));
      }
    }
  };

  if (!quantity) {
    return null;
  }

  return <Counter count={quantity} isZeroValue={isZeroValue} onEdit={onEdit} />;
};

export default AddToCartCounter;
