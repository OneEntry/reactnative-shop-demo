import {useEffect, useState} from 'react';
import {api} from '../../../../api';
import {IProductsEntity} from 'oneentry/dist/products/productsInterfaces';

type Props = {
  ids: number[];
};

const UseGetProductsByIds = ({ids}: Props) => {
  const [products, setProducts] = useState<IProductsEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const getProductsByIds = async () => {
    setLoading(true);
    try {
      const res = await Promise.all(
        ids.map(async id => {
          const item = await api.Products.getProductById(id);
          return item?.id ? item : undefined;
        }),
      );
      if (!res || res[0]?.statusCode >= 400) {
        throw new Error('Error');
      }
      const productsList = res.filter(element => {
        return element !== undefined;
      });

      setProducts(productsList as IProductsEntity[]);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };
  useEffect(() => {
    getProductsByIds();
  }, [ids]);
  return {
    products,
    setProducts,
    loading,
  };
};

export default UseGetProductsByIds;
