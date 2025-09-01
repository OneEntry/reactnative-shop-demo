import {IError} from 'oneentry/dist/base/utils';
import {
  IFilterParams,
  IProductEntity,
  IProductsResponse,
} from 'oneentry/dist/products/productsInterfaces';
import {defineApi} from '..';
import getSearchParams from './getSearchParams';

type RequestArgs = {
  pageUrl: string;
  search: string;
  availability: boolean;
  filters: IFilterParams[];
  sortKey: 'id' | 'position' | 'title' | 'date' | 'price';
  sortOrder: 'DESC' | 'ASC';
  pageParam: number;
  limit: number;
};

export const getProducts = async ({
  pageUrl,
  search,
  availability,
  filters,
  sortKey,
  sortOrder,
  pageParam,
  limit,
}: RequestArgs) => {
  try {
    console.log('pageParam', pageParam);

    const body = getSearchParams({search, filters, available: availability});

    let result: IError | IProductsResponse;

    if (pageUrl !== 'shop') {
      result = await defineApi.Products.getProductsByPageUrl(
        pageUrl,
        body,
        undefined,
        {
          offset: pageParam * limit,
          limit,
          sortOrder,
          sortKey,
          statusMarker: availability ? 'in_stock' : undefined,
        },
      );
    } else {
      result = await defineApi.Products.getProducts(body, undefined, {
        sortOrder: sortOrder,
        sortKey: sortKey,
        offset: pageParam * limit,
        limit,
        statusMarker: availability ? 'in_stock' : undefined,
      });
    }

    if ((result as IError)?.statusCode >= 400) {
      throw new Error((result as IError)?.message);
    }

    const products = (result as IProductsResponse)?.items?.filter(res => {
      return res.isVisible;
    });

    return {data: products as IProductEntity[]};
  } catch (e: any) {
    throw new Error(e.message);
  }
};
