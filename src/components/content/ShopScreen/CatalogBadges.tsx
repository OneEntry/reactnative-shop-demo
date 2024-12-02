import {BadgeList} from '../../shared/Badges';
import {
  Dispatch,
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {IFilterParams} from 'oneentry/dist/products/productsInterfaces';
import {Screen} from '../../ui/templates/Screen';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {
  addFilter,
  removeAllFilters,
  removeFilter,
  setBadgeFilterActive,
} from '../../../store/reducers/FilterSlice';
import Skeleton from 'react-native-reanimated-skeleton';
import {useGetAttributesByMarkerQuery} from '../../../api/api/RTKApi';

type Props = {
  setSortOption: Dispatch<'low' | 'high' | undefined>;
  refreshing: boolean;
};
export const CatalogBadges = memo(({setSortOption, refreshing}: Props) => {
  const {
    data: attributes,
    isLoading,
    refetch,
  } = useGetAttributesByMarkerQuery({setMarker: 'filter_badge'});
  const {badgeFilterActive: activeBadge, search: allFilters} = useAppSelector(
    state => state.filterReducer,
  );
  const filtersLength = useAppSelector(
    state => state.filterReducer.filters.length,
  );
  const dispatch = useAppDispatch();
  const [previousFilter, setPreviousFilter] = useState<IFilterParams>();
  const allProductsButton = useAppSelector(
    state => state.systemContentReducer.content.all_products_button,
  );

  useEffect(() => {
    if (filtersLength) {
      if (activeBadge === 0) {
        dispatch(setBadgeFilterActive(undefined));
      }
    }
  }, [filtersLength]);

  useEffect(() => {
    refetch();
  }, [refreshing]);

  const filters = useMemo(() => {
    if (!attributes) {
      return [];
    }
    return attributes?.reduce(
      (arr: IFilterParams[], attribute): IFilterParams[] => {
        if (
          typeof attribute?.listTitles === 'object' &&
          attribute?.type === 'list'
        ) {
          const filter: IFilterParams = {
            // @ts-ignore
            attributeMarker: attribute?.listTitles[0]?.title || '',
            // @ts-ignore
            conditionMarker: attribute?.listTitles[0]?.value || 'exs',
            // @ts-ignore
            conditionValue: attribute?.listTitles[0]?.extended?.value || '',
          };
          arr.push(filter);
        }
        return arr;
      },
      [],
    );
  }, [attributes]);

  const tBadges = useMemo(() => {
    return attributes?.reduce((arr: TBadge[], attribute) => {
      const filter: TBadge = {
        label: attribute?.localizeInfos?.title || '',
        value: attribute?.localizeInfos?.title || '',
      };
      arr.push(filter);
      return arr;
    }, []);
  }, [attributes]);

  const tBadges0 = useMemo(() => {
    return {
      label: allProductsButton,
      value: 0,
    };
  }, [allProductsButton]);

  const onChange = (index: number) => {
    dispatch(removeFilter(previousFilter));
    setPreviousFilter(undefined);
    if (index > 0) {
      setPreviousFilter(filters[index - 1]);
      dispatch(addFilter(filters[index - 1]));
    }
    if (index === 0) {
      setSortOption(undefined);
      return dispatch(removeAllFilters());
    }
    dispatch(setBadgeFilterActive(index));
  };

  if (isLoading) {
    return (
      <Skeleton
        isLoading={isLoading}
        containerStyle={{marginTop: 20}}
        layout={[{key: 'badges', width: '100%', height: 22}]}
      />
    );
  }

  if (!filters || !tBadges) {
    return <></>;
  }

  return (
    <Screen>
      <BadgeList
        activeValue={
          activeBadge === 0 ? (allFilters?.length ? undefined : 0) : activeBadge
        }
        options={[tBadges0, ...tBadges]}
        onChange={onChange}
        filters={filters}
      />
    </Screen>
  );
});
