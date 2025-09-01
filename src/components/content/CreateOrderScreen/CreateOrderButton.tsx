import React, {memo, useState} from 'react';
import {styleColors} from '../../../utils/consts';
import {Button} from '../../ui/buttons/Button';
import {defineApi} from '../../../api';
import {navigate} from '../../../navigation/utils/NavigatonRef';
import {Alert} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../state/hooks';
import {removeOrder} from '../../../state/reducers/OrderReducer';
import {IError} from 'oneentry/dist/base/utils';
import {clearCart} from '../../../state/reducers/userStateSlice';

type Props = {
  agreed: boolean;
};

/**
 * A button component that handles the creation of an order and payment session.
 * This component collects the necessary data for placing an order, sends it to the OneEntry CMS via SDK,
 * and either redirects the user to the payment page (for Stripe payments) or directly to the orders page for cash.
 *
 * @component CreateOrderButton
 * @param {Props} props - The properties passed to the component.
 * @param {boolean} props.agreed - Indicates whether the user has agreed to the terms and conditions.
 * @returns {React.ReactElement} A button that triggers the order creation process when clicked.
 */
const CreateOrderButton: React.FC<Props> = ({
  agreed,
}: Props): React.ReactElement => {
  const order = useAppSelector(state => state.orderReducer.order);
  const {apply_button_placeholder} = useAppSelector(
    state => state.systemContentReducer.content,
  );
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  console.log(order.products);

  /**
   * Creates a payment session for Stripe payments and navigates to the payment page.
   *
   * @param {number} id - The ID of the created order.
   */
  const createSession = async (id: number) => {
    if (!id) {
      return;
    }

    const {paymentUrl, id: orderId} = await defineApi.Payments.createSession(
      id,
      'session',
    );

    if (paymentUrl) {
      navigate('payment_method', {orderId, paymentUrl});
    }
  };

  /**
   * Handles the order creation process.
   * Sends the order data to the OneEntry CMS, clears the cart, updates user state, and redirects the user.
   */
  const onConfirmOrder = async () => {
    setIsLoading(true);

    try {
      if (order?.formIdentifier && order?.paymentAccountIdentifier) {
        // Transform the form data into the required format
        const editedFormData = order.formData.slice().map(data => ({
          marker: data.marker,
          type: data.type,
          value: data.value,
        }));

        // Send the order data to the OneEntry API
        const result = await defineApi.Orders.createOrder('order', {
          ...order,
          formData: editedFormData,
          formIdentifier: order.formIdentifier,
          paymentAccountIdentifier: order.paymentAccountIdentifier,
        });

        if ((result as IError).statusCode >= 400) {
          throw new Error((result as IError).message);
        }

        // Clear the cart and remove the order from Redux
        dispatch(clearCart());
        dispatch(removeOrder());

        // Handle payment redirection based on the payment method
        if (result?.paymentAccountIdentifier === 'stripe') {
          await createSession(result.id);
        } else {
          navigate('orders');
        }
      }
    } catch (e: any) {
      console.error(e);
      Alert.alert('Error confirming order', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      isLoading={isLoading}
      disabled={!agreed}
      onPress={onConfirmOrder}
      paragraphProps={{
        color: 'white',
        size: 18,
        weight: '600',
      }}
      rounded
      className={'w-full px-layout'}
      style={{
        backgroundColor:
          agreed && order?.paymentAccountIdentifier
            ? styleColors.background
            : styleColors.lightGray,
      }}>
      {apply_button_placeholder}
    </Button>
  );
};

export default memo(CreateOrderButton);
