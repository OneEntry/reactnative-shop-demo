import React, {memo} from 'react';
import FavoritesItem from './FavoritesItem';
import {FlatList} from 'react-native';
import EmptyContentBlock from '../../shared/EmptyContentBlock';
import {useAppSelector} from '../../../state/hooks';
import Footer from '../../ui/space/Footer';
import useGetProductsByIds from '../../../hooks/shared/useGetProductsByIds';
import Skeleton from '../../shared/Skeleton';
import useWebSocket from '../../../hooks/shared/useWebSocket';

type Props = {};

/**
 * FavoritesItemsList component displays a list of favorite products.
 * It fetches products by their IDs, handles loading states, and displays
 * an empty content block if there are no favorites.
 * It also handles WebSocket updates for real-time data synchronization.
 *
 * @param {Props} props - Component props.
 * @returns {React.ReactElement} - Rendered component.
 */
const FavoritesItemsList: React.FC<Props> = ({}: Props): React.ReactElement => {
  const ids = useAppSelector(state => state.userStateReducer.favorites);
  const {products, loading, setProducts} = useGetProductsByIds({ids});
  useWebSocket({products, setProducts});

  const emptyFavoritesPlug = useAppSelector(
    state => state.systemContentReducer.content.empty_favorites_plug,
  );

  if (loading) {
    return <Skeleton height={130} isLoading={loading} />;
  }

  return (
    <FlatList
      data={products}
      contentContainerStyle={{gap: 20}}
      ListEmptyComponent={<EmptyContentBlock title={emptyFavoritesPlug} />}
      ListFooterComponent={<Footer height={120} />}
      renderItem={({item}) => <FavoritesItem product={item} />}
    />
  );
};

export default memo(FavoritesItemsList);
