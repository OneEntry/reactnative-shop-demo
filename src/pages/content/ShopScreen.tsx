import {View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {NavigationProps} from '../../navigation/types/types';
import {Screen} from '../../components/ui/templates/Screen';
import {useGetProducts} from '../../api';
import TopSpacerV2 from '../../components/ui/space/TopSpacerV2';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {
  addMinMaxFilterPlaceholders,
  setCatalogOffset,
} from '../../store/reducers/FilterSlice';
import {
  CatalogBadges,
  ShopProductsList,
  SortFilterMenu,
  useGetShopBlocks,
} from '../../components/content/ShopScreen';
import ContentNotFoundBlock from '../../components/shared/ContentNotFoundBlock';
import {useFocusEffect} from '@react-navigation/native';
import {useGetConfigQuery} from '../../api/api/RTKApi';

export const ShopScreen: React.FC<NavigationProps> = ({route}) => {
  const [sortOption, setSortOption] = useState<'low' | 'high' | undefined>();
  const {
    catalogOffset: currentOffset,
    search,
    availability,
  } = useAppSelector(state => state.filterReducer);
  const dispatch = useAppDispatch();
  const [disableLoading, setDisableLoading] = useState(false);

  const {
    data,
    refetch: refetchConfig,
    isLoading: loadingConfig,
  } = useGetConfigQuery({
    pageUrl: route.params.pageUrl,
  });

  const limit = data?.limit || 10;
  const columns = data?.columns || 2;

  const {
    sortBlock,
    mainProductsBlock,
    isLoading: isLoadingBlocks,
  } = useGetShopBlocks({pageUrl: route.params.pageUrl});

  //Hook to get products
  const {
    products,
    loading: loadingProducts,
    refetch,
  } = useGetProducts({
    pageUrl: route.params.pageUrl,
    offset: currentOffset,
    limit,
    searchValue: search,
    disableLoading: disableLoading,
    sortOrder: sortOption ? (sortOption === 'high' ? 'DESC' : 'ASC') : 'DESC',
    sortKey: sortOption ? 'price' : 'position',
    availability,
    mainPage: mainProductsBlock?.identifier,
    isLoading: isLoadingBlocks,
  });


  const [refreshing, setRefreshing] = useState<boolean>(false);

  //add values to price filter
  useEffect(() => {
    if (products?.length && products[0]?.additional?.prices) {
      dispatch(addMinMaxFilterPlaceholders(products[0]?.additional?.prices));
    }
  }, [products]);

  //refetch products when sort option changes
  useEffect(() => {
    if (sortOption || availability) {
      dispatch(setCatalogOffset(0));
      refetch();
    }
  }, [sortOption, availability]);

  //reset offset when leaving the screen
  useFocusEffect(
    useCallback(() => {
      dispatch(setCatalogOffset(0));
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    setDisableLoading(true);
    setTimeout(() => {
      setSortOption(undefined);
      refetchConfig();
      refetch();
      setDisableLoading(false);
      setTimeout(() => {
        setRefreshing(false);
      }, 300);
    }, 1700);
  };

  if (!products.length && !limit && !loadingProducts && !loadingConfig) {
    return <ContentNotFoundBlock />;
  }

  return (
    <View className={'flex-1'}>
      <Screen className={'bg-lightGray'}>
        <TopSpacerV2 />
        <SortFilterMenu
          sortOption={sortOption}
          setSortOption={setSortOption}
          sortBlock={sortBlock}
        />
      </Screen>
      <Screen white edges={['horizontal']} className={'flex-1'}>
        <CatalogBadges refreshing={refreshing} setSortOption={setSortOption} />
        <ShopProductsList
          products={products}
          loadingProducts={loadingProducts}
          loading={loadingConfig}
          refreshing={refreshing}
          onRefresh={onRefresh}
          currentOffset={currentOffset}
          numColumns={columns >= 2 ? 2 : 1}
          limit={limit}
          search={search || ''}
        />
      </Screen>
    </View>
  );
};
