import {createApi, fakeBaseQuery} from '@reduxjs/toolkit/query/react';
import {defineApi} from './defineApi';
import {
  IPagesEntity,
  IPositionBlock,
} from 'oneentry/dist/pages/pagesInterfaces';
import {IAuthProvidersEntity} from 'oneentry/dist/auth-provider/authProvidersInterfaces';
import {IFormsEntity} from 'oneentry/dist/forms/formsInterfaces';
import {IUserEntity} from 'oneentry/dist/users/usersInterfaces';
import {
  IAccountsEntity,
  ISessionEntity,
} from 'oneentry/dist/payments/paymentsInterfaces';
import {
  IOrdersByMarkerEntity,
  IOrdersEntity,
} from 'oneentry/dist/orders/ordersInterfaces';
import {IAttributes, IError} from 'oneentry/dist/base/utils';
import {IAttributesSetsEntity} from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';
import {IBlockEntity} from 'oneentry/dist/blocks/blocksInterfaces';
import {
  IFilterParams,
  IProductBlock,
  IProductEntity,
  IProductsEntity,
  IProductsResponse,
} from 'oneentry/dist/products/productsInterfaces';
import {IMenusEntity} from 'oneentry/dist/menus/menusInterfaces';
import {ILocalEntity} from 'oneentry/dist/locales/localesInterfaces';
import getSearchParams from '../utils/getSearchParams';
import {ISubscriptions} from 'oneentry/dist/events/eventsInterfaces';

export function isError<T extends object>(data: T | IError): data is IError {
  if ('statusCode' in data && data.statusCode >= 400 && 'message' in data) {
    return true;
  }

  return false;
}

