import React from 'react';
import {Counter} from './Counter';
import {useAppDispatch} from '../../state/hooks';
import {
  addToCart,
  decreaseQuantity,
  removeFromCart,
} from '../../state/reducers/userStateSlice';

type Props = {
  id: number;
  quantity: number;
  isZeroValue?: boolean;
};

const AddToCartCounter: React.FC<Props> = ({id, isZeroValue, quantity}) => {
  const dispatch = useAppDispatch();

  const onEdit = async (value: number, operator: '+' | '-') => {
    if (operator === '+') {
      dispatch(addToCart({id}));
    } else {
      if (value === 0) {
        dispatch(removeFromCart(id));
      } else {
        dispatch(decreaseQuantity(id));
      }
    }
  };

  if (!quantity) {
    return null;
  }

  return <Counter count={quantity} isZeroValue={isZeroValue} onEdit={onEdit} />;
};

export default AddToCartCounter;
