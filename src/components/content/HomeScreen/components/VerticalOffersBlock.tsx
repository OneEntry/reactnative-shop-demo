import React from 'react';
import {Linking, View} from 'react-native';
import OfferVerticalItem from './OfferVerticalItem';
import {IPositionBlock} from 'oneentry/dist/pages/pagesInterfaces';
import {useAppNavigation} from '../../../../navigation/types/types';
import {
  addFilter,
  removeFilter,
  setHomeCardPrevious,
} from '../../../../state/reducers/FilterSlice';
import {useAppDispatch, useAppSelector} from '../../../../state/hooks';
import {IFilterParams} from 'oneentry/dist/products/productsInterfaces';

interface Props {
  products?: IPositionBlock[];
}

const VerticalOffersBlock: React.FC<Props> = ({products}) => {
  return (
    <View className={'px-layout'}>
      {products?.map((offer, index) => (
        <OfferVerticalItem block={offer} key={index + 'v_'} />
      ))}
    </View>
  );
};

export default VerticalOffersBlock;
