import {NavigatorScreenParams} from '@react-navigation/native';
import {ProductStackNavigatorParamList} from './ProductStackNavigatorParamList';
import {IOrderByMarkerEntity} from 'oneentry/dist/orders/ordersInterfaces';

export type DrawerStackNavigatorParamList = {
  Products: NavigatorScreenParams<ProductStackNavigatorParamList>;
  payment_method: {
    orderId: string;
    paymentUrl: string;
  };
  successful_payment: {
    id: number;
  };
  canceled_payment: {
    id: number;
  };
  order_details: {
    order: IOrderByMarkerEntity;
  };
  Search: undefined;
  reviews: {
    productId: number;
  };
  message: {
    message: string;
  };
} & {
  [key: string]: {
    pageUrl?: string;
    title?: string;
    searchValue?: string;
    sticker?: string;
  };
};
