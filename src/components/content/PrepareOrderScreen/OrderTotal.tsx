import React, { memo } from "react";
import {View} from 'react-native';
import {Paragraph} from '../../ui/texts/Paragraph';
import PriceString from '../../ui/texts/PriceString';
import {useAppSelector} from '../../../state/hooks';

type Props = {
  total: number;
};

const OrderTotal: React.FC<Props> = ({total}) => {
  const {order_info_total} = useAppSelector(
    state => state.systemContentReducer.content,
  );

  const {currency} = useAppSelector(state => state.orderReducer);

  return (
    <View className={'justify-end'}>
      <View className={'mb-5 flex-row justify-between items-center'}>
        <Paragraph weight={'700'} color={'gray'}>
          {order_info_total}
        </Paragraph>
        <PriceString currency={currency || '$'} price={total} size={'sm'} />
      </View>
    </View>
  );
};

export default memo(OrderTotal);