export const RTKApi = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  endpoints: build => ({
    getAuthProviders: build.query<IAuthProvidersEntity[], string | undefined>({
      queryFn: async activeLang => {
        try {
          const result =
            await defineApi.AuthProvider.getAuthProviders(activeLang);

          if (isError(result)) {
            throw new Error(result?.message);
          }
          return {data: result || []};
        } catch (e: any) {
          return {error: e.message};
        }
      },
    }),
    getFormByMarker: build.query<IFormsEntity, {marker: string}>({
      queryFn: async ({marker}) => {
        try {
          const result = await defineApi.Forms.getFormByMarker(marker);

          if (isError(result)) {
            throw new Error(result?.message);
          }

          result.attributes.sort(
            (a: IAttributes, b: IAttributes) => a.position - b.position,
          );
          return {data: result as IFormsEntity};
        } catch (e: any) {
          return {error: e.message};
        }
      },
    }),
    getMe: build.query<IUserEntity, void>({
      queryFn: async () => {
        try {
          const result = await defineApi.Users.getUser();
          if (!result || (result as IError)?.pageData) {
            console.log(result);
            throw new Error(JSON.stringify(result));
          }
          return {data: result as IUserEntity};
        } catch (e: any) {
          const errorPage = JSON.parse(e.message);
          return {error: errorPage};
        }
      },
    }),
    getAccounts: build.query<IAccountsEntity[], void>({
      queryFn: async () => {
        try {
          const result = await defineApi.Payments.getAccounts();

          if (isError(result)) {
            throw new Error(result?.message);
          }

          return {data: result};
        } catch (e: any) {
          return {error: e.message};
        }
      },
    }),
    getOrderStorageByMarker: build.query<IOrdersEntity, {marker: string}>({
      queryFn: async ({marker}) => {
        try {
          const result = await defineApi.Orders.getOrderByMarker(marker);

          if (isError(result)) {
            throw new Error(result?.message);
          }

          return {data: result as IOrdersEntity};
        } catch (e: any) {
          return {error: e.message};
        }
      },
    }),
    getPaymentSessionById: build.query<ISessionEntity, {id: number}>({
      queryFn: async ({id}) => {
        try {
          const result = await defineApi.Payments.getSessionById(id);
          if (isError(result)) {
            throw new Error(result?.message);
          }
          return {data: result};
        } catch (e: any) {
          return {error: e.message};
        }
      },
    }),
    getUserOrders: build.query<IOrdersByMarkerEntity, {marker: string}>({
      queryFn: async ({marker}) => {
        try {
          const result = await defineApi.Orders.getAllOrdersByMarker(marker);

          if (isError(result)) {
            throw new Error(result?.message);
          }

          return {data: result as IOrdersByMarkerEntity};
        } catch (e: any) {
          return {error: e.message};
        }
      },
    }),
    getAttributesByMarker: build.query<
      IAttributesSetsEntity[],
      {setMarker: string; langCode?: string}
    >({
      queryFn: async ({setMarker}) => {
        try {
          const result =
            await defineApi.AttributesSets.getAttributesByMarker(setMarker);

          if (isError(result)) {
            throw new Error(result?.message);
          }
          return {data: result};
        } catch (e: any) {
          return {error: e.message};
        }
      },
    }),
    getSingleAttributeInSetByMarker: build.query<
      IAttributesSetsEntity,
      {setMarker: string; attributeMarker: string}
    >({
      queryFn: async ({setMarker, attributeMarker}) => {
        try {
          const result =
            await defineApi.AttributesSets.getSingleAttributeByMarkerSet(
              setMarker,
              attributeMarker,
            );

          if (isError(result)) {
            throw new Error(result?.message);
          }

          return {data: result as IAttributesSetsEntity};
        } catch (e: any) {
          return {error: e.message};
        }
      },
    }),
    //get User subscriptions
    getUserSubscriptions: build.query<ISubscriptions, void>({
      queryFn: async () => {
        try {
          const result = await defineApi.Events.getAllSubscriptions();

          if (isError(result)) {
            throw new Error(result?.message);
          }

          return {data: result as ISubscriptions};
        } catch (e: any) {
          return {error: e.message};
        }
      },
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          // Dispatch your slice's action with the fetched data
          if (data) {
          }
        } catch (err) {
          console.error('Failed to fetch masters:', err);
        }
      },
    }),
    // Get block
    getBlockByMarker: build.query<
      IBlockEntity,
      {marker: string; offset?: number; limit?: number; langCode?: string}
    >({
      queryFn: async ({marker, offset, limit, langCode}) => {
        try {
          const result = await defineApi.Blocks.getBlockByMarker(
            marker,
            langCode || undefined,
            offset,
            limit,
          );

          if (isError(result)) {
            throw new Error(result?.message);
          }

          return {data: result as IBlockEntity};
        } catch (e: any) {
          return {error: e.message};
        }
      },
    }),
    getBlocksByProductId: build.query<IProductBlock[], {productId?: number}>({
      queryFn: async ({productId}) => {
        try {
          if (!productId) {
            console.log('product id is required');
            return {data: []};
          }

          const result =
            await defineApi.Products.getProductBlockById(productId);

          if (isError(result)) {
            throw new Error(result?.message);
          }
          return {data: result as IProductBlock[]};
        } catch (e: any) {
          return {error: e.message};
        }
      },
    }),
    getBlocksByPageUrl: build.query<IPositionBlock[], {pageUrl?: string}>({
      queryFn: async ({pageUrl}) => {
        try {
          if (!pageUrl) {
            console.log('page url is required');
            return {data: []};
          }

          const result = await defineApi.Pages.getBlocksByPageUrl(pageUrl);

          if (isError(result)) {
            throw new Error(result?.message);
          }

          return {data: result as IPositionBlock[]};
        } catch (e: any) {
          return {error: e.message};
        }
      },
    }),
    getRelatedProducts: build.query<IProductsResponse, {id?: number}>({
      queryFn: async ({id}) => {
        try {
          if (!id) {
            console.log('page url is required');
            return {data: undefined};
          }

          const result = await defineApi.Products.getRelatedProductsById(id);

          if (isError(result)) {
            throw new Error(result?.message);
          }
          return {data: result as IProductsResponse};
        } catch (e: any) {
          return {error: e.message};
        }
      },
    }),
    getConfig: build.query<
      {limit: number; columns: number},
      {pageUrl?: string}
    >({
      queryFn: async ({pageUrl}) => {
        try {
          if (!pageUrl) {
            console.log('page url is required');
            return {data: {limit: 2, columns: 2}};
          }

          const result = await defineApi.Pages.getConfigPageByUrl(pageUrl);

          if (isError(result)) {
            throw new Error(result?.message);
          }

          return {
            data: {
              limit:
                (result.productsPerRow || 2) *
                (result.rowsPerPage <= 1 ? 2 : result.rowsPerPage),
              columns: result?.productsPerRow || 2,
            },
          };
        } catch (e: any) {
          return {error: e.message};
        }
      },
    }),
    getPage: build.query<IPagesEntity, {pageUrl?: string}>({
      queryFn: async ({pageUrl}) => {
        try {
          if (!pageUrl) {
            console.log('page url is required');
            return {data: undefined};
          }
          const result = await defineApi.Pages.getPageByUrl(pageUrl);

          if (isError(result)) {
            throw new Error(result?.message);
          }

          return {data: result as IPagesEntity};
        } catch (e: any) {
          return {error: e.message};
        }
      },
    }),
    getProductById: build.query<IProductsEntity, {id: number}>({
      queryFn: async ({id}) => {
        try {
          if (!id) {
            throw new Error('No id');
          }
          const result = await defineApi.Products.getProductById(id);

          if (isError(result)) {
            throw new Error(result?.message);
          }

          return {data: result as IProductsEntity};
        } catch (e: any) {
          return {error: e.message};
        }
      },
    }),
    getProductsByIds: build.query<IProductsEntity[], {items: string}>({
      queryFn: async ({items}) => {
        const products = await defineApi.Products.getProductsByIds(items);
        if (!products || (products as IError).statusCode >= 400) {
          return {error: 'Data error'};
        } else {
          return {data: products as IProductEntity[]};
        }
      },
    }),

    getProducts: build.query<
      IProductsEntity[],
      {
        pageUrl?: string;
        filters?: IFilterParams[];
        search?: string;
        sortKey: 'id' | 'position' | 'title' | 'date' | 'price';
        sortOrder: 'DESC' | 'ASC';
        offset: number;
        available?: boolean;
        limit?: number;
      }
    >({
      queryFn: async ({
        pageUrl,
        limit,
        offset,
        sortKey,
        sortOrder,
        search,
        filters,
        available,
      }) => {
        try {
          if (!limit) {
            return {data: []};
          }
          const body = getSearchParams({search, filters, available});

          let result: IError | IProductsResponse;

          if (pageUrl !== 'shop') {
            result = await defineApi.Products.getProductsByPageUrl(
              pageUrl,
              body,
              undefined,
              {
                offset,
                limit,
                sortOrder,
                sortKey,
                statusMarker: available ? 'in_stock' : undefined,
              },
            );
          } else {
            result = await defineApi.Products.getProducts(body, undefined, {
              sortOrder: sortOrder,
              sortKey: sortKey,
              offset,
              limit,
              statusMarker: available ? 'in_stock' : undefined,
            });
          }

          if (isError(result)) {
            throw new Error(result?.message);
          }

          const products = (result as IProductsResponse)?.items?.filter(res => {
            return res.isVisible;
          });

          return {data: products as IProductEntity[]};
        } catch (e: any) {
          return {error: e.message};
        }
      },
    }),

    getMenu: build.query<IMenusEntity, {marker: string}>({
      queryFn: async ({marker}) => {
        try {
          const result = await defineApi.Menus.getMenusByMarker(marker);

          if (isError(result)) {
            throw new Error(result?.message);
          }

          return {data: result as IMenusEntity};
        } catch (e: any) {
          return {error: e.message};
        }
      },
    }),
    getLocales: build.query<ILocalEntity[], any>({
      queryFn: async () => {
        try {
          const result = await defineApi.Locales.getLocales();

          if (isError(result)) {
            throw new Error(result?.message);
          }

          return {data: result as ILocalEntity[]};
        } catch (e: any) {
          return {error: e.message};
        }
      },
    }),
    getPages: build.query<IPagesEntity[], any>({
      queryFn: async () => {
        try {
          const result = await defineApi.Pages.getPages();

          if (isError(result)) {
            throw new Error(result?.message);
          }

          return {data: result as IPagesEntity[]};
        } catch (e: any) {
          return {error: e.message};
        }
      },
    }),
  }),
});

export const {
  useGetBlocksByPageUrlQuery,
  useGetFormByMarkerQuery,
  useLazyGetFormByMarkerQuery,
  useGetAuthProvidersQuery,
  useLazyGetMeQuery,
  useGetAccountsQuery,
  useGetPaymentSessionByIdQuery,
  useLazyGetPaymentSessionByIdQuery,
  useGetOrderStorageByMarkerQuery,
  useGetUserOrdersQuery,
  useGetAttributesByMarkerQuery,
  useGetBlockByMarkerQuery,
  useLazyGetBlockByMarkerQuery,
  useGetSingleAttributeInSetByMarkerQuery,
  useGetBlocksByProductIdQuery,
  useGetRelatedProductsQuery,
  useGetConfigQuery,
  useGetPageQuery,
  useGetProductByIdQuery,
  useGetMenuQuery,
  useGetLocalesQuery,
  useGetPagesQuery,
  useGetProductsQuery,
  useLazyGetUserSubscriptionsQuery,
  useGetUserSubscriptionsQuery,
} = RTKApi;
