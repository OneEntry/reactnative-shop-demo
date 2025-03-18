import React, {useMemo, useState} from 'react';
import {FlatList, View} from 'react-native';
import {
  useGetAccountsQuery,
  useGetOrderStorageByMarkerQuery,
} from '../../../api';
import PaymentMethod from './PaymentMethod';
import ErrorBlock from '../../shared/ErrorBlock';

/**
 * PaymentMethodsList component displays a list of payment methods.
 * It fetches payment accounts and filters them based on a whitelist.
 * It also handles loading states and errors.
 *
 * @param {Props} props - Component props.
 * @returns {React.ReactElement} - Rendered component.
 */
const PaymentMethodsList: React.FC<Props> = ({}: Props): React.ReactElement => {
  // Fetch all accounts using the custom hook
  const {
    data,
    isLoading: isLoadingAllAccounts,
    error: errorAll,
  } = useGetAccountsQuery({});

  // Fetch order storage accounts using the custom hook with a specific marker
  const {
    data: order,
    isLoading: isLoadingThisStorageAccounts,
    error: errorThis,
  } = useGetOrderStorageByMarkerQuery({
    marker: 'order',
  });

  const [selected, setSelected] = useState<number | undefined>();
  const paymentMethods = order?.paymentAccountIdentifiers;

  /**
   * Filter the payment methods to only include those in the whitelist.
   * This uses useMemo to memoize the result for performance optimization.
   */
  const whitelistMethods = useMemo(() => {
    if (data && paymentMethods) {
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
  }, [data, paymentMethods]);

  if (isLoadingAllAccounts || isLoadingThisStorageAccounts) {
    return <View className={'animate-pulse flex-1'} />;
  }

  if (errorAll || errorThis) {
    return (
      <ErrorBlock
        errorTitle={errorAll?.toString() || errorThis?.toString() || 'Error'}
      />
    );
  }

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

type Props = {};

export default PaymentMethodsList;
