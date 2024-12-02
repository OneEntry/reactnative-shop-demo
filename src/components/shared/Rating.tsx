import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import StarFilled from '../../assets/icons/StarFilled.svg';
import StarOutline from '../../assets/icons/StarOutline.svg';
import {Paragraph, ParagraphProps} from '../ui/texts/Paragraph';

interface Props {
  rating: number;
  shorten?: boolean;
  paragraphProps?: ParagraphProps;
  starSize?: number;
}

const Rating: React.FC<Props> = ({
  rating,
  shorten,
  starSize,
  paragraphProps,
}) => {
  if (!shorten) {
    const stars = Array.from(Array(Math.round(rating)).keys());
    const emptyStars = Array.from(Array(5 - Math.round(rating)).keys());
    return (
      <View style={styles.starsContainer}>
        {stars.map((_, index) => (
          <StarFilled
            width={starSize || 16}
            height={starSize || 16}
            key={index}
          />
        ))}
        {emptyStars.map((_, index) => (
          <StarOutline
            width={starSize || 16}
            height={starSize || 16}
            key={index}
          />
        ))}
        <Paragraph size={18} weight={'700'} {...paragraphProps}>
          {rating}
        </Paragraph>
      </View>
    );
  }

  return (
    <View style={styles.starsContainer}>
      <StarFilled width={starSize || 16} height={starSize || 16} />
      <Paragraph size={18} weight={'700'} {...paragraphProps}>
        {rating}
      </Paragraph>
    </View>
  );
};

const styles = StyleSheet.create({
  starsContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
});

export default memo(Rating);
