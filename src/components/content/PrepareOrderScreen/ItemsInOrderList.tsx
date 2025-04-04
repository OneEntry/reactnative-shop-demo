import {useAppSelector} from '../../../state/hooks';
import {usePrepareOrderData} from '../../../hooks/content/PrepareOrderScreen/usePrepareOrderData';
import React, { Dispatch, memo, useCallback, useEffect, useMemo } from "react";
import {navigate} from '../../../navigation/utils/NavigatonRef';
import ErrorBlock from '../../shared/ErrorBlock';
import {ScrollView, View} from 'react-native';
import OrderItem from './OrderItem';
import Footer from '../../ui/space/Footer';
import useGetProductsByIds from "../../../hooks/shared/useGetProductsByIds";

/**
 * A component that displays the list of items in the cart, including the shipping product.
 * It uses the `usePrepareOrderData` hook to prepare the order data and renders the items in a scrollable view.
 *
 * @component ItemsInOrderList
 * @param {Props} props - The properties passed to the component.
 * @param {Dispatch<number>} props.setTotal - A function to set the total price of the order.
 * @returns {React.ReactElement} A scrollable view containing the list of cart items and the shipping product.
 */
const ItemsInOrderList: React.FC<Props> = ({
  setTotal,
}: Props): React.ReactElement => {
  /**
   * Retrieves the current currency from the Redux state.
   */
  const currency = useAppSelector(state => state.userStateReducer.currency);

  /**
   * Retrieves the list of items in the cart from the Redux state.
   */
  const items = useAppSelector(state => state.userStateReducer.cart);
  /**
   * Retrieves fresh list of products data.
   */
  const ids = useMemo(() => items.map(item => item.id) || [], []);
  const {products} = useGetProductsByIds({ids});

  /**
   * Prepares the order data using the `usePrepareOrderData` hook.
   */
  const {shippingProduct, error} = usePrepareOrderData();

  /**
   * Redirects to the cart screen if the cart is empty.
   */
  useEffect(() => {
    if (!items.length) {
      navigate('cart');
    }
  }, [items]);

  /**
   * Updates the total price of the order.
   */
  useEffect(() => {
    if (products || shippingProduct) {
      setTotal(
        products.reduce(
          (acc, product, currentIndex) =>
            acc + product.price * items[currentIndex].quantity,
          0,
        ) + (shippingProduct?.price || 0),
      );
    }
  }, [products, shippingProduct]);

  // Render an error block if there is an error fetching the shipping product
  if (error) {
    return (
      <ErrorBlock
        errorTitle="Error"
        errorDescription="An error occurred while loading the shipping product."
      />
    );
  }

  return (
    <View className="h-64">
      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{gap: 10}}>
        {/* Render cart items */}
        {items.map((item, i) => (
          <OrderItem
            key={'order' + i}
            currency={currency}
            product={products[i]}
            initialCount={item.quantity}
          />
        ))}

        {/* Render shipping product */}
        {shippingProduct && (
          <OrderItem
            currency={currency}
            product={shippingProduct}
            initialCount={1}
            isActions={false} // Disable actions for the shipping product
          />
        )}

        {/* Footer component */}
        <Footer />
      </ScrollView>
    </View>
  );
};

/**
 * Type definition for the props of the `ItemsInOrderList` component.
 */
type Props = {
  setTotal: Dispatch<number>; // Function to set the total price of the order
};

export default memo(ItemsInOrderList);
