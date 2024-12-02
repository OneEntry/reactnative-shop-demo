import React, {memo} from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import {FeaturedObjectItem} from '../../shared/FeaturedObjectItem';
import {Screen} from '../../ui/templates/Screen';
import {IProductsEntity} from 'oneentry/dist/products/productsInterfaces';
import ContentNotFoundBlock from '../../shared/ContentNotFoundBlock';
import {useAppDispatch} from '../../../store/hooks';
import {setCatalogOffset} from '../../../store/reducers/FilterSlice';

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
        ListFooterComponent={<View className={'pb-72'} />}
        ListEmptyComponent={<ContentNotFoundBlock loading={loading} />}
        onEndReached={({distanceFromEnd}) => {
          if (distanceFromEnd < 0 || search) {
            return;
          }
          if (limit) {
            dispatch(setCatalogOffset(currentOffset + limit));
          }
        }}
      />
    </Screen>
  );
};

export default memo(ShopProductsList);
