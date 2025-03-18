import {View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {NavigationProps} from '../../navigation/types/types';
import {Screen} from '../../components/ui/templates/Screen';
import TopSpacerV2 from '../../components/ui/space/TopSpacerV2';
import {useAppDispatch, useAppSelector} from '../../state/hooks';
import {
  addMinMaxFilterPlaceholders,
  setCatalogOffset,
} from '../../state/reducers/FilterSlice';
import {
  CatalogBadges,
  ShopProductsList,
  SortFilterMenu,
  useGetShopBlocks,
} from '../../components/content/ShopScreen';
import ContentNotFoundBlock from '../../components/shared/ContentNotFoundBlock';
import {useFocusEffect} from '@react-navigation/native';
import {useGetConfigQuery} from '../../api/api/RTKApi';
import useGetProducts from '../../hooks/content/ShopScreen/useGetProducts';
import {addCartCurrency} from '../../state/reducers/userStateSlice';

/**
 * ShopScreen component represents the main shopping screen.
 * It fetches product configurations and products, handles sorting, filtering, and refreshing.
 *
 * @param {NavigationProps} props - Component props.
 * @returns {React.ReactElement} - Rendered component.
 */
export const ShopScreen: React.FC<NavigationProps> = ({route}) => {
  const [sortOption, setSortOption] = useState<'low' | 'high' | undefined>();

  // Select filters from the Redux store
  const {
    catalogOffset: currentOffset,
    search,
    availability,
  } = useAppSelector(state => state.filterReducer);

  const dispatch = useAppDispatch();
  const pageUrl = route.params.pageUrl;

  // Fetch configuration data for the active catalog
  const {
    data,
    refetch: refetchConfig,
    isLoading: loadingConfig,
  } = useGetConfigQuery({
    pageUrl,
  });

  const limit = data?.limit || 10;
  const columns = data?.columns || 2;

  // Fetch shop blocks (e.g., sort block)
  const {sortBlock} = useGetShopBlocks({pageUrl});

  // Fetch products based on the current page, filters and sort option
  const {
    products,
    shouldShowLoader,
    refetch,
    isFetching: loadingProducts,
  } = useGetProducts({
    pageUrl,
    offset: currentOffset,
    limit,
    search,
    availability,
    sortOption,
  });

  // State for managing refresh status
  const [refreshing, setRefreshing] = useState<boolean>(false);

  /**
   * Adds minimum and maximum price filter placeholders to the Redux store.
   */
  useEffect(() => {
    if (products?.length && products[0]?.additional?.prices) {
      dispatch(addMinMaxFilterPlaceholders(products[0]?.additional?.prices));
    }
  }, [products]);

  /**
   * Resets the catalog offset and refetches products when the sort option or availability changes.
   */
  useEffect(() => {
    if (sortOption || availability) {
      dispatch(setCatalogOffset(0));
      refetch();
    }
  }, [sortOption, availability]);

  /**
   * Resets the catalog offset when the screen loses focus (e.g., navigating away).
   */
  useFocusEffect(
    useCallback(() => {
      dispatch(setCatalogOffset(0));
    }, []),
  );

  /**
   * Handles the refresh process.
   */
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setSortOption(undefined);
      refetchConfig();
      refetch();
      setTimeout(() => {
        setRefreshing(false);
      }, 300);
    }, 1700);
  };

  /**
   * Adds the currency of the first product to the Redux state store when products are fetched.
   */
  useEffect(() => {
    if (products?.length) {
      const currency = products[0]?.attributeValues?.currency?.value;
      currency && dispatch(addCartCurrency(currency));
    }
  }, [products]);

  if (
    !products?.length &&
    !limit &&
    !loadingProducts &&
    !loadingConfig &&
    !shouldShowLoader
  ) {
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
          loadingProducts={currentOffset > 0 ? false : loadingProducts}
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
