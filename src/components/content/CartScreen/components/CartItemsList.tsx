import React, {memo, useMemo} from 'react';
import {FlatList, View} from 'react-native';
import CartItem from './CartItem';
import {useAppSelector} from '../../../../state/hooks';
import Footer from '../../../ui/space/Footer';
import EmptyContentBlock from '../../../shared/EmptyContentBlock';
import useWebSocket from '../../../../hooks/shared/useWebSocket';
import useGetProductsByIds from '../../../../hooks/shared/useGetProductsByIds';
import {IProductsEntity} from 'oneentry/dist/products/productsInterfaces';
import {CartItemType} from '../../../../state/reducers/userStateSlice';

interface Props {
  products: IProductsEntity[];
  setProducts: (products: IProductsEntity[]) => void;
  items: CartItemType[];
}

/**
 * A React component that renders a list of cart items using a FlatList.
 * This component fetches product details from the server and displays them alongside the cart items.
 * It also handles WebSocket updates for real-time data synchronization.
 *
 * @component CartItemsList
 * @returns {React.ReactElement} A React element containing the list of cart items.
 */
const CartItemsList: React.FC<Props> = ({
  products,
  setProducts,
  items,
}): React.ReactElement => {
  useWebSocket({products, setProducts});
  const {empty_cart_plug} = useAppSelector(
    state => state.systemContentReducer.content,
  );
  const cart_item_options = useAppSelector(
    state => state.systemContentReducer.cart_item_options,
  );

  if (items?.length && !products?.length) {
    return <View className={'flex-1 animate-pulse bg-lightGray'} />;
  }

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
