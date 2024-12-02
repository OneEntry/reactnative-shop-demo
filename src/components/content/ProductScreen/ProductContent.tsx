import React, {Dispatch, useContext, useEffect} from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';
import {Paragraph} from '../../ui/texts/Paragraph';
import Rating from '../../shared/Rating';
import ProductStatus from './ProductStatus';
import AddToCartButton from '../../shared/AddToCartButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RouteProp, useRoute} from '@react-navigation/native';
import ErrorBlock from '../../shared/ErrorBlock';
import ProductOptions from './ProductOptions';
import Footer from '../../ui/space/Footer';
import CustomImage from '../../ui/templates/CustomImage';
import FavoritesButton from '../../shared/FavoritesButton';
import {OpenDrawerContext} from '../../../providers/OpenDrawerContext';
import {useGetProductByIdQuery} from '../../../api/api/RTKApi';
import PinnedProductsBlock from './PinnedProductsBlock';
import Units from './Units';
import OpenReviewsButton from '../../shared/OpenReviewsButton';

type Props = {
  refreshing: boolean;
  setRefreshing: Dispatch<boolean>;
};
const ProductContent: React.FC<Props> = ({refreshing, setRefreshing}) => {
  const route = useRoute<RouteProp<any, 'Products'>>();
  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductByIdQuery({
    id: route?.params?.id,
  });
  const {setActive} = useContext(OpenDrawerContext);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    setActive('');
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      refetch();
      setTimeout(() => {
        setRefreshing(false);
      }, 300);
    }, 1700);
  };

  if (error) {
    return <ErrorBlock errorTitle={error.toString()} />;
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      className={'flex-1'}
      showsVerticalScrollIndicator={false}>
      <View
        key={1}
        className={'bg-lightGray'}
        style={{
          paddingTop: insets.top > 40 ? insets.top - 15 : insets.top,
        }}>
        <CustomImage
          width={'full'}
          height={280}
          uri={product?.attributeValues?.pic?.value?.downloadLink}
        />
      </View>
      <View
        key={2}
        className={'flex-1 bg-white px-layout pt-5'}
        style={{gap: 20, paddingBottom: insets.bottom}}>
        <View style={{gap: 10}}>
          <View className={'flex-row items-center justify-between'}>
            <Paragraph className={'w-1/2'} size={20} weight="400">
              {product?.localizeInfos?.title}
            </Paragraph>
            <Units
              full={10}
              part={product?.attributeValues?.units_product?.value}
            />
          </View>
          <View className={'flex-row items-center'} style={{gap: 10}}>
            <Rating rating={3.5} />
            <OpenReviewsButton productId={product?.id} reviewsCount={120} />
          </View>
        </View>

        <ProductStatus
          price={product?.price}
          status={product?.statusIdentifier}
          currency={product?.attributeValues?.currency?.value}
          sale={product?.attributeValues?.sale?.value}
        />

        <ProductOptions mainProduct={product} />

        <Paragraph size={12} color="lightGray">
          {product?.attributeValues?.description?.value[0]?.plainValue}
        </Paragraph>

        <View className={'flex-row items-center gap-x-4'}>
          <AddToCartButton
            loading={isLoading}
            inStock={product?.statusIdentifier === 'in_stock'}
            id={product?.id}
            currency={product?.attributeValues?.currency?.value}
          />
          <View>
            {product?.id && <FavoritesButton id={product?.id} size={'xl'} />}
          </View>
        </View>

        <PinnedProductsBlock
          refreshing={refreshing}
          key={product?.id}
          productRef={product}
        />

        <Footer height={10} />
      </View>
    </ScrollView>
  );
};

export default ProductContent;
