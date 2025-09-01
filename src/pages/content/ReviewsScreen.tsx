import React from 'react';
import {Screen} from '../../components/ui/templates/Screen';
import {RouteProp, useRoute} from '@react-navigation/native';
import {DrawerStackNavigatorParamList} from '../../navigation';
import FlexLoader from '../../components/ui/space/FlexLoader';
import ErrorBlock from '../../components/shared/ErrorBlock';
import TopSpacerV2 from '../../components/ui/space/TopSpacerV2';
import {
  ReviewItemCard,
  ReviewsList,
} from '../../components/content/ReviewsScreen';
import {useGetProductByIdQuery} from '../../api/api/RTKApi';

const ReviewsScreen: React.FC = () => {
  const route = useRoute<RouteProp<DrawerStackNavigatorParamList, 'reviews'>>();
  const {
    data: product,
    isLoading: loading,
    error,
  } = useGetProductByIdQuery({
    id: route?.params?.productId,
  });

  if (error) {
    return <ErrorBlock errorTitle={error.toString()} />;
  }

  if (loading || !product) {
    return <FlexLoader />;
  }

  return (
    <Screen isFull white edges={['horizontal']}>
      <TopSpacerV2 height={60} />
      <ReviewItemCard product={product} />
      <ReviewsList />
    </Screen>
  );
};

export default ReviewsScreen;
