import React from 'react';
import {NavigationProps} from '../../navigation/types/types';
import {Screen} from '../../components/ui/templates/Screen';
import TopSpacerV2 from '../../components/ui/space/TopSpacerV2';
import {
  CartItemsList,
  PlaceOrderButton,
} from '../../components/content/CartScreen';

const CartScreen: React.FC<NavigationProps> = ({}) => {
  return (
    <Screen white isFull edges={['horizontal']} style={{gap: 20}}>
      <TopSpacerV2 height={90} />
      <PlaceOrderButton />
      <CartItemsList />
    </Screen>
  );
};

export default CartScreen;
