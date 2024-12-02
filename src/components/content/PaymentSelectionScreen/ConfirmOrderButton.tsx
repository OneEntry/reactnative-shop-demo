import React, {memo, useState} from 'react';
import {styleColors} from '../../../utils/consts';
import {Button} from '../../ui/buttons/Button';
import {api} from '../../../api';
import {navigate} from '../../../navigation/utils/NavigatonRef';
import {Alert} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {removeOrder} from '../../../store/reducers/orderReducer';
import {removeAllProductsFromCart} from '../../../store/reducers/CartSlice';
import {updateUserState} from '../../../api/utils/updateUserState';
import {IError} from 'oneentry/dist/base/utils';

type Props = {
  agreed: boolean;
};

const ConfirmOrderButton: React.FC<Props> = ({agreed}) => {
  const order = useAppSelector(state => state.orderReducer.order);
  const {apply_button_placeholder} = useAppSelector(
    state => state.systemContentReducer.content,
  );
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.favoritesReducer.products);

  const createSession = async (id: number) => {
    if (!id) {
      return;
    }

    const {paymentUrl, id: orderId} = await api.Payments.createSession(
      id,
      'session',
    );

    if (paymentUrl) {
      navigate('payment_method', {orderId, paymentUrl});
    }
  };

  const onConfirmOrder = async () => {
    setIsLoading(true);
    try {
      // transform the form data to the required format
      if (order?.formIdentifier && order?.paymentAccountIdentifier) {
        const editedFormData = order.formData.slice().map(data => {
          return {
            marker: data.marker,
            type: data.type,
            value: data.value,
          };
        });
        const result = await api.Orders.createOrder('order', {
          ...order,
          formData: editedFormData,
          formIdentifier: order.formIdentifier,
          paymentAccountIdentifier: order.paymentAccountIdentifier,
        });

        if ((result as IError).statusCode > 400) {
          throw new Error((result as IError).message);
        }

        dispatch(removeAllProductsFromCart());
        dispatch(removeOrder());
        await updateUserState({
          cart: [],
          favorites,
        });

        if (result?.paymentAccountIdentifier !== 'cash') {
          await createSession(result.id);
        } else {
          return navigate('orders');
        }
      }
    } catch (e: any) {
      console.error(e);
      Alert.alert(e.message);
    }
    setIsLoading(false);
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

export default memo(ConfirmOrderButton);
