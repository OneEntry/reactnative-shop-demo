import {CartState} from '../../../../store/reducers/CartSlice';
import {useEffect, useState} from 'react';
import {api} from '../../../../api';
import {IError} from 'oneentry/dist/base/utils';
import {IProductsEntity} from 'oneentry/dist/products/productsInterfaces';

export const useGetProductsByIds = ({items}: {items: CartState[]}) => {
  const [products, setProducts] = useState<IProductsEntity[]>([]);
  const getProductsByIds = async (ids: number[]) => {
    return await Promise.all(
      ids.map(async (id: number) => {
        const product = await api.Products.getProductById(id);
        if (!product || (product as IError).statusCode >= 400) {
          return undefined;
        } else {
          return product as IProductsEntity;
        }
      }),
    ).then(results =>
      results.filter(
        (product): product is IProductsEntity => product !== undefined,
      ),
    );
  };
  useEffect(() => {
    if (items.length > 0) {
      getProductsByIds(items.map(item => item.id)).then(res => {
        setProducts(res);
      });
    }
  }, [items]);

  return {
    products,
    setProducts,
  };
};
