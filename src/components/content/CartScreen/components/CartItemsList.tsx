import React, {memo, useEffect} from 'react';
import {FlatList} from 'react-native';
import CartItem from './CartItem';
import {useAppDispatch, useAppSelector} from '../../../../store/hooks';
import Footer from '../../../ui/space/Footer';
import EmptyContentBlock from '../../../shared/EmptyContentBlock';
import {useGetProductsByIds} from '../hooks/useGetProductsByIds';
import {api} from '../../../../api';
import {IProductsEntity} from 'oneentry/dist/products/productsInterfaces';
import {
  addCartTotal,
  selectCartItems,
} from '../../../../store/reducers/CartSlice';

interface Props {}

const CartItemsList: React.FC<Props> = ({}) => {
  const items = useAppSelector(selectCartItems);
  const {products, setProducts} = useGetProductsByIds({items});
  const {empty_cart_plug} = useAppSelector(
    state => state.systemContentReducer.content,
  );
  const cart_item_options = useAppSelector(
    state => state.systemContentReducer.cart_item_options,
  );
  const dispatch = useAppDispatch();

  //Effect for Websocket
  useEffect(() => {
    if (products) {
      const ws = api.WS.connect();
      if (ws) {
        ws.on('notification', async res => {
          if (res?.product) {
            const product = {
              ...res.product,
              attributeValues: res.product?.attributes,
            };

            const index = products.findIndex(
              (p: IProductsEntity) => p.id === product.id,
            );
            const newPrice = parseInt(
              product?.attributeValues?.price?.value,
              10,
            );

            setProducts(prevProducts => {
              const newProducts = [...prevProducts];
              newProducts[index] = {
                ...products[index],
                price: newPrice,
                statusIdentifier: res?.product?.status?.identifier,
              };
              return newProducts;
            });
          }
        });

        return () => {
          ws.disconnect();
        };
      }
    }
  }, [products]);

  //Effect for Cart Total
  useEffect(() => {
    if (products) {
      dispatch(
        addCartTotal(products.reduce((acc, product) => acc + product.price, 0)),
      );
    }
  }, [products]);

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
