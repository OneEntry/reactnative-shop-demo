import {useDispatch} from 'react-redux';
import {createOrder} from '../../../state/reducers/OrderReducer';
import {useGetProductByIdQuery} from '../../../api/api/RTKApi';
import {SHIPPING_PRODUCT_ID} from '@env';
import {useEffect, useMemo} from 'react';
import {useAuth} from '../../../state/contexts/AuthContext';
import {useAppSelector} from '../../../state/hooks';
import {addShippingPrice} from '../../../state/reducers/userStateSlice';

/**
 * "usePrepareOrderData" hook that prepares order data for the Redux state.
 * It fetches the shipping product, calculates the reduced items list,
 * and creates an order in Redux with the necessary details.
 *
 * @hook usePrepareOrderData
 * @returns {Object} An object containing:
 * - `reducedItems`: Array of objects representing cart items in a reduced format.
 * - `shippingProduct`: The fetched shipping product data.
 * - `error`: Any error that occurred while fetching the shipping product.
 */
export const usePrepareOrderData = () => {
  const dispatch = useDispatch();
  const items = useAppSelector(state => state.userStateReducer.cart);
  const {user} = useAuth();
  const {data: shippingProduct, error} = useGetProductByIdQuery({
    id: parseInt(SHIPPING_PRODUCT_ID),
  });

  /**
   * Memoized computation to transform cart items into a reduced format suitable for creating an order.
   *
   * @returns {Array<{ productId: number; quantity: number }>} An array of objects containing product IDs and quantities.
   */
  const reducedItems = useMemo(() => {
    return items.map(item => ({
      productId: item.id,
      quantity: item.quantity,
    }));
  }, [items]);

  /**
   * Updates the shipping price in the Redux state when the shipping product data is fetched.
   */
  useEffect(() => {
    if (shippingProduct && shippingProduct.price != null) {
      dispatch(addShippingPrice(shippingProduct.price));
    }
  }, [shippingProduct]);

  /**
   * Creates an order in Redux when the cart items are ready.
   */
  useEffect(() => {
    if (!reducedItems) return;
    const userAddress = user?.formData?.find(
      item => item.marker === 'address_reg',
    )?.value;

    dispatch(
      createOrder({
        formIdentifier: 'order',
        formData: userAddress
          ? [
              {
                marker: 'order_address',
                type: 'string',
                value: userAddress,
                valid: true,
              },
            ]
          : [],
        products: [
          ...reducedItems,
          {productId: parseInt(SHIPPING_PRODUCT_ID), quantity: 1},
        ],
        paymentAccountIdentifier: '',
      }),
    );
  }, [reducedItems]);

  return {reducedItems, shippingProduct, error};
};
