import React, {memo} from 'react';
import {Paragraph} from './Paragraph';
import {TextStyle, View} from 'react-native';
import {useAppSelector} from '../../../store/hooks';

type Props = {
  price?: number;
  size?: 'sm' | 'md' | 'lg';
  sale?: number;
  currency: string;
  style?: TextStyle;
  className?: string;
};

const textSizes = {
  sm: 14,
  md: 18,
  lg: 20,
};

const PriceString: React.FC<Props> = ({
  price,
  currency,
  size = 'sm',
  style,
  sale,
  className,
}) => {
  const defaultCurrency = useAppSelector(
    state => state.systemContentReducer.content.currency,
  );
  return (
    <>
      {sale && price ? (
        <View className={'flex-row items-center space-x-1.5'}>
          <Paragraph className={className} style={style} size={textSizes[size]} weight="bold">
            {currency} {price - sale}
          </Paragraph>
          <Paragraph
            weight="bold"
            color={'lightGray'}
            size={textSizes[size]}
            style={[{textDecorationLine: 'line-through'}]}>
            {price}
          </Paragraph>
        </View>
      ) : (
        <Paragraph size={textSizes[size]} weight="bold">
          {currency || defaultCurrency} {price}
        </Paragraph>
      )}
    </>
  );
};

export default memo(PriceString);
