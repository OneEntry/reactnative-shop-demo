import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Paragraph} from '../../ui/texts/Paragraph';
import {Button} from '../../ui/buttons/Button';
import {useAppSelector} from '../../../store/hooks';
import PriceString from '../../ui/texts/PriceString';
import {useLazyGetFormByMarkerQuery} from '../../../api';
import {navigate} from '../../../navigation/utils/NavigatonRef';
import CalendarModal from './CalendarModal';
import TimePickerModal from './TimePickerModal';
import {Screen} from '../../ui/templates/Screen';
import OrderForm from './OrderForm';

interface Props {
  total: number;
}

const ShipInfo: React.FC<Props> = ({total}) => {
  const [visibleDate, setVisibleDate] = useState<boolean>(false);
  const [visibleTime, setVisibleTime] = useState<boolean>(false);
  const {go_to_pay_placeholder, order_info_total} = useAppSelector(
    state => state.systemContentReducer.content,
  );
  const {order, currency} = useAppSelector(state => state.orderReducer);
  const [requestForm, {data, isLoading, isError}] =
    useLazyGetFormByMarkerQuery();

  useEffect(() => {
    if (order?.formIdentifier) {
      requestForm({marker: order.formIdentifier});
    }
  }, [order]);

  const onSubmitOrder = async () => {
    // Check if the order has form data and validate each form field
    const canSubmit = order?.formData
      ? Object.keys(order.formData).reduce((isValid, _, currentIndex) => {
          if (!isValid) {
            return false;
          }
          const valid = order.formData[currentIndex]?.valid;
          return valid !== undefined ? valid : true;
        }, true)
      : false;

    if (order && canSubmit) {
      navigate('payment');
    }
  };

  if (isError) {
    return <></>;
  }

  return (
    <Screen isHideKeyboard className={'w-full pt-5 flex-1 bg-white pb-[85px]'}>
      <OrderForm
        setVisibleTime={setVisibleTime}
        setVisibleDate={setVisibleDate}
        data={data}
        order={order}
      />

      <View className={'flex-1 justify-end mb-28'}>
        <View className={'mb-5 flex-row justify-between items-center'}>
          <Paragraph weight={'700'} color={'gray'}>
            {order_info_total}
          </Paragraph>
          <PriceString currency={currency || '$'} price={total} size={'sm'} />
        </View>
        <Button
          rounded
          isLoading={isLoading}
          className={'bg-accent'}
          paragraphProps={{
            style: {color: '#fff'},
            weight: 'bold',
            size: 16,
          }}
          onPress={onSubmitOrder}>
          {go_to_pay_placeholder.toUpperCase()}
        </Button>
      </View>
      <CalendarModal visible={visibleDate} setVisible={setVisibleDate} />
      <TimePickerModal visible={visibleTime} setVisible={setVisibleTime} />
    </Screen>
  );
};

export default ShipInfo;
