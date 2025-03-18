import React, {memo, useEffect, useMemo, useState} from 'react';
import {IAttributes} from 'oneentry/dist/base/utils';
import Time from '../../../assets/icons/Time.svg';
import Calendar from '../../../assets/icons/Calendar.svg';
import {Keyboard, Platform} from 'react-native';
import {useAppSelector} from '../../../state/hooks';
import OrderFormInput from './OrderFormInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import CalendarModal from './DatePickerModal';
import TimePickerModal from './TimePickerModal';
import {useLazyGetFormByMarkerQuery} from '../../../api';
import Toast from 'react-native-toast-message';
import Skeleton from '../../shared/Skeleton';

type Props = {};

/**
 * OrderForm component handles the rendering of an order form.
 * It dynamically generates input fields based on the form data.
 * It supports date and time pickers and provides placeholder texts.
 *
 * @param {Props} props - Component props.
 * @returns {React.ReactElement} - Rendered component.
 */
const OrderForm: React.FC<Props> = ({}: Props): React.ReactElement => {
  // Select the order data from the Redux store
  const {order} = useAppSelector(state => state.orderReducer);

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
          case 'time2':
            obj.time2 = item?.value;
            break;
          case 'order_address':
            obj.order_address = item?.value;
            break;
          case 'date':
            obj.date = item?.value?.formattedValue || '';
            break;
        }
        return obj;
      },
      {},
    );

    return {
      timeValue: fields?.time2,
      dateValue: fields?.date,
      addressValue: fields?.order_address,
    };
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
        if (attribute?.marker === 'time2') {
          return (
            <OrderFormInput
              key={attribute?.marker}
              Icon={Time}
              placeholder={order_info_time_placeholder}
              editable={Platform.OS !== 'ios'}
              value={fieldsValues?.timeValue?.[0]?.title}
              onPressOut={() => {
                if (fieldsValues?.dateValue) {
                  setVisibleTime(true);
                  Keyboard.dismiss();
                } else {
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
          );
        }

        if (attribute?.marker === 'date') {
          return (
            <OrderFormInput
              key={attribute?.marker}
              Icon={Calendar}
              placeholder={order_info_date_placeholder}
              editable={Platform.OS !== 'ios'}
              value={fieldsValues.dateValue?.split(' ')[0]}
              onPressOut={() => setVisibleDate(true)}
              onPressIcon={() => setVisibleDate(true)}
              field={attribute}
            />
          );
        }

        if (attribute?.marker === 'order_address') {
          return (
            <OrderFormInput
              key={attribute?.marker}
              field={{...attribute}}
              value={fieldsValues?.addressValue}
            />
          );
        }
      })}

      <CalendarModal visible={visibleDate} setVisible={setVisibleDate} />
      <TimePickerModal visible={visibleTime} setVisible={setVisibleTime} />
    </KeyboardAwareScrollView>
  );
};

export default memo(OrderForm);
