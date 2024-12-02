import {Image, TouchableOpacity, View} from 'react-native';
import {Paragraph} from '../ui/texts/Paragraph';
import React, {useEffect, useState} from 'react';
import {useAppNavigation} from '../../navigation/types/types';
import {IProductsEntity} from 'oneentry/dist/products/productsInterfaces';
import {useAppSelector} from '../../store/hooks';
import {selectCartItemWithIdLength} from '../../store/reducers/CartSlice';
import PriceString from '../ui/texts/PriceString';
import {layoutWidth} from '../../utils/consts';
import CustomImage from '../ui/templates/CustomImage';
import FavoritesButton from './FavoritesButton';
import AddToCartCounter from './AddToCartCounter';
import AddToCartButton from './AddToCartButton';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

type FeaturedObjectType = {
  product: IProductsEntity;
  perRow?: number;
  loading?: boolean;
  inner?: boolean;
};

export const FeaturedObjectItem = ({
  product,
  loading,
  perRow = 2,
  inner,
}: FeaturedObjectType) => {
  const [attributes, setAttributes] = useState(product.attributeValues);
  const items = useAppSelector(state =>
    selectCartItemWithIdLength(state, product.id),
  );
  const navigation = useAppNavigation();
  // console.log(product?.statusIdentifier);

  const productCurrency = product?.attributeValues?.currency?.value;

  useEffect(() => {
    setAttributes(product.attributeValues);
  }, [product]);

  const onPressCard = () => {
    if (inner) {
      // @ts-ignore
      navigation.push('Product', {id: product?.id});
    } else {
      navigation.navigate('Products', {
        screen: 'Product',
        params: {id: product?.id},
      });
    }
  };

  return (
    <ShimmerPlaceholder
      height={perRow > 1 ? 265 : 162}
      style={{borderRadius: 15}}
      LinearGradient={LinearGradient}
      width={perRow > 1 ? (layoutWidth - 10) / 2 : layoutWidth}
      visible={!loading}
      >
      <TouchableOpacity
        style={{width: perRow > 1 ? (layoutWidth - 10) / 2 : '100%'}}
        className={
          perRow > 1
            ? 'flex-col max-w-lg bg-lightGray rounded-md items-center justify-evenly'
            : 'flex-row w-full flex-1 h-[162px] bg-lightGray rounded-md'
        }
        onPress={onPressCard}>
        <View className={`items-center ${perRow <= 1 ? 'ml-2.5' : 'mt-2.5'}`}>
          <View
            className={
              'justify-between flex-row items-center absolute w-full px-2.5 z-10'
            }>
            <View className={'w-[26px] h-[26px]'}>
              <Image
                source={{
                  uri: attributes?.stickers?.value[0]?.extended?.value
                    ?.downloadLink,
                }}
                className={'w-full h-full object-contain'}
              />
            </View>
            <FavoritesButton id={product.id} />
          </View>
          <View
            className={`items-center w-[32vw] rounded-md ${
              perRow > 1 ? 'h-[140px]' : 'h-full'
            }`}>
            <CustomImage
              height={'full'}
              width={'full'}
              uri={
                attributes?.pic?.value?.downloadLink ||
                attributes?.pic?.value[0]?.downloadLink
              }
            />
          </View>
        </View>
        <View
          className={`justify-center px-2.5 items-center text-center ${
            perRow > 1 ? 'mt-2.5 mb-3' : 'gap-[5px] flex-1'
          }`}>
          <Paragraph weight="400" className={'h-10 text-center'}>
            {product?.localizeInfos?.title}
          </Paragraph>
          <PriceString
            currency={productCurrency}
            price={product?.price}
            size={'sm'}
            sale={product?.attributeValues?.sale?.value}
          />
          {items ? (
            <AddToCartCounter id={product.id} quantity={items} />
          ) : (
            <AddToCartButton
              size={'small'}
              id={product.id}
              inStock={product?.statusIdentifier === 'in_stock'}
              currency={productCurrency}
            />
          )}
        </View>
      </TouchableOpacity>
    </ShimmerPlaceholder>
  );
};
