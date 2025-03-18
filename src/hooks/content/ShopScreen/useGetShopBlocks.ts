import {useContext, useMemo} from 'react';
import {useGetBlocksByPageUrlQuery} from '../../../api';
import {LanguageContext} from '../../../state/contexts/LanguageContext';

export const useGetShopBlocks = ({pageUrl}: {pageUrl?: string}) => {
  const {data, isLoading} = useGetBlocksByPageUrlQuery({
    pageUrl: pageUrl || 'shop',
  });

  const {badges, sortBlock, mainProductsBlock} = useMemo(() => {
    const badges = data?.filter(block => block?.templateIdentifier === 'badge');
    const sortBlock = data?.find(block => block?.templateIdentifier === 'sort');
    const mainProductsBlock = data?.find(
      block => block?.identifier === 'main_catalog',
    );
    return {
      badges,
      sortBlock,
      mainProductsBlock,
    };
  }, [data]);

  return {
    badges,
    sortBlock,
    mainProductsBlock,
    isLoading,
  };
};
