import React from 'react';
import {View} from 'react-native';
import {IAccountsEntity} from 'oneentry/dist/payments/paymentsInterfaces';
import CreditCard from './assets/Card.svg';
import {Paragraph} from '../../ui/texts/Paragraph';
import SelectCard from '../../ui/cards/SelectCard';
import {useAppDispatch} from '../../../store/hooks';
import {addPaymentMethod} from '../../../store/reducers/orderReducer';
import Select from '../../ui/buttons/Select';

type Props = {
  account: IAccountsEntity;
  selected?: number;
  index: number;
  setSelected: (index: number | undefined) => void;
};

const PaymentMethod: React.FC<Props> = ({
  account,
  selected,
  setSelected,
  index,
}) => {
  const dispatch = useAppDispatch();

  return (
    <SelectCard
      onPress={() => {
        dispatch(
          addPaymentMethod(selected === index ? '' : account.identifier),
        );
        setSelected(selected === index ? undefined : index);
      }}
      selected={selected === index}
      className={
        'flex-row py-2.5 px-2.5 bg-transparent rounded-xs items-center justify-between'
      }>
      <View className={'flex-row items-center gap-3'}>
        <CreditCard />
        <Paragraph>{account?.localizeInfos?.title}</Paragraph>
      </View>
      <Select selected={selected === index} />
    </SelectCard>
  );
};

export default PaymentMethod;
