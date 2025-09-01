import React, {memo} from 'react';
import {FlatList} from 'react-native';
import UserReview from './UserReview';

type Props = object;

const reviews = [
  {
    review: 'Review 1',
    mark: 5,
    answer: 'thank you for review',
    author: 'Robert T.',
  },
];

const ReviewsList: React.FC<Props> = () => {
  return (
    <FlatList
      data={reviews}
      contentContainerStyle={{gap: 15, marginTop: 15}}
      renderItem={({item}) => <UserReview review={item} />}
    />
  );
};

export default memo(ReviewsList);
