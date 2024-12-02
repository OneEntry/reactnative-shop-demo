import React, {memo, useContext} from 'react';
import {Button} from '../ui/buttons/Button';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {Alert} from 'react-native';
import Toast from 'react-native-toast-message';
import {addCurrency, addProductToCart} from '../../store/reducers/CartSlice';
import MiniButton from '../ui/buttons/MiniButton';
import {updateUserState} from '../../api/utils/updateUserState';
import {AuthContext} from '../../providers/AuthContext';

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
  const {addToCart, outOfStock} = useAppSelector(
    state => state.systemContentReducer.content.buttons,
  );
  const {user} = useContext(AuthContext);
  const items = useAppSelector(state => state.cartReducer.products);
  const favorites = useAppSelector(state => state.favoritesReducer.products);
  const dispatch = useAppDispatch();

  const onAddToCart = async () => {
    if (!id) {
      return Alert.alert('Product not found');
    }
    Toast.show({
      type: 'success',
      text1: 'Success!',
      text2: 'Product in cart',
    });

    if (user) {
      const updatedItems = items.some(product => product.id === id)
        ? items.map(product => {
            return {
              id: product.id,
              quantity:
                product.id === id ? product.quantity + 1 : product.quantity,
            };
          })
        : [...items, {id, quantity: 1}];

      await updateUserState({
        favorites,
        cart: updatedItems,
      });
    }

    dispatch(addProductToCart({id: id, quantity: 1}));

    if (currency) {
      dispatch(addCurrency(currency));
    }
  };

  if (size === 'small') {
    return (
      <MiniButton
        className={'my-2.5'}
        title={inStock ? addToCart : outOfStock}
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
      {inStock ? addToCart : outOfStock}
    </Button>
  );
};

export default memo(AddToCartButton);
