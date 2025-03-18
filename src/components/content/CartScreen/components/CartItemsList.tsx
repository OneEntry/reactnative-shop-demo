import React, { memo, useMemo } from "react";
import {FlatList} from 'react-native';
import CartItem from './CartItem';
import {useAppSelector} from '../../../../state/hooks';
import Footer from '../../../ui/space/Footer';
import EmptyContentBlock from '../../../shared/EmptyContentBlock';
import useWebSocket from '../../../../hooks/shared/useWebSocket';
import useGetProductsByIds from '../../../../hooks/shared/useGetProductsByIds';
import { it } from "@jest/globals";

interface Props {}

/**
 * A React component that renders a list of cart items using a FlatList.
 * This component fetches product details from the server and displays them alongside the cart items.
 * It also handles WebSocket updates for real-time data synchronization.
 *
 * @component CartItemsList
 * @returns {React.ReactElement} A React element containing the list of cart items.
 */
const CartItemsList: React.FC<Props> = ({}): React.ReactElement => {
  const items = useAppSelector(state => state.userStateReducer.cart);
  const ids = useMemo(() => items.map(item => item.id) || [], [items]);

  /**
   * Fetches product details based on the product IDs.
   */
  const {products, setProducts} = useGetProductsByIds({
    ids,
  });

  useWebSocket({products, setProducts});
  const {empty_cart_plug} = useAppSelector(
    state => state.systemContentReducer.content,
  );
  const cart_item_options = useAppSelector(
    state => state.systemContentReducer.cart_item_options,
  );

  return (
    <FlatList
      data={items}
      renderItem={({item, index}) => (
        <CartItem
          productFromCart={
            item.id === products[index]?.id ? products[index] : undefined
          }
          item={item}
          popUpButtons={cart_item_options}
        />
      )}
      ListFooterComponent={<Footer />}
      ListEmptyComponent={<EmptyContentBlock title={empty_cart_plug} />}
    />
  );
};

export default memo(CartItemsList);
