import {IProductsEntity} from 'oneentry/dist/products/productsInterfaces';
import {useContext, useEffect, useState} from 'react';
import {LanguageContext} from '../../providers/LanguageContext';
import {api} from '../api/api';
import {logJSON} from '../../utils/logJSON';
import {useAppSelector} from '../../store/hooks';
import {selectAllFilters} from '../../store/reducers/FilterSlice';
import {useLazyGetBlockByMarkerQuery} from '../api/RTKApi';
import {Alert} from 'react-native';

type UseGetProductsProps = {
  pageUrl?: string;
  offset: number;
  limit: number | null;
  searchValue?: string;
  disableLoading?: boolean;
  sortKey: 'id' | 'position' | 'title' | 'date' | 'price';
  sortOrder: 'DESC' | 'ASC';
  availability?: boolean;
  mainPage?: string;
  isLoading?: boolean;
};

export const useGetProducts = ({
  pageUrl,
  offset,
  limit,
  searchValue,
  sortKey,
  sortOrder,
  availability,
  disableLoading,
  mainPage,
  isLoading,
}: UseGetProductsProps) => {
  const [products, setProducts] = useState<IProductsEntity[]>([
    {isVisible: true},
    {isVisible: true},
    {isVisible: true},
    {isVisible: true},
  ]);
  const [getBlockByMarker] = useLazyGetBlockByMarkerQuery();
  const [loading, setLoading] = useState<boolean>(false);
  const {activeLanguage} = useContext(LanguageContext);
  const [refresh, setRefresh] = useState<boolean>(false);
  const filters = useAppSelector(selectAllFilters);

  const findProducts = async (): Promise<IProductsEntity[] | undefined> => {
    if (limit && pageUrl) {
      if (mainPage) {
        try {
          if (filters?.length || searchValue) {
            const res = await api.Products.getProducts(
              // @ts-ignore
              searchValue ? [{title: searchValue}, ...filters] : filters,
              activeLanguage,
              {
                sortOrder: sortOrder,
                sortKey: sortKey,
                offset,
                limit,
              },
            );
            return res.items;
          }

          const {data, error} = await getBlockByMarker({
            marker: mainPage,
            offset,
            limit,
            langCode: activeLanguage,
          });

          if (error) {
            throw new Error(error.toString());
          }

          return data?.similarProducts;
        } catch (e: any) {
          Alert.alert(e?.message || '');
        }
      } else {
        try {
          let expandedFilters = filters ? [...filters] : [];

          if (availability) {
            // @ts-ignore
            expandedFilters.push({statusMarker: 'in_stock'});
          }
          if (searchValue) {
            // @ts-ignore
            expandedFilters.push({title: searchValue});
          }
          const res = await api.Products.getProductsByPageUrl(
            pageUrl,
            expandedFilters,
            activeLanguage,
            {
              sortOrder: sortOrder,
              sortKey: sortKey,
              offset,
              limit,
            },
          );
          return res.items;
        } catch (e) {
          logJSON(e);
        }
      }
    }
  };

  useEffect(() => {
    (async () => {
      (offset < 1 || disableLoading) && setLoading(true);

      if (isLoading) {
        return;
      }

      let result = await findProducts();
      if (result) {
        result = result?.filter(res => {
          return res.isVisible;
        });
        setProducts((prevState: IProductsEntity[]): IProductsEntity[] => {
          if (offset > 0) {
            return [...prevState, ...(result as IProductsEntity[])];
          } else {
            return result as IProductsEntity[];
          }
        });
      }
      setLoading(false);
    })();
  }, [
    limit,
    activeLanguage,
    filters,
    searchValue,
    offset,
    refresh,
    mainPage,
    isLoading,
  ]);

  return {
    products,
    setProducts,
    loading,
    refetch: () => setRefresh(!refresh),
  };
};
