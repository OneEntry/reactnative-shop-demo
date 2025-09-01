import React, {useEffect, useState} from 'react';
import {FlatList, RefreshControl} from 'react-native';
import TopSpacerV2 from '../../ui/space/TopSpacerV2';
import {Screen} from '../../ui/templates/Screen';
import {useGetUserOrdersQuery} from '../../../api/api/RTKApi';
import FlexLoader from '../../ui/space/FlexLoader';
import Footer from '../../ui/space/Footer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import UserOrderCard from './UserOrderCard';
import useOrderSocket from './useOrderSocket';

type Props = object;

const UserOrdersList: React.FC<Props> = () => {
  const {data, isLoading, refetch} = useGetUserOrdersQuery({marker: 'order'});
  const [refreshing, setRefreshing] = useState(false);
  const {top} = useSafeAreaInsets();
  const products = data?.items || [];

  const {} = useOrderSocket({refetch});

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      refetch();
      setRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    refetch();
  }, []);

  if (isLoading || !data) {
    return <FlexLoader />;
  }

  return (
    <Screen isFull white edges={['horizontal', 'top']}>
      <TopSpacerV2 height={top > 10 ? 20 : 40} />
      <FlatList
        data={products}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({item}) => <UserOrderCard order={item} />}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<Footer height={210} />}
      />
    </Screen>
  );
};

export default UserOrdersList;
