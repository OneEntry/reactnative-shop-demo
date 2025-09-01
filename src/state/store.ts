import {combineReducers, configureStore} from '@reduxjs/toolkit';
import filterReducer from './reducers/FilterSlice';
import systemContentReducer from './reducers/SystemContentSlice';
import userStateReducer from './reducers/userStateSlice';
import orderReducer from './reducers/OrderReducer';
import SignUpFieldsReducer from './reducers/SignUpFieldsReducer';
import ContactUsFieldsReducer from './reducers/ContactUsFieldsReducer';
import lastVisitedScreenReducer from './reducers/lastVisitedScreenSlice';
import {RTKApi} from '../api';
import {listenerMiddleware} from './listeners';

const rootReducer = combineReducers({
  orderReducer,
  filterReducer,
  systemContentReducer,
  SignUpFieldsReducer,
  ContactUsFieldsReducer,
  userStateReducer,
  lastVisitedScreenReducer,
  [RTKApi.reducerPath]: RTKApi.reducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware()
        .prepend(listenerMiddleware.middleware)
        .concat(RTKApi.middleware),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
