import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Paragraph} from '../ui/texts/Paragraph';
import {navigate} from '../../navigation/utils/NavigatonRef';

type Props = {
  reviewsCount: number;
  productId?: number;
};

const OpenReviewsButton: React.FC<Props> = ({reviewsCount, productId}) => {
  if (!productId) {
    return <></>;
  }

  return (
    <TouchableOpacity
      onPress={() => navigate('reviews', {productId})}
      style={styles.container}>
      <Image style={styles.img} source={require('../content/ReviewsScreen/assets/Reviews.png')} />
      <Paragraph size={14} weight={'500'} color={'lightGray'}>
        {reviewsCount}
      </Paragraph>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {width: 17, height: 17},
});
export default OpenReviewsButton;
