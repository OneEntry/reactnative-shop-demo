import React from 'react';
import {Linking, View} from 'react-native';
import OfferVerticalItem from './OfferVerticalItem';
import {IPositionBlock} from 'oneentry/dist/pages/pagesInterfaces';
import {useAppNavigation} from '../../../../navigation/types/types';
import {
  addFilter,
  removeFilter,
  setHomeCardPrevious,
} from '../../../../store/reducers/FilterSlice';
import {useAppDispatch, useAppSelector} from '../../../../store/hooks';
import {IFilterParams} from 'oneentry/dist/products/productsInterfaces';

interface Props {
  products?: IPositionBlock[];
}

// @ts-ignore
const VerticalOffersBlock: React.FC<Props> = ({products}) => {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();
  const homeCardPrevious = useAppSelector(
    state => state.filterReducer.homeCardsPrevious,
  );
  const onClick = async (product: IPositionBlock) => {
    if (product.templateIdentifier === 'youtube_home_block') {
      return await Linking.openURL(
        product?.attributeValues?.link?.value || 'https://google.com',
      );
    }
    if (product.templateIdentifier === 'new_arrivals') {
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
    <View className={'px-layout'}>
      {products?.map((offer, index) => (
        <OfferVerticalItem
          sticker={
            offer.attributeValues.stickers?.value?.extended?.value?.downloadLink
          }
          bg={offer.attributeValues?.bg?.value[0]?.downloadLink}
          item={offer.attributeValues?.item_img?.value[0]?.downloadLink}
          text={
            offer?.templateIdentifier !== 'youtube_home_block' &&
            offer.attributeValues?.title?.value
          }
          action={() => onClick(offer)}
          productId={offer.attributeValues?.product_id?.value}
          key={index}
        />
      ))}
    </View>
  );
};

export default VerticalOffersBlock;
