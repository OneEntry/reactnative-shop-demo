import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';

type AddToCartType = {
  id: number;
  quantity?: number;
  [key: string]: any;
};

/**
 * Interface for a cart item in the user's state.
 */
export interface CartItemType {
  id: number;
  quantity: number;
  selected: boolean;
}

/**
 * Interface for the user's state in the Redux store.
 */
export interface UserState {
  cart: CartItemType[]; // Array of cart items
  favorites: number[]; // Array of favorite product IDs
  isUser: boolean; // Indicates whether the user is logged in
  currency?: string; // Currency symbol (optional)
  shippingPrice?: number; // Shipping price (optional)
}

const initialState: UserState = {
  cart: [],
  favorites: [],
  isUser: false,
  currency: '$',
  shippingPrice: 0,
};

/**
 * Creates a Redux slice for managing the user's state.
 */
const userStateSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /**
     * Adds a product to the cart or increments its quantity if it already exists.
     *
     * @function addToCart
     * @param {UserState} state - The current state of the user's state slice.
     * @param {PayloadAction<AddToCartType>} action - The action payload containing the product details.
     */
    addToCart: (state, action: PayloadAction<AddToCartType>) => {
      console.log('add to cart');
      const existing = state.cart.find(item => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.cart.push({
          id: action.payload.id,
          quantity: action.payload?.quantity || 1,
          selected: true,
        });
      }
    },
    /**
     * Removes a product from the cart by its ID.
     *
     * @function removeFromCart
     * @param {UserState} state - The current state of the user's state slice.
     * @param {PayloadAction<number>} action - The action payload containing the product ID.
     */
    removeFromCart: (state, action: PayloadAction<number>) => {
      console.log('remove');
      state.cart = state.cart.filter(item => item.id !== action.payload);
    },
    /**
     * Clears all items from the cart.
     *
     * @function clearCart
     * @param {UserState} state - The current state of the user's state slice.
     */
    clearCart: state => {
      console.log('clear');
      state.cart = [];
    },
    /**
     * Decreases the quantity of a product in the cart by 1.
     *
     * @function decreaseQuantity
     * @param {UserState} state - The current state of the user's state slice.
     * @param {PayloadAction<number>} action - The action payload containing the product ID.
     */
    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.cart.find(item => item.id === action.payload);
      if (item?.quantity > 1) {
        item.quantity -= 1;
      }
    },
    /**
     * Toggles the selection status of a cart item.
     *
     * @function toggleCartItemSelect
     * @param {UserState} state - The current state of the user's state slice.
     * @param {PayloadAction<number>} action - The action payload containing the product ID.
     */
    toggleCartItemSelect: (state, action: PayloadAction<number>) => {
      const existing = state.cart.find(item => item.id === action.payload);
      if (existing) {
        const selected = existing.selected;
        existing.selected = !selected;
      }
    },
    /**
     * Toggles a product's favorite status.
     *
     * @function toggleFavorite
     * @param {UserState} state - The current state of the user's state slice.
     * @param {PayloadAction<number>} action - The action payload containing the product ID.
     */
    toggleFavorite: (state, action: PayloadAction<number>) => {
      console.log('toggle favorite');
      const index = state.favorites.indexOf(action.payload);
      if (index === -1) {
        state.favorites.push(action.payload);
      } else {
        state.favorites.splice(index, 1);
      }
    },
    /**
     * Initializes the user's state with already existing user state.
     *
     * @function initializeUserState
     * @param {UserState} state - The current state of the user's state slice.
     * @param {PayloadAction<Partial<UserState>>} action - The action payload containing partial user state data.
     */
    initializeUserState: (state, action: PayloadAction<Partial<UserState>>) => {
      const incomingCart = action.payload.cart || [];
      const incomingFavorites = action.payload.favorites || [];
      // Добавляем selected: true если отсутствует
      const normalizedCart = incomingCart.map(item => ({
        ...item,
        selected: item.selected ?? true,
      }));

      const mergedCart = normalizedCart.concat(state.cart);
      const mergedFavorites = incomingFavorites.concat(state.favorites);

      const uniqueCart = Array.from(
        mergedCart
          .reduce((acc, item) => {
            if (!acc.has(item.id)) {
              acc.set(item.id, item);
            }
            return acc;
          }, new Map())
          .values(),
      );

      return {
        favorites: mergedFavorites,
        cart: uniqueCart,
        isUser: true,
      };
    },
    /**
     * Resets the user's state to its initial values.
     *
     * @function resetUserState
     * @param {UserState} state - The current state of the user's state slice.
     */
    resetUserState: state => {
      console.log('reset');
      return {
        ...initialState,
        isUser: false,
      };
    },
    /**
     * Sets the currency symbol for the cart.
     *
     * @function addCartCurrency
     * @param {UserState} state - The current state of the user's state slice.
     * @param {PayloadAction<string>} action - The action payload containing the currency symbol.
     */
    addCartCurrency(state, action: PayloadAction<string>) {
      console.log('currency');
      if (!state.currency) {
        state.currency = action.payload;
      }
    },
    /**
     * Sets the shipping price for the cart.
     *
     * @function addShippingPrice
     * @param {UserState} state - The current state of the user's state slice.
     * @param {PayloadAction<number>} action - The action payload containing the shipping price.
     */
    addShippingPrice(state, action: PayloadAction<number>) {
      console.log('shipping');
      state.shippingPrice = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  toggleFavorite,
  toggleCartItemSelect,
  initializeUserState,
  resetUserState,
  clearCart,
  addCartCurrency,
  decreaseQuantity,
  addShippingPrice,
} = userStateSlice.actions;

export default userStateSlice.reducer;

// Custom Selectors

export const getCartItemById = (state: RootState, id: number) => {
  return state.userStateReducer.cart.find(i => i.id === id);
};

export const checkFavoritesItemById = (state: RootState, id: number) => {
  return state.userStateReducer.favorites.includes(id);
};

export const isCartNotEmpty = (state: RootState) => {
  return !!state.userStateReducer.cart.length;
};

export const getCartLength = (state: RootState) => {
  return state.userStateReducer.cart.reduce(
    (count, product) => count + product.quantity,
    0,
  );
};
