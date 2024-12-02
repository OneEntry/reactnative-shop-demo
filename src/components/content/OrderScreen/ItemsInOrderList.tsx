import React, {Dispatch, useEffect} from 'react';
import {ScrollView, View} from 'react-native';
import OrderItem from './OrderItem';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {
  addShippingPrice,
  selectCartItems,
} from '../../../store/reducers/CartSlice';
import {
  addPaymentMethods,
  addProducts,
  createOrder,
} from '../../../store/reducers/orderReducer';
import {useGetOrderStorageByMarkerQuery} from '../../../api';
import ErrorBlock from '../../shared/ErrorBlock';
import {navigate} from '../../../navigation/utils/NavigatonRef';
import Footer from '../../ui/space/Footer';
import {useGetProductsByIds} from '../CartScreen/hooks/useGetProductsByIds';
import {useGetProductByIdQuery} from '../../../api/api/RTKApi';

type Props = {
  setTotal: Dispatch<number>;
};

const ItemsInOrderList: React.FC<Props> = ({setTotal}) => {
  const currency = useAppSelector(state => state.cartReducer.currency);
  const items = useAppSelector(selectCartItems);
  const {products} = useGetProductsByIds({items});
  const dispatch = useAppDispatch();
  const {data, error} = useGetOrderStorageByMarkerQuery({
    marker: 'order',
  });
  const reducedItems = items.map(item => ({
    productId: item.id,
    quantity: item.quantity,
  }));
  const {data: product, error: err} = useGetProductByIdQuery({id: 83});

  // Effect to add shipping price to the order when the product data is fetched
  useEffect(() => {
    if (product) {
      if (product?.price != null) {
        dispatch(addShippingPrice(product?.price));
      }
    }
  }, [product]);

  useEffect(() => {
    if (products) {
      setTotal(
        products.reduce(
          (acc, product, currentIndex) =>
            acc + product.price * items[currentIndex].quantity,
          0,
        ) + (product?.price || 0),
      );
    }
  }, [products]);

  // Effect to create order in redux on init
  useEffect(() => {
    if (data && !error) {
      dispatch(
        createOrder({
          formIdentifier: 'order',
          formData: [],
          products: [...reducedItems, {productId: 83, quantity: 1}],
          paymentAccountIdentifier: '',
        }),
      );

      dispatch(addPaymentMethods(data.paymentAccountIdentifiers));
    }
  }, [data]);

  useEffect(() => {
    if (!items?.length) {
      navigate('cart');
    }
    dispatch(addProducts([...reducedItems, {productId: 83, quantity: 1}]));
  }, [items]);

  if (err || error) {
    return <ErrorBlock errorTitle={'Error'} errorDescription={'Error'} />;
  }

  return (
    <View className={'h-64'}>
      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        className={'flex-1'}
        contentContainerStyle={{gap: 10}}>
        {items.map((item, i) => (
          <OrderItem
            currency={currency}
            product={products[i]}
            initialCount={item.quantity}
            key={'order' + i}
          />
        ))}
        {product && (
          <OrderItem
            currency={currency}
            product={product}
            initialCount={1}
            isActions={false}
          />
        )}
        <Footer />
      </ScrollView>
    </View>
  );
};

export default ItemsInOrderList;
