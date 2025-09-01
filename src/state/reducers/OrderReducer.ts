import {
  IOrderProductData,
  IOrdersFormData,
} from 'oneentry/dist/orders/ordersInterfaces';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type IAppOrder = {
  formIdentifier?: string;
  paymentAccountIdentifier?: string;
  formData: (IOrdersFormData & {valid?: boolean})[];
  products: IOrderProductData[];
};

type InitialStateType = {
  order: IAppOrder | undefined;
  currency?: string;
  availableTimes?: [number, number, number[] | undefined, number];
  selectedDate?: string;
  orderTime?: number;
  paymentMethods?: {
    identifier: string;
  }[];
};
const initialState: InitialStateType = {
  order: undefined,
};

const orderSlice = createSlice({
  initialState,
  name: 'order',
  reducers: {
    create(state, action: PayloadAction<IAppOrder>) {
      if (!state.order) {
        state.order = action.payload;
      }
    },
    addProducts(state, action: PayloadAction<IOrderProductData[]>) {
      if (!state.order) {
        return;
      }
      state.order.products = action.payload;
    },
    changeProducts(state, action: PayloadAction<IOrderProductData[]>) {
      if (!state.order) {
        return;
      }
      state.order.products = action.payload;
    },
    changeProductQuantity(
      state,
      action: PayloadAction<{id: number; quantity: number}>,
    ) {
      if (!state.order) {
        return;
      }
      console.log(state.order.products);

      state.order.products = state.order.products.map(item => {
        if (item.productId === action.payload.id) {
          return {
            ...item,
            quantity: action.payload.quantity,
          };
        }
        return item;
      });
    },
    addData(state, action: PayloadAction<IOrdersFormData & {valid?: boolean}>) {
      if (!state.order) {
        return;
      }
      const ind = state.order.formData.findIndex(
        item => item.marker === action.payload.marker,
      );

      if (ind !== -1) {
        state.order.formData[ind] = action.payload;
      } else {
        state.order.formData.push(action.payload);
      }
    },
    remove(state) {
      state.selectedDate = undefined;
      state.availableTimes = undefined;
      state.order = undefined;
    },
    addPaymentAccountIdToOrder(state, action: PayloadAction<string>) {
      if (!state.order) {
        return;
      }

      state.order.paymentAccountIdentifier = action.payload;
    },
    addOrderCurrency(state, action: PayloadAction<string>) {
      if (!state.order) {
        return;
      }
      state.currency = action.payload;
    },
    addAvailableTimeSlots(
      state,
      action: PayloadAction<[number, number] | [number, number, number[]]>,
    ) {
      state.availableTimes = action.payload;
    },
    clearTimeSlots(state) {
      state.availableTimes = undefined;
    },
    addSelectedDate(state, action: PayloadAction<string>) {
      state.selectedDate = action.payload;
      // Remove shipping_interval from formData when date changes
      if (state.order?.formData) {
        state.order.formData = state.order.formData.filter(
          item => item.marker !== 'shipping_interval',
        );
      }
      // Reset order time when date changes
      state.orderTime = null;
    },
    addOrderTime(state, action: PayloadAction<number>) {
      state.orderTime = action.payload;
    },
  },
});

export const {
  remove: removeOrder,
  create: createOrder,
  addData,
  addProducts,
  clearTimeSlots,
  addSelectedDate,
  addAvailableTimeSlots,
  addPaymentAccountIdToOrder,
  addOrderTime,
  changeProducts,
} = orderSlice.actions;

export default orderSlice.reducer;
