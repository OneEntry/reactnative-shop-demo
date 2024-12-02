import React from 'react';
import {Screen} from '../../components/ui/templates/Screen';
import TopSpacerV2 from '../../components/ui/space/TopSpacerV2';
import { PaymentActions, PaymentMethodsList } from "../../components/content/PaymentSelectionScreen";

type Props = {};

const PaymentSelectionScreen: React.FC<Props> = ({}) => {
  return (
    <Screen isFull white edges={['horizontal', 'bottom']}>
      <TopSpacerV2 height={50} />
      <PaymentMethodsList />
      <PaymentActions />
    </Screen>
  );
};

export default PaymentSelectionScreen;
