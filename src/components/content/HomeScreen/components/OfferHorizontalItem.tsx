import React, {memo} from 'react';
import {Image, ImageBackground, TouchableOpacity, View} from 'react-native';
import {Paragraph} from '../../../ui/texts/Paragraph';
import {useAppNavigation} from '../../../../navigation/types/types';
import {useAppDispatch, useAppSelector} from '../../../../state/hooks';
import {
  addFilter,
  removeFilter,
  setHomeCardPrevious,
} from '../../../../state/reducers/FilterSlice';
import {IFilterParams} from 'oneentry/dist/products/productsInterfaces';
import CustomImage from '../../../ui/templates/CustomImage';

interface Props {
  bg: string;
  item: string;
  text: string;
  productId: number;
  sticker?: string;
  sticker_name?: string;
}

/**
 * OfferHorizontalItem component displays a horizontal offer item with an image background.
 * It handles navigation based on the presence of a sticker name or product ID.
 * When a sticker name is present, it updates filters and navigates to the shop screen.
 * When a product ID is present, it navigates to the product detail screen.
 *
 * @param {Props} props - Component props.
 * @returns {React.ReactElement} - Rendered component.
 */
const OfferHorizontalItem: React.FC<Props> = ({
  bg,
  item,
  text,
  sticker_name,
  productId,
  sticker,
}: Props): React.ReactElement => {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();
  const homeCardPrevious = useAppSelector(
    state => state.filterReducer.homeCardsPrevious,
  );
  const onPress = () => {
    if (sticker_name) {
      // Remove the previous filter of this category
      dispatch(removeFilter(homeCardPrevious));
      // Create a new filter candidate based on the sticker name
      const candidate: IFilterParams = {
        attributeMarker: 'stickers',
        conditionMarker: 'in',
        conditionValue: sticker_name,
      };
      dispatch(addFilter(candidate));
      dispatch(setHomeCardPrevious({previous: candidate}));
      return navigation.navigate('shop', {});
    }
    if (productId) {
      return navigation.navigate('Products', {
        screen: 'Product',
        params: {id: productId},
      });
    }
  };
  return (
    <TouchableOpacity onPress={onPress}>
      <ImageBackground
        source={{uri: bg}}
        resizeMode="contain"
        borderRadius={20}
        className={'w-[185px] rounded-lg h-[260px]'}>
        <View className={'absolute w-full h-full items-center justify-center'}>
          <CustomImage uri={item} width={140} height={140} />
        </View>
        <View className={'w-9 h-9 absolute top-2.5 left-2.5'}>
          <Image
            source={{uri: sticker}}
            className={'w-9 h-9'}
            style={{objectFit: 'contain'}}
          />
        </View>
        <View className={'absolute w-full bottom-6'}>
          <Paragraph
            weight={'700'}
            size={18}
            className={'text-center'}
            color={'white'}>
            {text}
          </Paragraph>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default memo(OfferHorizontalItem);
