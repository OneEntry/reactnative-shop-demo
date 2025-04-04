import {
  IOrderProductData,
  IOrdersFormData,
} from 'oneentry/dist/orders/ordersInterfaces';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type IAppOrder = {
  formIdentifier?: string;
  paymentAccountIdentifier?: string;
  formData: Array<IOrdersFormData & {valid?: boolean}>;
  products: Array<IOrderProductData>;
};

type InitialStateType = {
  order: IAppOrder | undefined;
  currency?: string;
  availableTimes?: [number, number] | [number, number, number[]];
  paymentMethods?: Array<{
    identifier: string;
  }>;
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
    addAvailableTimeSlots(state, action: PayloadAction<[number, number] | [number, number, number[]]>) {
      console.log(action.payload);
      state.availableTimes = action.payload;
    },
    clearTimeSlots(state) {
      state.availableTimes = undefined;
    },
  },
});

export const {
  remove: removeOrder,
  create: createOrder,
  addData,
  addProducts,
  clearTimeSlots,
  addAvailableTimeSlots,
  addPaymentAccountIdToOrder,
} = orderSlice.actions;

export default orderSlice.reducer;
