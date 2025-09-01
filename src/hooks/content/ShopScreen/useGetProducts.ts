import {useEffect} from 'react';
import {useAppSelector} from '../../../state/hooks';
import {selectAllFilters} from '../../../state/reducers/FilterSlice';
import {useGetConfigQuery} from '../../../api/api/RTKApi';
import {useInfiniteQuery} from '@tanstack/react-query';
import {getProducts} from '../../../api/utils/getProducts';

type Props = {
  pageUrl?: string;
  search?: string;
  sortOption: 'low' | 'high' | undefined;
  availability?: boolean;
};

const useGetProducts = ({pageUrl, search, sortOption, availability}: Props) => {
  // Fetch configuration data for the active catalog
  const {data: configData, refetch: refetchConfig} = useGetConfigQuery({
    pageUrl,
  });

  const limit = configData?.limit || 10;
  const columns = configData?.columns || 2;

  const filters = useAppSelector(selectAllFilters);

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    data,
    isLoading,
    refetch,
    isRefetching,
    error,
    isError,
  } = useInfiniteQuery({
    queryKey: [
      'products',
      pageUrl,
      limit,
      search,
      sortOption,
      availability,
      filters,
    ],
    queryFn: ({pageParam}) =>
      getProducts({
        pageUrl,
        limit,
        search,
        sortKey: sortOption ? 'price' : 'date',
        sortOrder:
          sortOption === 'high' ? 'DESC' : sortOption === 'low' ? 'ASC' : 'ASC',
        availability,
        filters,
        pageParam,
      }),
    getNextPageParam: (lastPage, pages, lastPageParam) =>
      lastPage?.data && lastPage?.data?.length > 0
        ? lastPageParam + 1
        : undefined,
    initialPageParam: 0,
    enabled: !!pageUrl && limit > 0,
  });

  useEffect(() => {
    if (!isRefetching) {
      refetchConfig();
    }
  }, [isRefetching]);

  const onEndReached = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  return {
    products: data?.pages?.flatMap(page => page?.data),
    error: error,
    isError,
    onEndReached,
    columns: columns > 1 ? 2 : 1,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    refetch,
  };
};

export default useGetProducts;
