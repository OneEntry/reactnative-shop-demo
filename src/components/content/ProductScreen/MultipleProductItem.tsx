import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {Paragraph} from '../../ui/texts/Paragraph';
import Plus from '../../../assets/icons/plus.svg';
import {useAppNavigation} from '../../../navigation/types/types';
import PriceString from '../../ui/texts/PriceString';
import ContentNotFoundBlock from '../../shared/ContentNotFoundBlock';
import {useAppSelector} from '../../../state/hooks';
import {useGetBlockByMarkerQuery} from '../../../api/api/RTKApi';
import Skeleton from '../../shared/Skeleton';
import AddToCartButton from '../../shared/AddToCartButton';
import AddToCartCounter from '../../shared/AddToCartCounter';
import {getCartItemById} from '../../../state/reducers/userStateSlice';
interface Props {
  marker: string;
}

const MultipleProductItem: React.FC<Props> = ({marker}) => {
  const {data, isLoading} = useGetBlockByMarkerQuery({marker});
  const navigation = useAppNavigation();

  const product = data?.products?.[0];
  const items = useAppSelector(state => getCartItemById(state, product?.id));

  if (isLoading) {
    return <Skeleton height={250} isLoading={isLoading} />;
  }

  if (!product) {
    return <ContentNotFoundBlock />;
  }

  return (
    <TouchableOpacity
      onPress={() => {
        // @ts-ignore
        navigation.push('Product', {id: product?.id});
      }}
      className={'w-full rounded-md bg-lightGray p-5 gap-x-2 flex-row'}>
      <View className={'items-start mr-3'}>
        <View className={'w-[75px] text-left'}>
          <Paragraph color={'gray'}>{product?.localizeInfos?.title}</Paragraph>
        </View>
        <View className={'my-2'}>
          <PriceString
            price={product?.price}
            size={'sm'}
            currency={product?.attributeValues?.currency?.value || '$'}
            sale={product?.attributeValues?.sale?.value}
            className={'text-accent'}
          />
        </View>
        <View className={'mt-1'}>
          {items ? (
            <AddToCartCounter
              id={product.id}
              quantity={items.quantity}
              isZeroValue={true}
            />
          ) : (
            <AddToCartButton
              size={'small'}
              id={product.id}
              inStock={product?.statusIdentifier === 'in_stock'}
              currency={product?.attributeValues?.currency?.value}
            />
          )}
        </View>
      </View>
      <View className={'flex-1 flex-row items-center justify-between'}>
        <Image
          style={{objectFit: 'contain'}}
          className={'w-5/12 h-full object-contain bg-white rounded-xs'}
          source={{
            uri: product?.attributeValues?.more_pic?.value[0]?.downloadLink,
          }}
        />
        <Plus />
        <Image
          style={{objectFit: 'contain'}}
          className={'w-5/12 h-full object-contain bg-white rounded-xs'}
          source={{
            uri: product?.attributeValues?.more_pic?.value[1]?.downloadLink,
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

export default MultipleProductItem;
