import React from 'react';
import {Alert, Image, TouchableOpacity, View} from 'react-native';
import {Paragraph} from '../../ui/texts/Paragraph';
import MiniButton from '../../ui/buttons/MiniButton';
import Plus from '../../../assets/icons/plus.svg';
import {useAppNavigation} from '../../../navigation/types/types';
import PriceString from '../../ui/texts/PriceString';
import ContentNotFoundBlock from '../../shared/ContentNotFoundBlock';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {addProductToCart} from '../../../store/reducers/CartSlice';
import Skeleton from 'react-native-reanimated-skeleton';
import {useGetBlockByMarkerQuery} from '../../../api/api/RTKApi';
interface Props {
  marker: string;
}

const MultipleProductItem: React.FC<Props> = ({marker}) => {
  const {data, isLoading} = useGetBlockByMarkerQuery({marker});

  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  const {addToCart, outOfStock} = useAppSelector(
    state => state.systemContentReducer.content.buttons,
  );

  const product = data?.products?.[0];

  const onAddToCart = () => {
    if (!product) {
      Alert.alert('Product not found');
    }

    if (product?.id) {
      dispatch(addProductToCart({id: product.id, quantity: 1}));
    }
  };

  if (isLoading) {
    return (
      <Skeleton
        containerStyle={{height: 250}}
        isLoading={isLoading}
        layout={[{key: 'blocks', width: '100%', height: 250, borderRadius: 15}]}
      />
    );
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
      className={'w-full rounded-md bg-lightGray p-5 space-x-6 flex-row'}>
      <View className={'items-start'}>
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
          <MiniButton
            title={
              product?.statusIdentifier === 'in_stock' ? addToCart : outOfStock
            }
            style={{paddingHorizontal: 10}}
            size={9}
            active={product?.statusIdentifier === 'in_stock'}
            onPress={onAddToCart}
          />
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
