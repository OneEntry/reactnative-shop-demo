import React, {memo} from 'react';
import {View} from 'react-native';
import {Paragraph} from '../../ui/texts/Paragraph';
import {IProductsEntity} from 'oneentry/dist/products/productsInterfaces';
import Card from '../../ui/cards/Card';
import PriceString from '../../ui/texts/PriceString';
import CustomImage from '../../ui/templates/CustomImage';
import AddToCartCounter from '../../shared/AddToCartCounter';
import Skeleton from 'react-native-reanimated-skeleton';
import TrashCartButton from '../../shared/TrashCartButton';

interface Props {
  product: IProductsEntity;
  initialCount: number;
  currency?: string;
  isActions?: boolean;
}

const OrderItem: React.FC<Props> = ({
  product,
  initialCount,
  isActions = true,
  currency,
}) => {
  if (!product) {
    return (
      <Skeleton
        containerStyle={{width: '100%', height: 60, borderRadius: 5}}
        layout={[
          {
            key: 1,
            width: '100%',
            height: 60,
            borderRadius: 5,
          },
        ]}
        isLoading={true}
      />
    );
  }

  return (
    <Card>
      <View className={'rounded-xs bg-lightGray'}>
        <CustomImage
          width={70}
          height={60}
          uri={
            product?.attributeValues?.pic?.value[0]?.downloadLink ||
            product?.attributeValues?.pic?.value?.downloadLink
          }
        />
      </View>
      <View className={'flex-row justify-between flex-1 mb-2.5'}>
        <View className={'justify-between'}>
          <Paragraph className={'w-28'} color={'gray'} size={16}>
            {product?.localizeInfos?.title as any}
          </Paragraph>
          <PriceString
            price={product?.price}
            size={'sm'}
            currency={currency || '$'}
            sale={product?.attributeValues?.sale?.value}
          />
        </View>
        {isActions && (
          <View className={'self-end items-center justify-end flex-row'}>
            <AddToCartCounter id={product.id} quantity={initialCount} />
            <View className={'w-5'} />
            <TrashCartButton id={product.id} />
          </View>
        )}
      </View>
    </Card>
  );
};

export default memo(OrderItem);
