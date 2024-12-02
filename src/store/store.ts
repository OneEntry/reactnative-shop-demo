import {combineReducers, configureStore} from '@reduxjs/toolkit';
import cartReducer from './reducers/CartSlice';
import favoritesReducer from './reducers/FavoritesSlice';
import filterReducer from './reducers/FilterSlice';
import systemContentReducer from './reducers/SystemContentSlice';
import orderReducer from './reducers/orderReducer';
import SignUpFieldsReducer from './reducers/signUpFieldsReducer';
import ContactUsFieldsReducer from './reducers/contactUsFieldsReducer';
import {RTKApi} from '../api';

const rootReducer = combineReducers({
  cartReducer,
  favoritesReducer,
  orderReducer,
  filterReducer,
  systemContentReducer,
  SignUpFieldsReducer,
  ContactUsFieldsReducer,
  [RTKApi.reducerPath]: RTKApi.reducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(RTKApi.middleware),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
