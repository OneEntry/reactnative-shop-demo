import React, {memo, useEffect, useMemo, useState} from 'react';
import {IAttributes} from 'oneentry/dist/base/utils';
import Time from '../../../assets/icons/Time.svg';
import Calendar from '../../../assets/icons/Calendar.svg';
import {Keyboard, Platform} from 'react-native';
import {useAppSelector} from '../../../state/hooks';
import OrderFormInput from './OrderFormInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import TimePickerModal from './TimePickerModal';
import Toast from 'react-native-toast-message';
import Skeleton from '../../shared/Skeleton';
import DatePickerModal from './DatePickerModal';
import dayjs from 'dayjs';
import {useLazyGetFormByMarkerQuery} from '../../../api/api/RTKApi';

type Props = object;

/**
 * OrderForm component handles the rendering of an order form.
 * It dynamically generates input fields based on the form data.
 * It supports date and time pickers and provides placeholder texts.
 *
 * @param {Props} props - Component props.
 * @returns {React.ReactElement} - Rendered component.
 */
const OrderForm: React.FC<Props> = () => {
  // Select the order data from the Redux store
  const {order, selectedDate} = useAppSelector(state => state.orderReducer);

  const [requestForm, {data, isLoading, isError}] =
    useLazyGetFormByMarkerQuery();

  // Fetch form data when the order form identifier changes
  useEffect(() => {
    if (order?.formIdentifier) {
      requestForm({marker: order.formIdentifier});
    }
  }, [order]);

  const [visibleDate, setVisibleDate] = useState<boolean>(false);
  const [visibleTime, setVisibleTime] = useState<boolean>(false);

  const {order_info_date_placeholder, order_info_time_placeholder} =
    useAppSelector(state => state.systemContentReducer.content);

  // Memoize the form fields values for efficient updates
  const fieldsValues = useMemo(() => {
    const fields = order?.formData?.reduce(
      (obj: {[key: string]: any}, item) => {
        switch (item.marker) {
          case 'shipping_interval':
            obj.shipping_interval = item?.value[0][0] || undefined;
            break;
          case 'order_address':
            obj.order_address = item?.value;
            break;
        }
        return obj;
      },
      {},
    );

    return fields;
  }, [order]);

  if (isError) {
    return <></>;
  }

  if (isLoading) {
    return <Skeleton isLoading={isLoading} width={'100%'} height={200} />;
  }

  return (
    <KeyboardAwareScrollView
      bottomOffset={10}
      contentContainerStyle={{gap: 12}}>
      {data?.attributes?.map((attribute: IAttributes) => {
        if (attribute?.marker === 'shipping_interval') {
          return (
            <>
              <OrderFormInput
                key={'date' + attribute?.marker}
                Icon={Calendar}
                placeholder={order_info_date_placeholder}
                editable={Platform.OS !== 'ios'}
                value={selectedDate}
                onPressOut={() => setVisibleDate(true)}
                onPressIcon={() => setVisibleDate(true)}
                field={attribute}
              />
              <OrderFormInput
                key={'time' + attribute?.marker}
                Icon={Time}
                placeholder={order_info_time_placeholder}
                editable={Platform.OS !== 'ios'}
                value={
                  fieldsValues?.shipping_interval
                    ? dayjs(fieldsValues?.shipping_interval).format('HH:mm')
                    : ''
                }
                onPressOut={() => {
                  if (selectedDate) {
                    setVisibleTime(true);
                    Keyboard.dismiss();
                  } else {
                    console.log(attribute?.additionalFields);
                    Toast.show({
                      type: 'info',
                      // @ts-ignore
                      text1: attribute?.additionalFields?.[0]?.value,
                    });
                  }
                }}
                onPressIcon={() => setVisibleTime(true)}
                field={attribute}
              />
            </>
          );
        }

        if (attribute?.marker === 'order_address') {
          return (
            <OrderFormInput
              placeholder={
                attribute?.additionalFields?.find(
                  el => el.marker === 'placeholder',
                )?.value
              }
              key={attribute?.marker}
              field={{...attribute}}
              value={fieldsValues?.order_address}
            />
          );
        }
      })}

      <DatePickerModal visible={visibleDate} setVisible={setVisibleDate} />
      <TimePickerModal visible={visibleTime} setVisible={setVisibleTime} />
    </KeyboardAwareScrollView>
  );
};

export default memo(OrderForm);
