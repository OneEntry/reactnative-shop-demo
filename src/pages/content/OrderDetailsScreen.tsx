import React from 'react';
import {Screen} from '../../components/ui/templates/Screen';
import TopSpacerV2 from '../../components/ui/space/TopSpacerV2';
import {CreatedOrdersDetails} from '../../components/content/OrderDetailsScreen';

type Props = {};

const OrderDetailsScreen: React.FC<Props> = ({}) => {
  return (
    <Screen isFull edges={['horizontal']}>
      <TopSpacerV2 height={60} />
      <CreatedOrdersDetails />
    </Screen>
  );
};

export default OrderDetailsScreen;
