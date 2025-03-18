import {combineReducers, configureStore} from '@reduxjs/toolkit';
import filterReducer from './reducers/FilterSlice';
import systemContentReducer from './reducers/SystemContentSlice';
import userStateReducer from './reducers/userStateSlice';
import orderReducer from './reducers/OrderReducer';
import SignUpFieldsReducer from './reducers/SignUpFieldsReducer';
import ContactUsFieldsReducer from './reducers/ContactUsFieldsReducer';
import {RTKApi} from '../api';

const rootReducer = combineReducers({
  orderReducer,
  filterReducer,
  systemContentReducer,
  SignUpFieldsReducer,
  ContactUsFieldsReducer,
  userStateReducer,
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
