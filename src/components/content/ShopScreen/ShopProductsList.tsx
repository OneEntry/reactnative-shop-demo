import React, {memo, useEffect} from 'react';
import {ActivityIndicator, RefreshControl, View} from 'react-native';
import {FeaturedObjectItem} from '../../shared/FeaturedObjectItem';
import {IProductsEntity} from 'oneentry/dist/products/productsInterfaces';
import ContentNotFoundBlock from '../../shared/ContentNotFoundBlock';
import useGetProducts from '../../../hooks/content/ShopScreen/useGetProducts';
import {FlashList} from '@shopify/flash-list';
import {useAppDispatch, useAppSelector} from '../../../state/hooks';
import {addMinMaxFilterPlaceholders} from '../../../state/reducers/FilterSlice';
import {addCartCurrency} from '../../../state/reducers/userStateSlice';
import CatalogLoadingComponent from './CatalogLoadingComponent';

interface Props {
  pageUrl?: string;
  sortOption: 'low' | 'high' | undefined;
}

const ShopProductsList: React.FC<Props> = ({pageUrl, sortOption}) => {
  const {search, availability} = useAppSelector(state => state.filterReducer);
  const dispatch = useAppDispatch();

  // Fetch products based on the current page, filters and sort option
  const {
    products,
    isFetchingNextPage,
    onEndReached,
    isLoading,
    isRefetching,
    refetch,
    columns,
  } = useGetProducts({
    pageUrl,
    search,
    availability,
    sortOption,
  });

  // Add minimum and maximum price filter placeholders and currency to the Redux store
  useEffect(() => {
    if (products?.length && products[0]?.additional?.prices) {
      dispatch(addMinMaxFilterPlaceholders(products[0]?.additional?.prices));

      const currency = products[0]?.attributeValues?.currency?.value;
      currency && dispatch(addCartCurrency(currency));
    }
  }, [products]);

  console.log(products?.map(product => product.id));

  if (isLoading) {
    return <CatalogLoadingComponent columns={columns} />;
  }

  return (
    <FlashList<IProductsEntity>
      key={columns}
      data={products || []}
      renderItem={({item, index}) => (
        <View
          style={{
            flex: 1,
            marginLeft: columns > 1 && index % 2 === 0 ? 0 : 5,
            marginRight: columns > 1 && index % 2 === 1 ? 0 : 5,
          }}>
          <FeaturedObjectItem product={item} perRow={columns || 2} />
        </View>
      )}
      keyExtractor={item => item.id.toString()}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
      contentContainerStyle={{
        paddingBottom: 12,
        paddingHorizontal: columns > 1 ? 5 : 0,
      }}
      ItemSeparatorComponent={() => <View style={{height: 10}} />}
      numColumns={columns}
      estimatedItemSize={columns > 1 ? 265 : 162}
      ListHeaderComponent={<View style={{marginTop: 10}} />}
      ListFooterComponent={
        <View className={'h-72 items-center justify-start'}>
          {isFetchingNextPage && (
            <ActivityIndicator color={'black'} size={'small'} />
          )}
        </View>
      }
      ListEmptyComponent={<ContentNotFoundBlock loading={isLoading} />}
      onEndReachedThreshold={0.4}
      onEndReached={onEndReached}
    />
  );
};

export default memo(ShopProductsList);
