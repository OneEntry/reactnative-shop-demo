import React, {useEffect, useMemo} from 'react';
import {View} from 'react-native';
import MultipleObjectItems from './MultipleObjectItems';
import SimilarProductsList from './SimilarProductsList';
import {useGetBlocksByProductIdQuery} from '../../../api/api/RTKApi';
import Skeleton from '../../shared/Skeleton';

interface Props {
  productId?: number;
  refreshing: boolean;
}

/**
 * PinnedProductsBlock component displays pinned blocks for a product. Realization of product blocks.
 * It fetches and renders multiple object items and similar products blocks.
 *
 * @param {Props} props - Component props.
 * @returns {React.ReactElement} - Rendered component.
 */
const PinnedProductsBlock: React.FC<Props> = ({productId, refreshing}) => {
  // Fetch blocks associated with the product using the RTK query
  const {
    data: blocks,
    isLoading,
    refetch,
  } = useGetBlocksByProductIdQuery({
    productId,
  });

  const [loadingBlocks, setLoadingBlocks] = React.useState(false);

  // Memoize the relevant blocks (multiply and similar)
  const {multiplyBlock, relatedItems} = useMemo(() => {
    setLoadingBlocks(true);
    if (!blocks || blocks?.length === 0) {
      return {};
    }

    const together = blocks?.find(
      block => block.identifier === 'multiply_items_offer',
    );
    const similar = blocks?.find(block => block.identifier === 'similar');
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
    return <Skeleton height={250} isLoading={isLoading} />;
  }

  return (
    <View>
      {multiplyBlock && <MultipleObjectItems block={multiplyBlock} />}

      {relatedItems && <SimilarProductsList relatedItems={relatedItems} />}
    </View>
  );
};
export default PinnedProductsBlock;
