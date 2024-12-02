import React, {memo} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {styleColors} from '../../../utils/consts';
import {Paragraph} from '../../ui/texts/Paragraph';
import Trash from '../../../assets/icons/trash.svg';
import Basket from '../../../assets/icons/basket.svg';
import Card from '../../ui/cards/Card';
import {IProductsEntity} from 'oneentry/dist/products/productsInterfaces';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {addProductToCart} from '../../../store/reducers/CartSlice';
import Rating from '../../shared/Rating';
import PriceString from '../../ui/texts/PriceString';
import CustomImage from '../../ui/templates/CustomImage';
import {removeFavorite} from '../../../store/reducers/FavoritesSlice';
import {updateUserState} from '../../../api/utils/updateUserState';

interface Props {
  product: IProductsEntity;
}

const FavoritesItem: React.FC<Props> = ({product}) => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.favoritesReducer.products);
  const items = useAppSelector(state => state.cartReducer.products);
  const onTrash = async (isCart?: boolean) => {
    dispatch(removeFavorite(product.id));
    const inCart = items.find(item => item.id === product.id);
    await updateUserState({
      favorites: [...favorites.filter(fav => fav !== product.id)],
      cart: [
        ...items.map(item => {
          return {
            id: item.id,
            quantity: item.quantity,
          };
        }),
        ...(!inCart && isCart ? [{id: product.id, quantity: 1}] : []),
      ],
    });
  };
  const onBasket = async () => {
    dispatch(addProductToCart({id: product.id, quantity: 1}));
    await onTrash(true);
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
            <Paragraph size={16} color={'gray'}>
              {product?.localizeInfos?.title}
            </Paragraph>
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
          <TouchableOpacity className={'p-1.5'} onPress={() => onTrash(false)}>
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
