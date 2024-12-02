import {CombinedState, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IProductsEntity} from 'oneentry/dist/products/productsInterfaces';

type InitialStateType = {
  products: number[];
};
const initialState: InitialStateType = {
  products: [],
};

export const favoritesSlice = createSlice({
  name: 'favorites-slice',
  initialState,
  reducers: {
    addFavorite(state, action: PayloadAction<number>) {
      const isUnique = state.products.findIndex((product: number) => {
        return product === action.payload;
      });
      if (isUnique === -1) {
        state.products.push(action.payload);
      }
    },
    addFavorites(state, action: PayloadAction<number[]>) {
      state.products = action.payload;
    },
    removeFavorite(state, action: PayloadAction<number>) {
      state.products = state.products.filter(
        (product: number) => product !== action.payload,
      );
    },
    removeAllFavorites(state) {
      state.products = initialState.products;
    },
  },
});

export const {addFavorite, removeFavorite, removeAllFavorites, addFavorites} =
  favoritesSlice.actions;

export const selectIsFavorites = (
  state: CombinedState<{cartReducer: {}; favoritesReducer: InitialStateType}>,
  id: number,
): boolean => {
  const added = state.favoritesReducer.products.findIndex(
    product => product === id,
  );

  return added !== -1;
};

export default favoritesSlice.reducer;
