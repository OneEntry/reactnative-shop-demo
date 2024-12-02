import React, {useEffect, useMemo} from 'react';
import {View} from 'react-native';
import MultipleObjectItems from './MultipleObjectItems';
import {IProductsEntity} from 'oneentry/dist/products/productsInterfaces';
import SimilarProductsList from './SimilarProductsList';
import {useGetBlocksByProductId} from '../../../api';
import Skeleton from 'react-native-reanimated-skeleton';
import { useGetBlocksByProductIdQuery } from "../../../api/api/RTKApi";

interface Props {
  productRef?: IProductsEntity;
  refreshing: boolean;
}

const PinnedProductsBlock: React.FC<Props> = ({productRef, refreshing}) => {
  const {data: blocks, isLoading, refetch} = useGetBlocksByProductIdQuery({
    productId: productRef?.id,
  });
  const [loadingBlocks, setLoadingBlocks] = React.useState(false);

  const {multiplyBlock, relatedItems} = useMemo(() => {
    setLoadingBlocks(true);
    if (!blocks || blocks?.length === 0) {
      return {};
    }

    const together = blocks?.find(
      block => block.templateIdentifier === 'together',
    );
    const similar = blocks?.find(
      block => block.templateIdentifier === 'similiar',
    );
    setLoadingBlocks(false);
    return {relatedItems: similar, multiplyBlock: together};
  }, [blocks]);

  useEffect(() => {
    if (refreshing) {
      setTimeout(() => {
        refetch();
      }, 2000);
    }
  }, [refreshing]);

  if (isLoading || loadingBlocks) {
    return (
      <Skeleton
        containerStyle={{height: 250}}
        isLoading={isLoading}
        layout={[{key: 'blocks', width: '100%', height: 250, borderRadius: 15}]}
      />
    );
  }

  if (!multiplyBlock || !relatedItems) {
    return null;
  }

  return (
    <View>
      {blocks?.map((block, index) => {
        if (block.templateIdentifier === 'together') {
          return <MultipleObjectItems key={index} block={multiplyBlock} />;
        }
        if (block.templateIdentifier === 'similiar') {
          return (
            <SimilarProductsList key={index} relatedItems={relatedItems} />
          );
        }
      })}
    </View>
  );
};
export default PinnedProductsBlock;
