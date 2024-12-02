import React, {memo, useEffect} from 'react';
import FavoritesItem from './FavoritesItem';
import {FlatList} from 'react-native';
import EmptyContentBlock from '../../shared/EmptyContentBlock';
import {useAppSelector} from '../../../store/hooks';
import Footer from '../../ui/space/Footer';
import useGetProductsByIds from './hooks/useGetProductsByIds';
import Skeleton from 'react-native-reanimated-skeleton';
import {api} from '../../../api';
import {IProductsEntity} from 'oneentry/dist/products/productsInterfaces';

type Props = {};

const FavoritesItemsList: React.FC<Props> = ({}) => {
  const ids = useAppSelector(state => state.favoritesReducer.products);
  const {products, loading, setProducts} = useGetProductsByIds({ids});

  const emptyFavoritesPlug = useAppSelector(
    state => state.systemContentReducer.content.empty_favorites_plug,
  );

  //WebSocket
  useEffect(() => {
    if (products) {
      const ws = api.WS.connect();
      if (ws) {
        ws.on('notification', async res => {
          if (res?.product) {
            const product = {
              ...res.product,
              attributeValues: res.product?.attributes,
            };

            const index = products.findIndex(
              (p: IProductsEntity) => p.id === product.id,
            );
            const newPrice = parseInt(
              product?.attributeValues?.price?.value,
              10,
            );

            setProducts(prevProducts => {
              const newProducts = [...prevProducts];
              newProducts[index] = {
                ...products[index],
                price: newPrice,
                statusIdentifier: res?.product?.status?.identifier,
              };
              return newProducts;
            });
          }
        });

        return () => {
          ws.disconnect();
        };
      }
    }
  }, [products]);

  if (loading) {
    return (
      <Skeleton
        containerStyle={{height: 130}}
        isLoading={loading}
        layout={[{key: 'item1', height: 130, width: '100%'}]}
      />
    );
  }

  return (
    <FlatList
      data={products}
      contentContainerStyle={{gap: 20}}
      ListEmptyComponent={<EmptyContentBlock title={emptyFavoritesPlug} />}
      ListFooterComponent={<Footer height={120} />}
      renderItem={({item}) => <FavoritesItem product={item} />}
    />
  );
};

export default memo(FavoritesItemsList);
