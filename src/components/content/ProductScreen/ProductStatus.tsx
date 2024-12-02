import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import PriceString from '../../ui/texts/PriceString';
import {Paragraph} from '../../ui/texts/Paragraph';

interface Props {
  status?: any;
  price?: number;
  currency?: string;
  sale?: number;
}

const ProductStatus: React.FC<Props> = ({status, price, currency, sale}) => {
  if (status?.identifier === 'out_of_stock') {
    return (
      <>
        <Paragraph>{status?.localizeInfos?.title}</Paragraph>
      </>
    );
  }

  return (
    <View style={styles.priceInfo}>
      <View style={styles.price}>
        <PriceString
          currency={currency || '$'}
          price={price}
          size={'lg'}
          sale={sale}
        />
      </View>
    </View>
  );
};

export default memo(ProductStatus);

const styles = StyleSheet.create({
  priceInfo: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  price: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});
