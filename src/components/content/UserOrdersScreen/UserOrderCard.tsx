import React, {memo} from 'react';
import {TouchableOpacity} from 'react-native';
import {Paragraph} from '../../ui/texts/Paragraph';
import {StyleColors} from '../../../utils/consts';
import {navigate} from '../../../navigation/utils/NavigatonRef';
import {IOrderByMarkerEntity} from 'oneentry/dist/orders/ordersInterfaces';

interface Props {
  order: IOrderByMarkerEntity;
}

const status: Record<string, StyleColors> = {
  created: 'gray',
  canceled: 'lightGray',
  finished: 'facebook',
  paid: 'accent',
};

const UserOrderCard: React.FC<Props> = ({order}) => {
  return (
    <TouchableOpacity
      className={
        'flex-row justify-between items-center py-2.5 border-b-gray bg-white'
      }
      style={{borderBottomWidth: 1}}
      onPress={() => navigate('order_details', {order})}>
      <Paragraph size={16} color={status[order.statusIdentifier] || 'gray'}>
        #{order?.id}
      </Paragraph>
      <Paragraph size={16} color={status[order.statusIdentifier] || 'gray'}>
        {order.statusIdentifier}
      </Paragraph>
    </TouchableOpacity>
  );
};

export default memo(UserOrderCard);
