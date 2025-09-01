import React, {useMemo} from 'react';
import {NavigationProps} from '../../navigation/types/types';
import {Screen} from '../../components/ui/templates/Screen';
import TopSpacerV2 from '../../components/ui/space/TopSpacerV2';
import {
  CartItemsList,
  PlaceOrderButton,
} from '../../components/content/CartScreen';
import useGetProductsByIds from '../../hooks/shared/useGetProductsByIds';
import {useAppSelector} from '../../state/hooks';

const CartScreen: React.FC<NavigationProps> = () => {
  const items = useAppSelector(state => state.userStateReducer.cart);
  const ids = useMemo(() => items.map(item => item.id) || [], [items]);

  /**
   * Fetches product details based on the product IDs.
   */
  const {products, setProducts} = useGetProductsByIds({
    ids,
  });
  return (
    <Screen white isFull edges={['horizontal']} style={{gap: 20}}>
      <TopSpacerV2 height={90} />
      <PlaceOrderButton products={products} />
      <CartItemsList
        products={products}
        setProducts={setProducts}
        items={items}
      />
    </Screen>
  );
};

export default CartScreen;
