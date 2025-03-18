import React, {memo} from 'react';
import {Button} from '../ui/buttons/Button';
import {useAppDispatch, useAppSelector} from '../../state/hooks';
import {Alert} from 'react-native';
import Toast from 'react-native-toast-message';
import MiniButton from '../ui/buttons/MiniButton';
import {addToCart} from '../../state/reducers/userStateSlice';

interface Props {
  inStock: boolean;
  loading?: boolean;
  id?: number;
  currency?: string;
  size?: 'small' | 'medium' | 'large';
}

const AddToCartButton: React.FC<Props> = ({
  inStock,
  loading,
  id,
  currency,
  size = 'large',
}) => {
  const {addToCart: addToCartText, outOfStock} = useAppSelector(
    state => state.systemContentReducer.content.buttons,
  );
  const dispatch = useAppDispatch();

  const onAddToCart = async () => {
    if (!id) {
      return Alert.alert('Product not found');
    }
    dispatch(addToCart({id: id, quantity: 1}));
    Toast.show({
      type: 'success',
      text1: 'Success!',
      text2: 'Product in cart',
    });
  };

  if (size === 'small') {
    return (
      <MiniButton
        className={'my-2.5'}
        title={inStock ? addToCartText : outOfStock}
        size={9}
        onPress={onAddToCart}
        active={inStock}
      />
    );
  }

  return (
    <Button
      rounded
      className={`flex-1 ${inStock ? 'bg-accent' : 'bg-gray'}`}
      paragraphProps={{
        style: {color: '#fff'},
        weight: 'bold',
        size: 16,
      }}
      disabled={!inStock && !loading}
      onPress={onAddToCart}>
      {inStock ? addToCartText : outOfStock}
    </Button>
  );
};

export default memo(AddToCartButton);
