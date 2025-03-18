import React, {useEffect, useState} from 'react';
import {useAppSelector} from '../../../state/hooks';
import {selectAllFilters} from '../../../state/reducers/FilterSlice';
import {IProductsEntity} from 'oneentry/dist/products/productsInterfaces';
import {useGetProductsQuery} from '../../../api/api/RTKApi';

type Props = {
  pageUrl?: string;
  limit?: number;
  offset: number;
  search?: string;
  sortOption: 'low' | 'high' | undefined;
  availability?: boolean;
};

const useGetProducts = ({
  pageUrl,
  limit,
  offset,
  search,
  sortOption,
  availability,
}: Props) => {
  const [products, setProducts] = useState<IProductsEntity[]>([]);
  const [shouldShowLoader, setShouldShowLoader] = useState<boolean>(true);
  const filters = useAppSelector(selectAllFilters);

  const {data, ...other} = useGetProductsQuery({
    pageUrl,
    offset,
    limit,
    search,
    sortOrder: sortOption ? (sortOption === 'high' ? 'DESC' : 'ASC') : 'ASC',
    sortKey: sortOption ? 'price' : 'date',
    available: availability,
    filters,
  });

  useEffect(() => {
    if (!data || !data?.length) return;
    setProducts((prevState: IProductsEntity[]): IProductsEntity[] => {
      if (offset > 0) {
        return [...prevState, ...(data || [])];
      } else {
        return data || [];
      }
    });
    setShouldShowLoader(false);
  }, [data]);

  // useEffect(() => {
  //   setShouldShowLoader(true);
  // }, [filters]);

  return {products, shouldShowLoader, ...other};
};

export default useGetProducts;
