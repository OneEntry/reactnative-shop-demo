import {createListenerMiddleware} from '@reduxjs/toolkit';
import {toggleFavorite} from './reducers/userStateSlice';

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: toggleFavorite,
  effect: async (action, listenerApi) => {},
});
