import React, {Dispatch, useContext, useMemo} from 'react';
import {IAttributes} from 'oneentry/dist/base/utils';
import Time from '../../../assets/icons/Time.svg';
import Calendar from '../../../assets/icons/Calendar.svg';
import {IAppOrder} from '../../../store/reducers/orderReducer';
import {Keyboard, KeyboardAvoidingView, Platform, View} from 'react-native';
import {IFormsEntity} from 'oneentry/dist/forms/formsInterfaces';
import {useAppSelector} from '../../../store/hooks';
import OrderFormInput from './OrderFormInput';
import {AuthContext} from '../../../providers/AuthContext';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';

type Props = {
  data?: IFormsEntity;
  setVisibleTime: Dispatch<boolean>;
  setVisibleDate: Dispatch<boolean>;
  order?: IAppOrder;
};

const OrderForm: React.FC<Props> = ({
  data,
  setVisibleDate,
  order,
  setVisibleTime,
}) => {
  const {order_info_date_placeholder, order_info_time_placeholder} =
    useAppSelector(state => state.systemContentReducer.content);
  const {user} = useContext(AuthContext);

  const fieldsValues = useMemo(() => {
    const timeValue = order?.formData?.find(
      item => item.marker === 'time2',
    )?.value;
    const dateValue = order?.formData?.find(item => item.marker === 'date')
      ?.value?.formattedValue;
    const address = order?.formData?.find(
      item => item.marker === 'order_address',
    )?.value;

    const addressValue =
      address === undefined
        ? user?.formData?.find(item => item.marker === 'address_reg')?.value
        : address;

    return {
      timeValue,
      dateValue,
      addressValue,
    };
  }, [order]);

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
                setVisibleTime(true);
                Keyboard.dismiss();
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
    </KeyboardAwareScrollView>
  );
};

export default OrderForm;
