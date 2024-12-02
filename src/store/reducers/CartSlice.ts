import {CombinedState, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Alert} from 'react-native';
import {RootState} from '../store';

export type CartState = {
  quantity: number;
  id: number;
};

type InitialStateType = {
  products: (CartState & {selected: boolean})[];
  currency?: string;
  shippingPrice?: number;
  total?: number;
};

const initialState: InitialStateType = {
  products: [],
};
export const cartSlice = createSlice({
  name: 'cart-slice',
  initialState,
  reducers: {
    addProductToCart(state, action: PayloadAction<CartState>) {
      if (action.payload.quantity <= 0) {
        return Alert.alert('Product incorrect');
      }
      const index = state.products.findIndex(
        product => product.id === action.payload.id,
      );

      if (index !== -1) {
        state.products[index].quantity += 1;
      } else {
        state.products.push({...action.payload, selected: true});
      }
    },
    removeProduct(state, action: PayloadAction<number>) {
      state.products = state.products.filter(
        (product: CartState) => product.id !== action.payload,
      );
    },
    deselectProduct(state, action: PayloadAction<number>) {
      state.products.map(product => {
        if (product.id === action.payload) {
          product.selected = !product.selected;
        }
      });
    },
    addShippingPrice(state, action: PayloadAction<number>) {
      state.shippingPrice = action.payload;
    },
    decreaseProduct(state, action: PayloadAction<number>) {
      const badIndex = state.products.findIndex((product: CartState) => {
        return product.id === action.payload;
      });
      if (state.products[badIndex]?.quantity > 1) {
        state.products[badIndex].quantity -= 1;
      }
    },
    increaseProduct(state, action: PayloadAction<number>) {
      const badIndex = state.products.findIndex((product: CartState) => {
        return product.id === action.payload;
      });
      state.products[badIndex].quantity += 1;
    },
    removeAllProducts(state) {
      state.products = initialState.products;
    },
    addCurrency(state, action: PayloadAction<string>) {
      if (!state.currency) {
        state.currency = action.payload;
      }
    },
    addCartTotal(state, action: PayloadAction<number>) {
      state.total = action.payload;
    },
  },
});

export const {
  addProductToCart,
  deselectProduct,
  removeProduct,
  decreaseProduct,
  removeAllProducts: removeAllProductsFromCart,
  addShippingPrice,
  addCurrency,
  addCartTotal,
} = cartSlice.actions;

export const selectCartItems = (
  state: CombinedState<{cartReducer: InitialStateType; favoritesReducer: {}}>,
) => state.cartReducer.products;

export const selectCartItemWithIdLength = (
  state: CombinedState<{cartReducer: InitialStateType; favoritesReducer: {}}>,
  id: number,
) => state.cartReducer.products.find(item => item.id === id)?.quantity;

export const selectCartItemWithId = (
  state: CombinedState<{cartReducer: InitialStateType; favoritesReducer: {}}>,
  id: number,
) => state.cartReducer.products.find(item => item.id === id);

export const selectCartSelectedItems = (state: RootState) =>
  state.cartReducer.products.filter(item => item.selected).length;

export const selectBasketCount = (
  state: CombinedState<{cartReducer: InitialStateType; favoritesReducer: {}}>,
) =>
  state.cartReducer.products.reduce(
    (count, product) => count + product.quantity,
    0,
  );

export const selectCartTotal = (state: RootState) => {
  return (
    (state.cartReducer?.total || 0) + (state.cartReducer?.shippingPrice || 0)
  );
};

export default cartSlice.reducer;
