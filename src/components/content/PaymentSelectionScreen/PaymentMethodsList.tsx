import React, {useMemo, useState} from 'react';
import {FlatList} from 'react-native';
import {useGetAccountsQuery} from '../../../api';
import PaymentMethod from './PaymentMethod';
import {useAppSelector} from '../../../store/hooks';

type Props = {};

const PaymentMethodsList: React.FC<Props> = ({}) => {
  const {data} = useGetAccountsQuery({});
  const [selected, setSelected] = useState<number | undefined>();
  const paymentMethods = useAppSelector(
    state => state.orderReducer.paymentMethods,
  );

  // Filter the payment methods to only include those in the whitelist
  const whitelistMethods = useMemo(() => {
    if (data) {
      return data.filter(method => {
        const index = paymentMethods?.findIndex(
          whitelistMethod => method.identifier === whitelistMethod.identifier,
        );
        if (index !== -1) {
          return method;
        }
      });
    }

    return [];
  }, [data]);

  return (
    <FlatList
      data={whitelistMethods}
      className={'mt-2.5'}
      contentContainerStyle={{gap: 10}}
      renderItem={({item, index}) => (
        <PaymentMethod
          selected={selected}
          setSelected={setSelected}
          index={index}
          account={item}
        />
      )}
    />
  );
};

export default PaymentMethodsList;
