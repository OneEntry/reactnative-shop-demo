import React from 'react';
import TopSpacerV2 from '../../components/ui/space/TopSpacerV2';
import {Screen} from '../../components/ui/templates/Screen';
import {
  ProductContent,
  ProductGoBack,
} from '../../components/content/ProductScreen';

type Props = object;
export const Product: React.FC<Props> = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  return (
    <Screen isFull white>
      {refreshing && <TopSpacerV2 height={1} />}
      <ProductGoBack />
      <ProductContent refreshing={refreshing} setRefreshing={setRefreshing} />
    </Screen>
  );
};
