import React from 'react';
import {ScrollView, View} from 'react-native';
import {Paragraph} from '../../ui/texts/Paragraph';
import {RouteProp, useRoute} from '@react-navigation/native';
import {useAppSelector} from '../../../state/hooks';
import {DrawerStackNavigatorParamList} from '../../../navigation';
import {Button} from '../../ui/buttons/Button';
import Footer from '../../ui/space/Footer';
import CustomImage from '../../ui/templates/CustomImage';
import {defineApi} from '../../../api';
import {IOrderByMarkerEntity} from 'oneentry/dist/orders/ordersInterfaces';
import {navigate} from '../../../navigation/utils/NavigatonRef';
import {IError} from 'oneentry/dist/base/utils';
import {isError} from '../../../api/api/RTKApi';

type Props = {
  orderProps?: IOrderByMarkerEntity;
};

/**
 * CreatedOrdersDetails component displays the details of a created order.
 *
 * @param {Props} props - Component props.
 * @returns {React.ReactElement} - Rendered component.
 */
const CreatedOrdersDetails: React.FC<Props> = ({orderProps}) => {
  const {
    params: {order: orderParams},
  } = useRoute<RouteProp<DrawerStackNavigatorParamList, 'order_details'>>();
  const order = orderProps || orderParams;

  const {
    order_info_amount,
    order_info_status,
    order_info_quantity,
    order_info_total,
    go_to_pay_placeholder,
    order_info_address_placeholder,
  } = useAppSelector(state => state.systemContentReducer.content);

  /**
   * Handles the payment process.
   * Updates the order to use 'stripe' as the payment account if necessary,
   * creates a payment session, and navigates to the payment method screen.
   */
  const goToPay = async () => {
    try {
      // If the payment account is not 'stripe', update the order with 'stripe' as the payment account
      if (order.paymentAccountIdentifier !== 'stripe') {
        const products = order.products.map(product => {
          return {
            productId: product.id,
            quantity: product.quantity || 1,
          };
        });

        const result = await defineApi.Orders.updateOrderByMarkerAndId(
          'order',
          order.id,
          {
            paymentAccountIdentifier: 'stripe',
            formIdentifier: order.formIdentifier,
            formData: order.formData,
            products,
          },
        );

        if (isError(result)) {
          throw new Error(result?.message);
        }
      }

      // Create a payment session and navigate to the payment method screen
      const {paymentUrl, id: orderId} = await defineApi.Payments.createSession(
        order.id,
        'session',
      );

      if (paymentUrl) {
        navigate('payment_method', {orderId, paymentUrl});
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!order) {
    return <></>;
  }

  return (
    <View className={'flex-1'}>
      <View>
        <Paragraph size={16} color={'gray'}>
          #{order.id}
        </Paragraph>
      </View>
      <ScrollView contentContainerStyle={{gap: 15}}>
        <View className={'border-b-gray pb-4'} style={{borderBottomWidth: 1}} />
        {order?.products?.map((product, index) => (
          <View key={'product_' + product.id.toString() + index}>
            <View
              className={'flex-row gap-4 border-b-gray pb-4'}
              style={{borderBottomWidth: 1}}>
              <View className={'p-2.5 rounded-xs bg-lightGray'}>
                <CustomImage
                  uri={product?.previewImage?.[0]?.downloadLink}
                  height={110}
                  width={90}
                />
              </View>
              <View className={'pt-2.5 gap-2.5'}>
                <Paragraph size={14} color={'gray'}>
                  {product?.title}
                </Paragraph>
                <Paragraph size={14} color={'gray'}>
                  {product?.price} {order.currency}
                </Paragraph>
                <Paragraph size={14} color={'gray'}>
                  <Paragraph weight={'700'} size={14} color={'gray'}>
                    {order_info_quantity}:{' '}
                  </Paragraph>{' '}
                  {product?.quantity}
                </Paragraph>
                <Paragraph size={14} color={'gray'}>
                  <Paragraph weight={'700'} size={14} color={'gray'}>
                    {order_info_amount}:{' '}
                  </Paragraph>{' '}
                  {product?.quantity &&
                    product?.price &&
                    product?.quantity * product?.price}{' '}
                  {order.currency}
                </Paragraph>
              </View>
            </View>
          </View>
        ))}
        <View
          className={'border-b-gray pb-4 gap-2.5'}
          style={{borderBottomWidth: 1}}>
          <Paragraph size={14} color={'gray'}>
            <Paragraph weight={'700'} size={14} color={'gray'}>
              {order_info_status}:
            </Paragraph>{' '}
            {order?.statusIdentifier}
          </Paragraph>
          <Paragraph size={14} color={'gray'}>
            <Paragraph weight={'700'} size={14} color={'gray'}>
              {order_info_total}:{' '}
            </Paragraph>{' '}
            {order?.totalSum} {order?.currency}
          </Paragraph>
          <Paragraph size={14} color={'gray'}>
            <Paragraph weight={'700'} size={14} color={'gray'}>
              {order_info_address_placeholder}:{' '}
            </Paragraph>{' '}
            {order?.formData?.find(value => value.marker === 'order_address')
              ?.value || '-'}
          </Paragraph>
        </View>
        <Footer />
      </ScrollView>
      {order?.statusIdentifier === 'created' && (
        <Button
          onPress={goToPay}
          paragraphProps={{
            color: 'white',
            size: 18,
            weight: '600',
          }}
          rounded
          className={'w-full absolute bottom-menu bg-accent px-layout'}>
          {go_to_pay_placeholder}
        </Button>
      )}
    </View>
  );
};

export default CreatedOrdersDetails;
