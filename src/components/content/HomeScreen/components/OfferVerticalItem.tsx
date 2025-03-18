import React, {memo} from 'react';
import {useAppNavigation} from '../../../../navigation/types/types';
import {
  Image,
  ImageBackground,
  Linking,
  TouchableOpacity,
  View,
} from 'react-native';
import {Paragraph} from '../../../ui/texts/Paragraph';
import {IPositionBlock} from 'oneentry/dist/pages/pagesInterfaces';
import {
  addFilter,
  removeFilter,
  setHomeCardPrevious,
} from '../../../../state/reducers/FilterSlice';
import {IFilterParams} from 'oneentry/dist/products/productsInterfaces';
import {useAppDispatch, useAppSelector} from '../../../../state/hooks';

interface Props {
  block: IPositionBlock;
}

/**
 * OfferVerticalItem component displays a vertical offer item with an image background.
 * It handles navigation based on the template identifier of the block.
 * If the template identifier is 'youtube_home_block', it opens a URL.
 * If the template identifier is 'new_arrivals', it updates filters and navigates to the shop screen.
 *
 * @param {Props} props - Component props.
 * @returns {React.ReactElement} - Rendered component.
 */
const OfferVerticalItem: React.FC<Props> = ({
  block,
}: Props): React.ReactElement => {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();
  const homeCardPrevious = useAppSelector(
    state => state.filterReducer.homeCardsPrevious,
  );

  const onClick = () => {
    if (block.templateIdentifier === 'youtube_home_block') {
      return Linking.openURL(
        block?.attributeValues?.link?.value || 'https://google.com',
      );
    }
    if (block.templateIdentifier === 'new_arrivals') {
      dispatch(removeFilter(homeCardPrevious));
      const candidate: IFilterParams = {
        attributeMarker: 'stickers',
        conditionMarker: 'in',
        conditionValue: 'new',
      };
      dispatch(addFilter(candidate));
      dispatch(setHomeCardPrevious({previous: candidate}));
      return navigation.navigate('shop', {});
    }
  };

  return (
    <TouchableOpacity onPress={onClick}>
      <ImageBackground
        source={{uri: block?.attributeValues?.bg?.value[0]?.downloadLink}}
        resizeMode="cover"
        borderRadius={20}
        className={'w-full rounded-lg h-[180px] mr-5 mt-5'}>
        <View className={'absolute w-full h-full items-center justify-center'}>
          <Image
            source={{
              uri: block?.attributeValues?.item_img?.value[0]?.downloadLink,
            }}
            className={'w-[140px] h-[140px] object-contain'}
          />
        </View>
        <View className={'w-9 h-9 absolute top-2.5 left-2.5'}>
          <Image
            source={{
              uri: block?.attributeValues?.stickers?.value?.extended?.value
                ?.downloadLink,
            }}
            className={'w-9 h-9 object-contain'}
          />
        </View>
        <View className={'absolute left-6 bottom-4 w-1/2'}>
          <Paragraph weight={'700'} size={24} color={'white'}>
            {block?.templateIdentifier !== 'youtube_home_block' &&
              block.attributeValues?.title?.value?.toString()?.toUpperCase()}
          </Paragraph>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default memo(OfferVerticalItem);
