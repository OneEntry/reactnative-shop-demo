import React, {memo, useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, RefreshControl, View} from 'react-native';
import {FeaturedObjectItem} from '../../shared/FeaturedObjectItem';
import {Screen} from '../../ui/templates/Screen';
import {IProductsEntity} from 'oneentry/dist/products/productsInterfaces';
import ContentNotFoundBlock from '../../shared/ContentNotFoundBlock';
import {useAppDispatch} from '../../../state/hooks';
import {setCatalogOffset} from '../../../state/reducers/FilterSlice';
import Skeleton from '../../shared/Skeleton';

interface Props {
  loadingProducts: boolean;
  products: IProductsEntity[] | undefined;
  loading: boolean;
  numColumns: number;
  search: string;
  refreshing: boolean;
  limit: number | null;
  currentOffset: number;
  onRefresh: () => void;
}

const ShopProductsList: React.FC<Props> = ({
  loadingProducts,
  loading,
  products,
  numColumns,
  search,
  refreshing,
  limit,
  currentOffset,
  onRefresh,
}) => {
  const dispatch = useAppDispatch();
  const [showActivity, setShowActivity] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => setShowActivity(false), 200);
  }, [currentOffset]);

  if (loading || loadingProducts) {
    return (
      <View style={{marginTop: 30, gap: 20}}>
        <Skeleton
          height={numColumns > 1 ? 265 : 162}
          style={{borderRadius: 15}}
        />
        <Skeleton
          height={numColumns > 1 ? 265 : 162}
          style={{borderRadius: 15}}
        />
      </View>
    );
  }

  return (
    <Screen>
      <FlatList
        key={numColumns}
        data={products}
        renderItem={({item, index}) =>
          item.isVisible ? (
            <FeaturedObjectItem
              loading={loading || loadingProducts}
              product={item}
              perRow={numColumns}
            />
          ) : (
            <></>
          )
        }
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          gap: 20,
          paddingBottom: 12,
        }}
        columnWrapperStyle={
          numColumns > 1 && {
            gap: 10,
          }
        }
        numColumns={numColumns}
        ListHeaderComponent={<View className={'mt-2.5'} />}
        ListFooterComponent={
          <View className={'h-72 items-center justify-start'}>
            {showActivity && (
              <ActivityIndicator color={'black'} size={'small'} />
            )}
          </View>
        }
        ListEmptyComponent={
          <ContentNotFoundBlock loading={loading || loadingProducts} />
        }
        onEndReached={({distanceFromEnd}) => {
          if (distanceFromEnd < 0 || search) {
            return;
          }
          if (limit) {
            // Display ActivityIndicator and trigger products update when scrolled to the end
            setShowActivity(true);
            dispatch(setCatalogOffset(currentOffset + limit));
          }
        }}
      />
    </Screen>
  );
};

export default memo(ShopProductsList);
