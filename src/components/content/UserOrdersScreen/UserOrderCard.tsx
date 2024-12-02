import React, {memo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Paragraph} from '../../ui/texts/Paragraph';
import {StyleColors} from '../../../utils/consts';
import {navigate} from '../../../navigation/utils/NavigatonRef';
import ContextMenu from 'react-native-context-menu-view';
import CreatedOrdersDetails from '../OrderDetailsScreen/CreatedOrdersDetails';
import {IOrderByMarkerEntity} from 'oneentry/dist/orders/ordersInterfaces';

interface Props {
  order: IOrderByMarkerEntity;
  action?: () => void;
}

const status: Record<string, StyleColors> = {
  created: 'gray',
  canceled: 'lightGray',
  finished: 'facebook',
  paid: 'accent',
};

const UserOrderCard: React.FC<Props> = ({order}) => {
  return (
    <ContextMenu
      actions={[
        {
          title: 'View More',
        },
      ]}
      onPress={() => navigate('order_details', {order})}
      preview={
        <View className={'p-10'}>
          <CreatedOrdersDetails orderProps={order} />
        </View>
      }>
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
    </ContextMenu>
  );
};

export default memo(UserOrderCard);
