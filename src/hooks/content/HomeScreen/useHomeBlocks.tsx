import {useMemo, useState} from 'react';
import {IPositionBlock} from 'oneentry/dist/pages/pagesInterfaces';

type Blocks = {
  horizontalItems: IPositionBlock[];
  verticalItems: IPositionBlock[];
  banner?: IPositionBlock;
  badges?: IPositionBlock;
};

export const useHomeBlocks = (blocks: IPositionBlock[] | undefined) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    badges,
    banner,
    verticalItems: vertical,
    horizontalItems: horizontal,
  } = useMemo((): Blocks => {
    setLoading(true);
    const initialValue: Blocks = {
      horizontalItems: [],
      verticalItems: [],
      banner: undefined,
      badges: undefined,
    };
    const sortedBlocks = blocks?.reduce((obj: Blocks, block) => {
      if (block.templateIdentifier === 'item_card') {
        obj.horizontalItems.push(block);
      }

      if (
        block.templateIdentifier === 'new_arrivals' ||
        block.templateIdentifier === 'youtube_home_block'
      ) {
        obj.verticalItems.push(block);
      }

      if (block.templateIdentifier === 'home_badges') {
        obj.badges = block;
      }

      if (block.templateIdentifier === 'home_banner') {
        obj.banner = block;
      }

      return obj;
    }, initialValue);

    setLoading(false);
    return sortedBlocks ?? initialValue;
  }, [blocks]);

  return {
    horizontal,
    vertical,
    banner,
    badges,
    loading,
  };
};
