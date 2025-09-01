import React, {memo} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {styleColors} from '../../../utils/consts';
import {Paragraph} from '../../ui/texts/Paragraph';
import Trash from '../../../assets/icons/trash.svg';
import Basket from '../../../assets/icons/basket.svg';
import Card from '../../ui/cards/Card';
import {IProductsEntity} from 'oneentry/dist/products/productsInterfaces';
import {useAppDispatch} from '../../../state/hooks';
import Rating from '../../shared/Rating';
import PriceString from '../../ui/texts/PriceString';
import CustomImage from '../../ui/templates/CustomImage';
import {
  addToCart,
  toggleFavorite,
} from '../../../state/reducers/userStateSlice';

interface Props {
  product: IProductsEntity;
}

/**
 * FavoritesItem component displays a single favorite product.
 * It includes options to remove the product from favorites and add it to the cart.
 *
 * @param {Props} props - Component props.
 * @returns {React.ReactElement} - Rendered component.
 */
const FavoritesItem: React.FC<Props> = ({
  product,
}: Props): React.ReactElement => {
  const dispatch = useAppDispatch();

  /**
   * Handles removing the product from favorites.
   * Dispatches the toggleFavorite action with the product ID.
   */
  const onTrash = async () => {
    dispatch(toggleFavorite(product.id));
  };

  /**
   * Handles adding the product to the cart and then removing it from favorites.
   */
  const onBasket = async () => {
    dispatch(addToCart({id: product.id}));
    await onTrash();
  };

  return (
    <Card productId={product.id}>
      <View className={'w-[26px] h-[26px] absolute top-5 left-2.5 z-10'}>
        <Image
          source={{
            uri: product.attributeValues?.stickers?.value?.extended?.value
              ?.downloadLink,
          }}
          className={'w-full h-full object-contain'}
        />
      </View>
      <View className={'rounded-lg bg-lightGray'}>
        <View className={'rounded-xl'}>
          <CustomImage
            width={110}
            height={130}
            uri={product?.attributeValues?.pic?.value?.downloadLink}
          />
        </View>
      </View>
      <View className={'flex-row justify-between flex-1 p-2.5'}>
        <View className={'justify-between'}>
          <View style={{gap: 10}}>
            <View className="w-[25vw]">
              <Paragraph size={16} color={'gray'}>
                {product?.localizeInfos?.title}
              </Paragraph>
            </View>
            <Rating rating={3.5} shorten />
          </View>
          <PriceString
            price={product?.price}
            size={'md'}
            currency={product?.attributeValues?.currency?.value}
            sale={product?.attributeValues?.sale?.value}
          />
        </View>
        <View className={'items-center justify-between'}>
          <TouchableOpacity className={'p-1.5'} onPress={() => onTrash()}>
            <Trash />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={product.statusIdentifier === 'out_of_stock'}
            onPress={onBasket}>
            <Basket
              fill={
                product.statusIdentifier === 'out_of_stock'
                  ? styleColors.lightGray
                  : styleColors.background
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

export default memo(FavoritesItem);
