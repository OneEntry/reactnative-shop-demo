import React from 'react';
import {View} from 'react-native';
import {Paragraph} from '../../ui/texts/Paragraph';
import Rating from '../../shared/Rating';

type Props = {
  review: {
    review: string;
    answer: string;
    mark: number;
    author: string;
  };
};

const UserReview: React.FC<Props> = ({review}) => {
  return (
    <View style={{gap: 10}}>
      <View style={{gap: 10}}>
        <View className={'flex-row items-center'} style={{gap: 5}}>
          <Paragraph color={'gray'} size={14}>
            {review.author}
          </Paragraph>
          <Rating
            paragraphProps={{size: 16}}
            starSize={14}
            rating={review.mark}
          />
        </View>

        <Paragraph color={'lightGray'}>{review.review}</Paragraph>
      </View>
      <View className={'px-layout py-2.5 bg-lightGray rounded-xs space-y-2.5'}>
        <Paragraph size={14} weight={'500'}>
          Brand ambassador
        </Paragraph>
        <Paragraph size={14} color={'lightGray'}>
          {review.answer}
        </Paragraph>
      </View>
    </View>
  );
};

export default UserReview;
