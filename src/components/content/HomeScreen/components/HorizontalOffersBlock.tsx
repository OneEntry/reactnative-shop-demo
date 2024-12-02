import React from 'react';
import {ScrollView} from 'react-native';
import OfferHorizontalItem from './OfferHorizontalItem';
import {IPositionBlock} from 'oneentry/dist/pages/pagesInterfaces';
import {layoutPadding} from '../../../../utils/consts';

interface Props {
  products?: IPositionBlock[];
}

const HorizontalOffersBlock: React.FC<Props> = ({products}) => {
  return (
    <ScrollView
      contentContainerStyle={{paddingHorizontal: layoutPadding, gap: 20}}
      horizontal
      showsHorizontalScrollIndicator={false}>
      {products?.map((offer, index) => {
        return (
          <OfferHorizontalItem
            sticker={
              offer.attributeValues.stickers?.value[0]?.extended?.value
                ?.downloadLink
            }
            bg={offer.attributeValues?.bg?.value[0]?.downloadLink}
            item={offer.attributeValues?.item_img?.value[0]?.downloadLink}
            text={offer.attributeValues?.title?.value}
            productId={offer.attributeValues?.product_id?.value}
            sticker_name={offer.attributeValues.stickers?.value[0]?.value}
            key={index}
          />
        );
      })}
    </ScrollView>
  );
};

export default HorizontalOffersBlock;
