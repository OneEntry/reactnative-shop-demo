import type {IFilterParams} from 'oneentry/dist/products/productsInterfaces';

const getSearchParams = (searchParams?: {
  search?: string;
  filters?: IFilterParams[];
  available?: boolean;
}) => {
  const expandedFilters:
    | Array<IFilterParams & {statusMarker?: string}>
    | undefined = [];

  // check if product has SKU or this is service product
  const servicesFilter: IFilterParams = {
    attributeMarker: 'sku',
    conditionMarker: 'nin',
    conditionValue: null,
    title: searchParams?.search || '',
    pageUrl: ['shop'],
    isNested: true,
  };
  expandedFilters.push(servicesFilter);

  if (searchParams?.available) {
    // @ts-ignore
    expandedFilters.push({statusMarker: 'in_stock'});
  }

  if (searchParams?.filters?.length) {
    return expandedFilters?.concat(searchParams?.filters);
  } else {
    return expandedFilters;
  }
};

export default getSearchParams;
